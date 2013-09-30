var TotemUI = TotemUI || {};

/**
 * Creates instance of the Window control.
 *
 * @param {HTMLElement|jQuery|String} [element] DOM element of the window.
 * @param {*} [configuration] Configuration of the window element.
 *
 * @constructor
 * @class
 * @extends TotemUI.DialogControl
 */
TotemUI.Window = function Window(element, configuration) {
    TotemUI.DialogControl.apply(this, [configuration]);

    configuration = _.extend({}, TotemUI.Window.defaultConfiguration, configuration);

    this.maximized = configuration.maximized && configuration.showMaximizeButton;
    this.originalContainer = !!element ? element.parentNode : null;
    this.showCloseButton = configuration.showCloseButton;
    this.showMaximizeButton = configuration.showMaximizeButton;
    this.title = configuration.title;

    this.$element = $(element || this._createWindowElement());
    this.controls = {
        bottomActionsPanel: this.$element.children(".tui-window-actions"),
        closeButton: null,
        contentPanel: this.$element.children(".tui-window-content"),
        maximizeButton: null,
        titlePanel: this.$element.children(".tui-window-title"),
        titleLabel: this.$element.find(".tui-window-title > span"),
        topActionsPanel: null
    };
};

/**
 * Enumeration of available control events.
 * @enum
 */
TotemUI.Window.events = _.extend({}, TotemUI.DialogControl.events, {
    maximizing: "maximizing",
    maximized: "maximized"
});

/**
 * Default configuration of the Window control.
 * @class
 */
TotemUI.Window.defaultConfiguration = {
    maximized: false,
    showCloseButton: true,
    showMaximizeButton: true,
    title: ""
};

