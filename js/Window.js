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
    this.movable = configuration.movable;
    this.moveStartPosition = null;
    this.moveStartWindowLocation = null;
    this.originalContainer = !!element ? element.parentNode : null;
    this.resizable =  configuration.resizable;
    this.resizeStartPosition = null;
    this.resizeStartControlsSize = null;
    this.resizeStartWindowLocation = null;
    this.showCloseButton = configuration.showCloseButton;
    this.showMaximizeButton = configuration.showMaximizeButton;
    this.title = configuration.title;

    this.$element = $(element || this._createWindowElement());
    this.controls = {
        bottomActionsPanel: this.$element.children(".tui-window-actions"),
        bottomResizeBar: null,
        bottomRightResizeBar: null,
        closeButton: null,
        contentPanel: this.$element.children(".tui-window-content"),
        leftResizeBar: null,
        maximizeButton: null,
        rightResizeBar: null,
        titlePanel: this.$element.children(".tui-window-title"),
        titleLabel: this.$element.find(".tui-window-title > span"),
        topActionsPanel: null,
        topResizeBar: null
    };
    this.eventBindings = {
        mouseDown: {
            bottomResizeBar: this._beginBottomBarResizing.bind(this),
            bottomRightResizeBar: this._beginBottomRightBarResizing.bind(this),
            leftResizeBar: this._beginLeftBarResizing.bind(this),
            rightResizeBar: this._beginRightBarResizing.bind(this),
            titlePanel: this._beginMovingWindow.bind(this),
            topResizeBar: this._beginTopBarResizing.bind(this)
        },
        mouseMove: {
            bottomResizeBar: this._onResizeBottomBar.bind(this),
            bottomRightResizeBar: this._onResizeBottomRightBar.bind(this),
            leftResizeBar: this._onResizeLeftBar.bind(this),
            rightResizeBar: this._onResizeRightBar.bind(this),
            titlePanel: this._onMoveWindow.bind(this),
            topResizeBar: this._onResizeTopBar.bind(this)
        },
        mouseUp: {
            bottomResizeBar: this._endBottomBarResizing.bind(this),
            bottomRightResizeBar: this._endBottomRightBarResizing.bind(this),
            leftResizeBar: this._endLeftBarResizing.bind(this),
            rightResizeBar: this._endRightBarResizing.bind(this),
            titlePanel: this._endMovingWindow.bind(this),
            topResizeBar: this._endTopBarResizing.bind(this)
        }
    };
};

/**
 * Enumeration of available control events.
 * @enum
 */
TotemUI.Window.events = _.extend({}, TotemUI.DialogControl.events, {
    maximizing: "maximizing",
    maximized: "maximized",
    minimizing: "minimizing",
    minimized: "minimized",
    move: "move",
    moveEnd: "moveEnd",
    moveStart: "moveStart",
    movableChanged: "movableChanged",
    resize: "resize",
    resizeEnd: "resizeEnd",
    resizeStart: "resizeStart",
    resizableChanged: "resizableChanged",
    showCloseButtonChanged: "showCloseButtonChanged",
    showMaximizeButtonChanged: "showMaximizeButtonChanged",
    titleChanged: "titleChanged"
});

/**
 * Default configuration of the Window control.
 * @class
 */
TotemUI.Window.defaultConfiguration = {
    maximized: false,
    movable: true,
    resizable: true,
    showCloseButton: true,
    showMaximizeButton: true,
    title: ""
};

