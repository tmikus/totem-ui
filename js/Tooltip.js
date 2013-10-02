var TotemUI = TotemUI || {};

/**
 * Creates instance of a Tooltip class.
 *
 * @param {HTMLElement|jQuery|String} element DOM element for which this Tooltip should be shown.
 * @param {*} [configuration] Configuration of the Tooltip control.
 *
 * @constructor
 * @class
 * @extends TotemUI.DialogControl
 */
TotemUI.Tooltip = function Tooltip(element, configuration) {
   TotemUI.DialogControl.apply(this, [configuration]);

    configuration = _.extend({}, TotemUI.Tooltip.defaultConfiguration, configuration);

    this.$element = $(element);
    this.$tooltipElement = null;
    this.boundEventListener = null;
    this.hideDelay = configuration.hideDelay;
    this.horizontalPosition = configuration.horizontalPosition;
    this.text = configuration.text;
    this.tooltipContent = configuration.tooltipContent;
    this.tooltipHeight = 0;
    this.tooltipHideTimeout = null;
    this.tooltipWidth = 0;
    this.verticalPosition = configuration.verticalPosition;
};

/**
 * Enumeration of available control events.
 * @enum string
 */
TotemUI.Tooltip.events = _.extend({}, TotemUI.DialogControl.events, {
    hideDelayChanged: "hideDelayChanged",
    horizontalPositionChanged: "horizontalPositionChanged",
    textChanged: "textChanged",
    verticalPositionChanged: "verticalPositionChanged"
});

/**
 * Enumeration of tooltip horizontal positions.
 * @enum Number
 */
TotemUI.Tooltip.horizontalPosition = {
    center: 0,
    left: -1,
    right: 1
};

/**
 * Enumeration of tooltip vertical positions.
 * @enum Number
 */
TotemUI.Tooltip.verticalPosition = {
    bottom: 1,
    middle: 0,
    top: -1
};

/**
 * Default configuration of the Tooltip control.
 * @class
 */
TotemUI.Tooltip.defaultConfiguration = {
    hideDelay: 700,
    horizontalPosition: TotemUI.Tooltip.horizontalPosition.center,
    text: "",
    tooltipContent: "",
    verticalPosition: TotemUI.Tooltip.verticalPosition.top
};

