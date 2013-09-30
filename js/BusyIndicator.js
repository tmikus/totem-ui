var TotemUI = TotemUI || {};

/**
 * Creates instance of a BusyIndicator class.
 *
 * @param {HTMLElement|jQuery|String} element DOM element for which this busy indicator should be shown.
 * @param {*} [configuration] Configuration of the Busy Indicator.
 *
 * @constructor
 * @class
 * @extends TotemUI.DialogControl
 */
TotemUI.BusyIndicator = function BusyIndicator(element, configuration) {
    TotemUI.DialogControl.apply(this, [configuration]);

    this.$element = $(element);
    this.$busyIndicatorElement = null;
    this.boundEventListener = null;
};

/**
 * Enumeration of available control events.
 * @enum string
 */
TotemUI.BusyIndicator.events = _.extend({}, TotemUI.DialogControl.events);

TotemUI.BusyIndicator.prototype = TotemUI.Util.extend(TotemUI.DialogControl.prototype, {
    /**
     * Initializes instance of the overlay.
     * This overlay is hidden by default.
     * @returns {boolean} True if initialization has succeeded; otherwise false.
     * @protected
     */
    _initialize: function _initialize() {
        if (!TotemUI.DialogControl.prototype._initialize.apply(this, arguments))
            return false;

        var overlayContainer = document.createElement("div");
        var indicatorImage = document.createElement("div");
        var indicatorOverlay = document.createElement("div");

        overlayContainer.className = "tui-busy-indicator";
        indicatorImage.className = "tui-busy-indicator-image";
        indicatorOverlay.className = "tui-busy-indicator-overlay";

        overlayContainer.appendChild(indicatorOverlay);
        overlayContainer.appendChild(indicatorImage);
        document.body.appendChild(overlayContainer);

        this.$busyIndicatorElement = $(overlayContainer);
        return true;
    },
    /**
     * Positions this overlay directly above DOM element.
     * @private
     */
    _positionOverlayDirectlyAboveElement: function _positionOverlayDirectlyAboveElement() {
        var position = TotemUI.Util.getElementPositionAndDimensions(this.$element);
        var overlay = this.$busyIndicatorElement;

        if (!position)
            overlay.removeClass("shown");
        else {
            overlay.css({
                "top": position.top,
                "left": position.left,
                "width": position.width + "px",
                "height": position.height + "px",
                "zIndex": position.zIndex
            });

            overlay.addClass("shown");
        }
    },
    /**
     * Disposes instance of the BusyIndicator control.
     */
    dispose: function dispose() {
        if (this.$busyIndicatorElement && this.$busyIndicatorElement.length)
            document.body.removeChild(this.$busyIndicatorElement[0]);

        TotemUI.DialogControl.prototype.dispose.apply(this, arguments);
    },
    /**
     * Hides Busy Indicator.
     * @returns {boolean} True if hiding was successful; otherwise false.
     */
    hide: function hide() {
        if (!TotemUI.DialogControl.prototype.hide.apply(this, arguments))
            return false;

        this.$busyIndicatorElement.removeClass("shown");

        if (this.boundEventListener) {
            $(window).off("scroll", this.boundEventListener)
                .off("resize", this.boundEventListener);
            this.boundEventListener = null;
        }

        this._endHide();
        return true;
    },
    /**
     * Shows Busy Indicator.
     * @returns {boolean} True if hiding was successful; otherwise false.
     */
    show: function show() {
        if (!TotemUI.DialogControl.prototype.show.apply(this, arguments))
            return false;

        this.boundEventListener = this._positionOverlayDirectlyAboveElement.bind(this);
        this.boundEventListener();
        $(window).on("scroll", this.boundEventListener)
                 .on("resize", this.boundEventListener);

        this._endShow();
        return true;
    }
});