TotemUI.Window.prototype = TotemUI.Util.extend(TotemUI.DialogControl.prototype, {
    /**
     * Called when user initiated moving of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _beginMovingWindow: function _beginMovingWindow(e) {
        e.preventDefault();

        if (this.$element.is(".maximized"))
            return;

        var moveEventArgs = new TotemUI.Events.CancellableEvent();
        this._trigger(TotemUI.Window.events.moveStart, moveEventArgs);
        if (moveEventArgs.isCancelled())
            return;

        this.moveStartPosition = {
            x: e.pageX,
            y: e.pageY
        };

        var windowOffset = this.$element.offset();
        this.moveStartWindowLocation = {
            x: windowOffset.left,
            y: windowOffset.top
        };

        this.$element.css({
            marginLeft: "0",
            marginTop: "0",
            left: this.moveStartWindowLocation.x,
            top: this.moveStartWindowLocation.y
        });

        $(window).on("mousemove", this.eventBindings.mouseMove.titlePanel)
                 .on("mouseup", this.eventBindings.mouseUp.titlePanel);
    },
    /**
     * Universal method for starting resizing of the window.
     *
     * @param e Event arguments from jQuery.
     * @param mouseMove Method to call after moving mouse.
     * @param mouseUp Method to call after releasing mouse button.
     * @private
     */
    _beginResizing: function _beginResizing(e, mouseMove, mouseUp) {
        e.preventDefault();

        var resizeEventArgs = new TotemUI.Events.CancellableEvent();
        this._trigger(TotemUI.Window.events.resizeStart, resizeEventArgs);
        if (resizeEventArgs.isCancelled())
            return;

        var windowOffset = this.$element.offset();
        this.resizeStartWindowLocation = {
            x: windowOffset.left,
            y: windowOffset.top
        };

        this.resizeStartPosition = {
            x: e.pageX,
            y: e.pageY
        };

        this.resizeStartControlsSize = {
            contentPanel: {
                height: this.controls.contentPanel.height(),
                width: this.controls.contentPanel.width()
            },
            window: {
                height: this.$element.height(),
                width: this.$element.width()
            }
        };

        this.$element.css({
            marginLeft: "0",
            marginTop: "0",
            left: this.resizeStartWindowLocation.x,
            top: this.resizeStartWindowLocation.y
        });

        $(window).on("mousemove", mouseMove)
                 .on("mouseup", mouseUp);
    },
    /**
     * Called when user initiated resizing of the bottom bar of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _beginBottomBarResizing: function _beginBottomBarResizing(e) {
        this._beginResizing(e, this.eventBindings.mouseMove.bottomResizeBar, this.eventBindings.mouseUp.bottomResizeBar)
    },
    /**
     * Called when user initiated resizing of the bottom right bar of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _beginBottomRightBarResizing: function _beginBottomRightBarResizing(e) {
        this._beginResizing(e, this.eventBindings.mouseMove.bottomRightResizeBar, this.eventBindings.mouseUp.bottomRightResizeBar);
    },
    /**
     * Called when user initiated resizing of the left bar of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _beginLeftBarResizing: function _beginLeftBarResizing(e) {
        this._beginResizing(e, this.eventBindings.mouseMove.leftResizeBar, this.eventBindings.mouseUp.leftResizeBar);
    },
    /**
     * Called when user initiated resizing of the right bar of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _beginRightBarResizing: function _beginRightBarResizing(e) {
        this._beginResizing(e, this.eventBindings.mouseMove.rightResizeBar, this.eventBindings.mouseUp.rightResizeBar);
    },
    /**
     * Called when user initiated resizing of the top bar of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _beginTopBarResizing: function _beginTopBarResizing(e) {
        this._beginResizing(e, this.eventBindings.mouseMove.topResizeBar, this.eventBindings.mouseUp.topResizeBar);
    },
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
     * Called when user stopped moving the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _endMovingWindow: function _endMovingWindow(e) {
        $(window).off("mousemove", this.eventBindings.mouseMove.titlePanel)
                 .off("mouseup", this.eventBindings.mouseUp.titlePanel);

        this.moveStartPosition = null;
        this.moveStartWindowLocation = null;

        this._trigger(TotemUI.Window.events.moveEnd);
    },
    /**
     * Universal method for ending resizing of the window.
     *
     * @param e Event arguments from jQuery.
     * @param mouseMove Method bound to mouse move event of the window.
     * @param mouseUp Method bound to mouse up event of the window.
     * @private
     */
    _endResizing: function _endResizing(e, mouseMove, mouseUp) {
        $(window).off("mousemove", mouseMove)
                 .off("mouseup", mouseUp);

        this.resizeStartPosition = null;
        this.resizeStartControlsSize = null;
        this.resizeStartWindowLocation = null;

        this._trigger(TotemUI.Window.events.resizeEnd);
    },
    /**
     * Called when user stopped resizing of the bottom bar of window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _endBottomBarResizing: function _endBottomBarResizing(e) {
        this._endResizing(e, this.eventBindings.mouseMove.bottomResizeBar, this.eventBindings.mouseUp.bottomResizeBar);
    },
    /**
     * Called when user stopped resizing of the bottom right bar of window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _endBottomRightBarResizing: function _endBottomRightBarResizing(e) {
        this._endResizing(e, this.eventBindings.mouseMove.bottomRightResizeBar, this.eventBindings.mouseUp.bottomRightResizeBar);
    },
    /**
     * Called when user stopped resizing of the left bar of window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _endLeftBarResizing: function _endLeftBarResizing(e) {
        this._endResizing(e, this.eventBindings.mouseMove.leftResizeBar, this.eventBindings.mouseUp.leftResizeBar);
    },
    /**
     * Called when user stopped resizing of the right bar of window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _endRightBarResizing: function _endRightBarResizing(e) {
        this._endResizing(e, this.eventBindings.mouseMove.rightResizeBar, this.eventBindings.mouseUp.rightResizeBar);
    },
    /**
     * Called when user stopped resizing of the top bar of window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _endTopBarResizing: function _endTopBarResizing(e) {
        this._endResizing(e, this.eventBindings.mouseMove.topResizeBar, this.eventBindings.mouseUp.topResizeBar);
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

        if (this.movable)
            this.$element.addClass("movable");

        if (this.resizable)
            this.$element.addClass("resizable");

        this._setupTopActionsPanel();
        this._setupResizeBars();
        this._setupMovingWindow();

        return true;
    },
    /**
     * Called when user has changed position of the window.
     * @param e Event arguments from jQuery.
     * @private
     */
    _onMoveWindow: function _onMoveWindow(e) {
        var deltaPositionX = e.pageX - this.moveStartPosition.x;
        var deltaPositionY = e.pageY - this.moveStartPosition.y;
        this.$element.css("left", this.moveStartWindowLocation.x + deltaPositionX)
                     .css("top", this.moveStartWindowLocation.y + deltaPositionY);

        this._trigger(TotemUI.Window.events.move);
    },
    /**
     * Called when user has changed size of the window using bottom border.
     * @param e Event arguments from jQuery.
     * @private
     */
    _onResizeBottomBar: function _onResizeBottomBar(e) {
        var deltaPositionY = e.pageY - this.resizeStartPosition.y;
        this.controls.contentPanel.height(this.resizeStartControlsSize.contentPanel.height + deltaPositionY);
        this.$element.height(this.resizeStartControlsSize.window.height + deltaPositionY);

        this._trigger(TotemUI.Window.events.resize);
    },
    /**
     * Called when user has changed size of the window using bottom right corner.
     * @param e Event arguments from jQuery.
     * @private
     */
    _onResizeBottomRightBar: function _onResizeBottomRightBar(e) {
        var deltaPositionX = e.pageX - this.resizeStartPosition.x;
        var deltaPositionY = e.pageY - this.resizeStartPosition.y;
        this.controls.contentPanel.height(this.resizeStartControlsSize.contentPanel.height + deltaPositionY);
        this.$element.height(this.resizeStartControlsSize.window.height + deltaPositionY);
        this.$element.width(this.resizeStartControlsSize.window.width + deltaPositionX);

        this._trigger(TotemUI.Window.events.resize);
    },
    /**
     * Called when user has changed size of the window using left border.
     * @param e Event arguments from jQuery.
     * @private
     */
    _onResizeLeftBar: function _onResizeLeftBar(e) {
        var deltaPositionX = e.pageX - this.resizeStartPosition.x;
        this.$element.css("left", this.resizeStartWindowLocation.x + deltaPositionX)
                     .width(this.resizeStartControlsSize.window.width - deltaPositionX);

        this._trigger(TotemUI.Window.events.resize);
    },
    /**
     * Called when user has changed size of the window using right border.
     * @param e Event arguments from jQuery.
     * @private
     */
    _onResizeRightBar: function _onResizeRightBar(e) {
        var deltaPositionX = e.pageX - this.resizeStartPosition.x;
        this.$element.width(this.resizeStartControlsSize.window.width + deltaPositionX);

        this._trigger(TotemUI.Window.events.resize);
    },
    /**
     * Called when user has changed size of the window using top border.
     * @param e Event arguments from jQuery.
     * @private
     */
    _onResizeTopBar: function _onResizeTopBar(e) {
        var deltaPositionY = e.pageY - this.resizeStartPosition.y;
        this.controls.contentPanel.height(this.resizeStartControlsSize.contentPanel.height - deltaPositionY);
        this.$element.css("top", this.resizeStartWindowLocation.y + deltaPositionY)
                     .height(this.resizeStartControlsSize.window.height - deltaPositionY);

        this._trigger(TotemUI.Window.events.resize);
    },
    /**
     * Sets up moving of the window.
     * @private
     */
    _setupMovingWindow: function _setupMovingWindow() {
        this.controls.titlePanel.on("mousedown", this.eventBindings.mouseDown.titlePanel);
    },
    /**
     * Sets up bars for resizing the window.
     * Also it ties event handlers for them.
     * @private
     */
    _setupResizeBars: function _setupResizeBars() {
        var bottomResizeBar = document.createElement("div");
        var bottomRightResizeBar = document.createElement("div");
        var leftResizeBar = document.createElement("div");
        var rightResizeBar = document.createElement("div");
        var topResizeBar = document.createElement("div");

        // Setting classes for controls.
        bottomResizeBar.className = "tui-resize-bar bottom";
        bottomRightResizeBar.className = "tui-resize-bar bottom-right";
        leftResizeBar.className = "tui-resize-bar left";
        rightResizeBar.className = "tui-resize-bar right";
        topResizeBar.className = "tui-resize-bar top";

        // Adding controls to the window element
        this.$element.append(bottomResizeBar)
                     .append(leftResizeBar)
                     .append(rightResizeBar)
                     .append(topResizeBar)
                     .append(bottomRightResizeBar);

        // Setting references to the controls - they can be useful in disposing the control.
        this.controls.bottomResizeBar = $(bottomResizeBar);
        this.controls.bottomRightResizeBar = $(bottomRightResizeBar);
        this.controls.leftResizeBar = $(leftResizeBar);
        this.controls.rightResizeBar = $(rightResizeBar);
        this.controls.topResizeBar = $(topResizeBar);

        // Adding event handlers
        this.controls.bottomResizeBar.on("mousedown", this.eventBindings.mouseDown.bottomResizeBar);
        this.controls.bottomRightResizeBar.on("mousedown", this.eventBindings.mouseDown.bottomRightResizeBar);
        this.controls.leftResizeBar.on("mousedown", this.eventBindings.mouseDown.leftResizeBar);
        this.controls.rightResizeBar.on("mousedown", this.eventBindings.mouseDown.rightResizeBar);
        this.controls.topResizeBar.on("mousedown", this.eventBindings.mouseDown.topResizeBar);
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
                     .removeClass("maximized")
                     .removeClass("movable")
                     .removeClass("resizable")
                     .css({
                         height: "",
                         left: "",
                         marginLeft: "",
                         marginTop: "",
                         top: "",
                         width: ""
                     });

        // Cleaning up content styles
        this.controls.contentPanel.css({
            height: ""
        });

        // Removing event handler from title bar
        this.controls.titlePanel.off("mousedown", this.eventBindings.mouseDown.titlePanel);

        // Removing top actions panel
        this.controls.topActionsPanel.remove();

        // Removing resize bars
        this.controls.bottomResizeBar.remove();
        this.controls.bottomRightResizeBar.remove();
        this.controls.leftResizeBar.remove();
        this.controls.rightResizeBar.remove();
        this.controls.topResizeBar.remove();

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
     * Gets actions of the Window control.
     * @returns {HTMLElement[]} Action elements.
     */
    getActions: function getActions() {
        return this.controls.bottomActionsPanel[0].children;
    },
    /**
     * Gets HTML content of the actions panel of the Window.
     * @returns {String} HTML with Window actions.
     */
    getActionsHtml: function getActionsHtml() {
        return this.controls.bottomActionsPanel.html();
    },
    /**
     * Gets content of the Window control.
     * @returns {HTMLElement[]} Content elements.
     */
    getContent: function getContent() {
        return this.controls.contentPanel[0].children;
    },
    /**
     * Gets HTML content of the Window control.
     * @returns {String} Content of the Window.
     */
    getContentHtml: function getContentHtml() {
        return this.controls.contentPanel.html();
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
     * Gets if the window is movable.
     * @returns {boolean} True if the window is movable; otherwise false.
     */
    isMovable: function isMovable() {
        return this.movable;
    },
    /**
     * Gets if the window is resizable.
     * @returns {boolean} True if is resizable; otherwise false.
     */
    isResizable: function isResizable() {
        return this.resizable;
    },
    /**
     * Maximizes the window.
     */
    maximize: function maximize() {
        if (!this.showMaximizeButton || this.maximized)
            return;

        var maximizingEventArgs = new TotemUI.Events.CancellableEvent();
        this._trigger(TotemUI.Window.events.maximizing, maximizingEventArgs);

        if (maximizingEventArgs.isCancelled())
            return;

        this.maximized = true;
        this.$element.addClass("maximized");

        this._trigger(TotemUI.Window.events.maximized, new TotemUI.Events.ValueChangedEvent(false, true));
    },
    /**
     * Minimizes the window.
     */
    minimize: function minimize() {
        if (!this.showMaximizeButton || !this.maximized)
            return;

        var minimizingEventArgs = new TotemUI.Events.CancellableEvent();
        this._trigger(TotemUI.Window.events.minimizing, minimizingEventArgs);

        if (minimizingEventArgs.isCancelled())
            return;

        this.maximized = false;
        this.$element.removeClass("maximized");

        this._trigger(TotemUI.Window.events.minimized, new TotemUI.Events.ValueChangedEvent(true, false));
    },
    /**
     * Sets actions of the Window control.
     * @param {HTMLElement[]|HTMLElement} actions Actions to set - either HTMLElement or array of HTMLElements
     */
    setActions: function setActions(actions) {
        // Cleaning up the actions before setting it.
        var bottomActionsPanel = this.controls.bottomActionsPanel[0];
        var childrenLength = bottomActionsPanel.children.length;
        for (var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++) {
            bottomActionsPanel.removeChild(bottomActionsPanel.children[0]);
        }

        // Checking if this is array of elements to insert.
        if (TotemUI.Util.isArray(actions)) {
            for (var contentIndex = 0; contentIndex < actions.length; contentIndex++) {
                bottomActionsPanel.appendChild(actions[contentIndex]);
            }
        } else {
            bottomActionsPanel.appendChild(actions);
        }
    },
    /**
     * Sets HTML of the Window's actions panel.
     * @param {String} actionsHtml HTML with actions to set.
     */
    setActionsHtml: function setActionsHtml(actionsHtml) {
        this.controls.bottomActionsPanel.html(actionsHtml);
    },
    /**
     * Sets visibility of the "Close" button.
     * @param {boolean} visible True if the button should be visible; otherwise false.
     */
    setCloseButtonVisibility: function setCloseButtonVisibility(visible) {
        if (this.showCloseButton === visible)
            return;

        var previousValue = this.showCloseButton;
        this.showCloseButton = visible;

        if (visible) {
            this.controls.closeButton.addClass("shown");
        } else {
            this.controls.closeButton.removeClass("shown");
        }

        this._trigger(TotemUI.Window.events.showCloseButtonChanged, new TotemUI.Events.ValueChangedEvent(previousValue, visible));
    },
    /**
     * Sets content of the Window control.
     * @param {HTMLElement[]|HTMLElement} content Content to set - either HTMLElement of array of HTMLElements.
     */
    setContent: function setContent(content) {
        // Cleaning up the content before setting it.
        var contentPanel = this.controls.contentPanel[0];
        var childrenLength = contentPanel.children.length;
        for (var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++) {
            contentPanel.removeChild(contentPanel.children[0]);
        }

        // Checking if this is array of elements to insert.
        if (TotemUI.Util.isArray(content)) {
            for (var contentIndex = 0; contentIndex < content.length; contentIndex++) {
                contentPanel.appendChild(content[contentIndex]);
            }
        } else {
            contentPanel.appendChild(content);
        }
    },
    /**
     * Sets content of the Window control.
     * @param {String} htmlContent HTML content to set.
     */
    setContentHtml: function setContentHtml(htmlContent) {
        this.controls.contentPanel.html(htmlContent);
    },
    /**
     * Sets visibility of the "Maximize" button.
     * @param {boolean} visible True if the button should be visible; otherwise false.
     */
    setMaximizeButtonVisibility: function setMaximizeButtonVisibility(visible) {
        if (this.showMaximizeButton === visible)
            return;

        var previousValue = this.showMaximizeButton;
        this.showMaximizeButton = visible;

        if (visible) {
            this.controls.maximizeButton.addClass("shown");
        } else {
            this.controls.maximizeButton.removeClass("shown");
        }

        this._trigger(TotemUI.Window.events.showMaximizeButtonChanged, new TotemUI.Events.ValueChangedEvent(previousValue, visible));
    },
    /**
     * Sets the movable property of the window.
     * @param {boolean} value True if the window should be movable; otherwise false.
     */
    setMovable: function setMovable(value) {
        if (this.movable === value)
            return;

        var previousValue = this.movable;
        this.movable = value;

        if (value)
            this.$element.addClass("movable");
        else
            this.$element.removeClass("movable");

        this._trigger(TotemUI.Window.events.movableChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the resizable property of the window.
     * @param {boolean} value True if the window should be resizable; otherwise false.
     */
    setResizable: function setResizable(value) {
        if (this.resizable === value)
            return;

        var previousValue = this.resizable;
        this.resizable = value;

        if (value)
            this.$element.addClass("resizable");
        else
            this.$element.removeClass("resizable");

        this._trigger(TotemUI.Window.events.resizableChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the title of the window control.
     * @param {String} value Title to set.
     */
    setTitle: function setTitle(value) {
        if (this.title === value)
            return;

        var previousValue = this.title;
        this.title = value;
        this.controls.titleLabel.text(value);

        this._trigger(TotemUI.Window.events.titleChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
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