TotemUI.Tooltip.prototype = TotemUI.Util.extend(TotemUI.DialogControl.prototype, {
    /**
     * Initializes instance of the tooltip.
     * This tooltip is hidden by default.
     * @returns {boolean} True if initialization has succeeded; otherwise false.
     * @protected
     */
    _initialize: function _initialize() {
        if (!TotemUI.DialogControl.prototype._initialize.apply(this, arguments))
            return false;

        var tooltipContainer = document.createElement("div");
        tooltipContainer.className = "tui-tooltip";

        var tooltipContent = document.createElement("p");
        tooltipContent.innerText = this.text;

        tooltipContainer.appendChild(tooltipContent);
        document.body.appendChild(tooltipContainer);

        this.$tooltipElement = $(tooltipContainer);
        this.tooltipContent = tooltipContent;
        this.tooltipHeight = this.$tooltipElement.outerHeight();
        this.tooltipWidth = this.$tooltipElement.outerWidth();
        return true;
    },
    /**
     * Positions the tooltip directly above specified DOM element.
     * This method takes into account horizontal and vertical position settings.
     * @private
     */
    _positionDirectlyAboveElement: function _positionDirectlyAboveElement() {
        var position = TotemUI.Util.getElementPositionAndDimensions(this.$element);
        var tooltip = this.$tooltipElement;
        if (!position)
            tooltip.removeClass("shown");
        else {
            var top = position.top - this.tooltipHeight;
            var left = position.left;

            if (this.horizontalPosition == TotemUI.Tooltip.horizontalPosition.center)
                left = position.left + (position.width / 2) - (this.tooltipWidth / 2);
            else if (this.horizontalPosition == TotemUI.Tooltip.horizontalPosition.right)
                left = position.left + position.width - this.tooltipWidth;

            if (this.verticalPosition == TotemUI.Tooltip.verticalPosition.middle)
                top = position.top + (position.height / 2) - (this.tooltipHeight / 2);
            else if (this.verticalPosition == TotemUI.Tooltip.verticalPosition.bottom)
                top = position.top + position.height;

            tooltip.css({
                top: top,
                left: left,
                "zIndex": position.zIndex
            });

            tooltip.addClass("shown");
        }
    },
    /**
     * Disposes instance of the BusyIndicator control.
     */
    dispose: function dispose() {
        document.body.removeChild(this.$tooltipElement[0]);

        TotemUI.DialogControl.prototype.dispose.apply(this, arguments);
    },
    /**
     * Gets the field 'hideDelay' of the class.
     */
    getHideDelay: function getHideDelay() {
        return this.hideDelay;
    },
    /**
     * Gets the field 'horizontalPosition' of the class.
     */
    getHorizontalPosition: function getHorizontalPosition() {
        return this.horizontalPosition;
    },
    /**
     * Gets the field 'text' of the class.
     */
    getText: function getText() {
        return this.text;
    },
    /**
     * Gets the field 'verticalPosition' of the class.
     */
    getVerticalPosition: function getVerticalPosition() {
        return this.verticalPosition;
    },
    /**
     * Hides the Tooltip.
     * @returns {boolean} True if hiding has succeeded; otherwise false.
     */
    hide: function hide() {
        if (!TotemUI.DialogControl.prototype.hide.apply(this, arguments))
            return false;

        this.tooltipHideTimeout = setTimeout(function () {
            this.tooltipHideTimeout = null;
            this.$tooltipElement.removeClass("shown");

            if (this.boundEventListener) {
                $(window).off("scroll", this.boundEventListener)
                         .off("resize", this.boundEventListener);
                this.boundEventListener = null;
            }

            this._endHide();
        }.bind(this), this.hideDelay);

        return true;
    },
    /**
     * Sets the field 'hideDelay' of the class.
     * @prop {Number} value Value of the property to set.
     */
    setHideDelay: function setHideDelay(value) {
        if (this.hideDelay === value)
            return;

        var previousValue = this.hideDelay;
        this.hideDelay = value;

        this._trigger(TotemUI.Tooltip.events.hideDelayChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the field 'horizontalPosition' of the class.
     * @prop {Number} value Value of the property to set.
     */
    setHorizontalPosition: function setHorizontalPosition(value) {
        if (this.horizontalPosition === value)
            return;

        var previousValue = this.horizontalPosition;
        this.horizontalPosition = value;

        if (this.shown)
            this._positionDirectlyAboveElement();

        this._trigger(TotemUI.Tooltip.events.horizontalPositionChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the field 'text' of the class.
     * @prop {String} value Value of the property to set.
     */
    setText: function setText(value) {
        if (this.text === value)
            return;

        var previousValue = this.text;
        this.text = value;

        if (this.isInitialized) {
            this.tooltipContent.innerText = value;
        }

        this._trigger(TotemUI.Tooltip.events.titleChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Sets the field 'verticalPosition' of the class.
     * @prop {Number} value Value of the property to set.
     */
    setVerticalPosition: function setVerticalPosition(value) {
        if (this.verticalPosition === value)
            return;

        var previousValue = this.verticalPosition;
        this.verticalPosition = value;

        if (this.shown)
            this._positionDirectlyAboveElement();

        this._trigger(TotemUI.Tooltip.events.verticalPositionChanged, new TotemUI.Events.ValueChangedEvent(previousValue, value));
    },
    /**
     * Shows the Tooltip.
     * @returns {boolean} True if showing has succeeded; otherwise false.
     */
    show: function show() {
        if (this.tooltipHideTimeout) {
            clearTimeout(this.tooltipHideTimeout);
            this.tooltipHideTimeout = null;
        }

        if (!TotemUI.DialogControl.prototype.show.apply(this, arguments))
            return false;

        this.boundEventListener = this._positionDirectlyAboveElement.bind(this);
        this.boundEventListener();

        $(window).on("scroll", this.boundEventListener)
                 .on("resize", this.boundEventListener);

        this._endShow();
        return true;
    }
});