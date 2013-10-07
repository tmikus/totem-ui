var TotemUI = TotemUI || {};

/**
 * Creates instance of the TwoStageButton control.
 *
 * @param {HTMLElement|jQuery|String} element DOM element selector of the button.
 * @param {*} [configuration] Configuration of the Two Stage Button control.
 *
 * @constructor
 * @class
 * @extends TotemUI.Control
 */
TotemUI.TwoStageButton = function TwoStageButton(element, configuration) {
    TotemUI.Control.apply(this, [configuration]);

    configuration = _.extend({}, TotemUI.TwoStageButton.defaultConfiguration, configuration);

    this.$element = $(element);
    this.clickTimeout = configuration.clickTimeout;
    this.confirmElement = null;
    this.confirmMessage = configuration.confirmMessage;
    this.contentElement = null;
    this.content = configuration.content;
    this.isClicked = false;
    this.isInitialized = false;
    this.pendingClickTimeout = null;
    this.startTimeoutAfterClick = configuration.startTimeoutAfterClick;

    this.eventBindings = {
        click: this._onButtonClick.bind(this),
        mouseLeave: this._onButtonLeave.bind(this)
    };

    this._initialize();
};

/**
 * Enumeration of available control events.
 * @enum string
 */
TotemUI.TwoStageButton.events = _.extend({}, TotemUI.Control.events, {
    click: "click",
    clickTimeoutChanged: "clickTimeoutChanged",
    confirmMessageChanged: "confirmMessageChanged",
    contentChanged: "contentChanged",
    startTimeoutAfterClickChanged: "startTimeoutAfterClickChanged"
});

/**
 * Default configuration of the Two Stage Button control.
 * @class
 */
TotemUI.TwoStageButton.defaultConfiguration = {
    clickTimeout: 1000,
    confirmMessage: "Are you sure?",
    content: "",
    startTimeoutAfterClick: false
};

TotemUI.TwoStageButton.prototype = TotemUI.Util.extend(TotemUI.Control.prototype, {
    /**
     * Initializes the instance of the Two Stage Button.
     * @private
     */
    _initialize: function _initialize() {
        if (this.isInitialized)
            return;

        this.$element.addClass("tui-two-stage-button")
                     .on("click", this.eventBindings.click)
                     .on("mouseleave", this.eventBindings.mouseLeave);

        var confirmElement = document.createElement("span");
        confirmElement.className = "tui-tsb-confirmation";
        confirmElement.innerText = this.confirmMessage;

        var contentElement = document.createElement("div");
        contentElement.className = "tui-tsb-content";
        contentElement.innerHTML = this.content;

        this.$element.append(contentElement);
        this.$element.append(confirmElement);

        this.confirmElement = confirmElement;
        this.contentElement = contentElement;
        this.isInitialized = true;
    },
    /**
     * Called after clicking on the Two Stage Button.
     * @private
     */
    _onButtonClick: function _onButtonClick() {
        if (!this.isClicked) {
            this.isClicked = true;
            this.$element.addClass("tui-tsp-confirm");

            if (this.startTimeoutAfterClick)
                this.pendingClickTimeout = setTimeout(this._onButtonClickTimeout.bind(this), this.clickTimeout);

            return;
        }

        this.isClicked = false;
        clearTimeout(this.pendingClickTimeout);
        this.pendingClickTimeout = null;
        this.$element.removeClass("tui-tsp-confirm");
        this._trigger(TotemUI.TwoStageButton.events.click);
    },
    /**
     * Called after leaving the button.
     * @private
     */
    _onButtonLeave: function _onButtonLeave() {
        if (this.startTimeoutAfterClick || this.pendingClickTimeout)
            return;

        this.pendingClickTimeout = setTimeout(this._onButtonClickTimeout.bind(this), this.clickTimeout);
    },
    /**
     * Called after button click has timed out.
     * @private
     */
    _onButtonClickTimeout: function _onButtonClickTimeout() {
        this.isClicked = false;
        this.pendingClickTimeout = null;
        this.$element.removeClass("tui-tsp-confirm");
    },
    /**
     * Disposes instance of the Two Stage Button.
     */
    dispose: function dispose() {
        this.$element[0].removeChild(this.confirmElement);
        this.$element[0].removeChild(this.contentElement);

        this.$element.off("click", this.eventBindings.click)
                     .off("mouseleave", this.eventBindings.mouseLeave)
                     .removeClass("tui-tsp-confirm")
                     .removeClass("tui-two-stage-button");

        this.confirmElement = null;
        this.contentElement = null;

        TotemUI.Control.prototype.dispose.apply(this, arguments);
    },
    /**
     * Gets the field 'clickTimeout' of the class.
     */
    getClickTimeout: function getClickTimeout() {
        return this.clickTimeout;
    },
    /**
     * Gets the field 'confirmMessage' of the class.
     */
    getConfirmMessage: function getConfirmMessage() {
        return this.confirmMessage;
    },
    /**
     * Gets the field 'content' of the class.
     */
    getContent: function getContent() {
        return this.content;
    },
    /**
     * Gets if the timeout is started after clicking on the button.
     * @returns {boolean} True if is started after clicking; otherwise false.
     */
    isStartingTimeoutAfterClick: function isStartingTimeoutAfterClick() {
        return this.startTimeoutAfterClick;
    },
    /**
     * Sets the field 'clickTimeout' of the class.
     * @prop {Number} value Value of the property to set.
     */
    setClickTimeout: function setClickTimeout(value) {
        if (this.clickTimeout === value)
            return;

        var previousValue = this.clickTimeout;
        this.clickTimeout = value;

        this._trigger(TotemUI.TwoStageButton.events.clickTimeoutChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the field 'confirmMessage' of the class.
     * @prop {String} value Value of the property to set.
     */
    setConfirmMessage: function setConfirmMessage(value) {
        if (this.confirmMessage === value)
            return;

        var previousValue = this.confirmMessage;
        this.confirmMessage = value;

        if (this.isInitialized)
            this.confirmElement.innerText = value;

        this._trigger(TotemUI.TwoStageButton.events.confirmMessageChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the field 'content' of the class.
     * @prop {String} value Value of the property to set.
     */
    setContent: function setContent(value) {
        if (this.content === value)
            return;

        var previousValue = this.content;
        this.content = value;

        if (this.isInitialized)
            this.contentElement.innerHTML = value;

        this._trigger(TotemUI.TwoStageButton.events.contentChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets if the timeout will start after clicking on the button.
     * @param {boolean} value True if should start after clicking; otherwise false.
     */
    setStartTimeoutAfterClick: function setStartTimeoutAfterClick(value) {
        if (this.startTimeoutAfterClick === value)
            return;

        var previousValue = this.startTimeoutAfterClick;
        this.startTimeoutAfterClick = value;

        this._trigger(TotemUI.TwoStageButton.events.startTimeoutAfterClickChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    }
});