var TotemUI = TotemUI || {};

/**
 * Creates instance of the Dialog control.
 *
 * @param configuration Configuration of the Dialog Control.
 *
 * @constructor
 * @class
 * @extends TotemUI.Control
 */
TotemUI.DialogControl = function DialogControl(configuration) {
    TotemUI.Control.apply(this, [configuration]);

    this.isInitialized = false;
    this.shown = false;
};

/**
 * Enumeration of available control events.
 * @enum string
 */
TotemUI.DialogControl.events = _.extend({}, TotemUI.Control.events, {
    hiding: "hiding",
    hidden: "hidden",
    showing: "showing",
    shown: "shown"
});

TotemUI.DialogControl.prototype = TotemUI.Util.extend(TotemUI.Control.prototype, {
    /**
     * Ends hiding of the Dialog Control.
     * @param [args] Arguments to push to "hidden" event.
     * @protected
     */
    _endHide: function _endHide(args) {
        this.shown = false;
        this._trigger(TotemUI.DialogControl.events.hidden, args || null);
    },
    /**
     * Ends showing of the Dialog Control.
     * @param [args] Arguments to push to "shown" event.
     * @protected
     */
    _endShow: function _endShow(args) {
        this.shown = true;
        this._trigger(TotemUI.DialogControl.events.shown, args || null);
    },
    /**
     * Initializes the Dialog Control.
     * @returns {boolean} True if initialization can proceed; otherwise false.
     * @protected
     */
    _initialize: function _initialize() {
        if (this.isInitialized)
            return false;

        this.isInitialized = true;
        return true;
    },
    /**
     * Disposes instance of the Dialog Control.
     */
    dispose: function dispose() {
        this.isInitialized = false;

        // Disposing changes from Control
        TotemUI.Control.prototype.dispose.apply(this, arguments);
    },
    /**
     * Hides the Dialog Control.
     * @returns {boolean} True if hiding can proceed; otherwise false.
     */
    hide: function hide() {
        if (!this.shown)
            return false;

        var hidingEventArgs = new TotemUI.Events.CancellableEvent();
        this._trigger(TotemUI.DialogControl.events.hiding, hidingEventArgs);

        return !hidingEventArgs.isCancelled();
    },
    /**
     * Checks if the Dialog Control is shown.
     * @returns {boolean} True if is shown; otherwise false.
     */
    isShown: function isShown() {
        return this.shown;
    },
    /**
     * Shows the Dialog Control.
     * @returns {boolean} True if showing can proceed; otherwise false.
     */
    show: function show() {
        if (this.shown)
            return false;

        var showingEventArgs = new TotemUI.Events.CancellableEvent();
        this._trigger(TotemUI.DialogControl.events.showing, showingEventArgs);
        if (showingEventArgs.isCancelled())
            return false;

        this._initialize();
        return true;
    }
});