TotemUI.Window.prototype = TotemUI.Util.extend(TotemUI.DialogControl.prototype, {
    /**
     * Creates new Window element - this element will not be added to any DOM node.
     * Will only exist in the memory.
     * @returns {HTMLElement} Created Window element.
     * @private
     */
    _createWindowElement: function _createWindowElement() {
        var element = document.createElement("div");
        var titlePanel = document.createElement("div");
        var contentPanel = document.createElement("div");
        var actionsPanel = document.createElement("div");

        titlePanel.className = "tui-window-title";
        titlePanel.innerText = this.title;

        contentPanel.className = "tui-window-content";
        actionsPanel.className = "tui-window-actions";

        element.appendChild(titlePanel);
        element.appendChild(contentPanel);
        element.appendChild(actionsPanel);

        return element;
    },
    /**
     * Initializes instance of the Window control.
     * Window this is hidden by default.
     * @returns {boolean} True if initialization has succeeded; otherwise false.
     * @protected
     */
    _initialize: function _initialize() {
        if (!TotemUI.DialogControl.prototype._initialize.apply(this, arguments))
            return false;

        this.$element.addClass("tui-window");
        this.$element.appendTo(document.body);

        this._setupTopActionsPanel();

        return true;
    },
    /**
     * Sets up Top Actions panel of the Window control.
     * @private
     */
    _setupTopActionsPanel: function _setupTopActionsPanel() {
        var topActionsPanel = document.createElement("div");
        var maximizeButton = document.createElement("button");
        var closeButton = document.createElement("button");

        // Setting up Top Actions panel
        topActionsPanel.className = "tui-window-top-actions";

        // Setting up Maximize button
        maximizeButton.className = "tui-maximize-button" + (this.showMaximizeButton ? " shown" : "");
        maximizeButton.type = "button";
        maximizeButton.innerHTML = "M";
        maximizeButton.title = "Maximize the window.";

        // Setting up Close button
        closeButton.className = "tui-close-window-button" + (this.showCloseButton ? " shown" : "");
        closeButton.type = "button";
        closeButton.innerHTML = "&times;";
        closeButton.title = "Close the window.";

        // Adding buttons to panel
        topActionsPanel.appendChild(maximizeButton);
        topActionsPanel.appendChild(closeButton);

        // Adding panel to the window.
        this.$element.prepend(topActionsPanel);

        // Setting dialog properties
        this.controls.closeButton = $(closeButton);
        this.controls.maximizeButton = $(maximizeButton);
        this.controls.topActionsPanel = $(topActionsPanel);

        // Setting up event handlers
        this.controls.closeButton.click(this.hide.bind(this));
        this.controls.maximizeButton.click(this.toggleMaximize.bind(this));
    },
    /**
     * Disposes instance of the Window control.
     */
    dispose: function dispose() {
        if (this.isShown())
            this.hide();

        // Cleaning up window classes
        this.$element.removeClass("tui-window")
                     .removeClass("shown")
                     .removeClass("maximized");

        // Removing top actions panel
        this.controls.topActionsPanel.remove();

        // Checking if original container existed
        if (this.originalContainer) {
            // Moving the element to original container
            this.originalContainer.appendChild(this.$element[0]);
        } else {
            // Removing the element - it is not needed anymore
            // since it was created by this control
            this.$element.remove();
        }

        // Disposing changes from DialogControl
        TotemUI.DialogControl.prototype.dispose.apply(this, arguments);
    },
    /**
     * Gets title set in the Window control.
     * @returns {String} Title of the window.
     */
    getTitle: function getTitle() {
        return this.title;
    },
    /**
     * Hides the Window.
     * @returns {boolean} True if hiding was successful; otherwise false.
     */
    hide: function hide() {
        if (!TotemUI.DialogControl.prototype.hide.apply(this, arguments))
            return false;

        this.$element.removeClass("shown");

        this._endHide();
        return true;
    },
    /**
     * Gets if the "Close" button is shown.
     * @returns {boolean} True if is shown; otherwise false.
     */
    isCloseButtonShown: function isCloseButtonShown() {
        return this.showCloseButton;
    },
    /**
     * Gets if the "Maximize" button is shown.
     * @returns {boolean} True if is shown; otherwise false;
     */
    isMaximizeButtonShown: function isMaximizeButtonShown() {
        return this.showMaximizeButton;
    },
    /**
     * Gets if the window is maximized.
     * @returns {boolean} True if is maximized; otherwise false.
     */
    isMaximized: function isMaximized() {
        return this.maximized;
    },
    /**
     * Maximizes the window.
     */
    maximize: function maximize() {
        if (!this.showMaximizeButton)
            return;

        this.maximized = true;
        this.$element.addClass("maximized");
    },
    /**
     * Minimizes the window.
     */
    minimize: function minimize() {
        if (!this.showMaximizeButton)
            return;

        this.maximized = false;
        this.$element.removeClass("maximized");
    },
    /**
     * Sets visibility of the "Close" button.
     * @param {boolean} visible True if the button should be visible; otherwise false.
     */
    setCloseButtonVisibility: function setCloseButtonVisibility(visible) {
        if (this.showCloseButton === visible)
            return;

        this.showCloseButton = visible;
        if (visible) {
            this.controls.closeButton.addClass("shown");
        } else {
            this.controls.closeButton.removeClass("shown");
        }
    },
    /**
     * Sets visibility of the "Maximize" button.
     * @param {boolean} visible True if the button should be visible; otherwise false.
     */
    setMaximizeButtonVisibility: function setMaximizeButtonVisibility(visible) {
        if (this.showMaximizeButton === visible)
            return;

        this.showMaximizeButton = visible;
        if (visible) {
            this.controls.maximizeButton.addClass("shown");
        } else {
            this.controls.maximizeButton.removeClass("shown");
        }
    },
    /**
     * Sets the title of the window control.
     * @param {String} value Title to set.
     */
    setTitle: function setTitle(value) {
        this.title = value;
        this.controls.titleLabel.text(value);
    },
    /**
     * Shows the Window.
     * @returns {boolean} True if showing was successful; otherwise false.
     */
    show: function show() {
        if (!TotemUI.DialogControl.prototype.show.apply(this, arguments))
            return false;

        this.$element.addClass("shown");

        this._endShow();
        return true;
    },
    /**
     * Toggles between minimized and maximized state of the window.
     */
    toggleMaximize: function toggleMaximize() {
        this.isMaximized() ? this.minimize() : this.maximize();
    }
});