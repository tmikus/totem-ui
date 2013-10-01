var TotemUI = TotemUI || {};

/**
 * Initializes the base instance for the input based controls
 *
 * @param [configuration] Configuration of the control.
 * @constructor
 * @class
 * @extends TotemUI.Control
 */
TotemUI.InputControl = function InputControl(configuration) {
    TotemUI.Control.apply(this, [configuration]);

    configuration = _.extend({}, TotemUI.InputControl.defaultConfiguration, configuration);

    this.readonly = configuration.readonly;
};

/**
 * Default configuration of the Input control.
 * @class
 */
TotemUI.InputControl.defaultConfiguration = {
    readonly: false
};

/**
 * Enumeration of events available for Input Control.
 * @enum
 */
TotemUI.InputControl.events = _.extend({}, TotemUI.Control.events, {
    readonlyChanged: "readonlyChanged"
});

TotemUI.InputControl.prototype = TotemUI.Util.extend(TotemUI.Control.prototype, {
    /**
     * Removes focus from this control.
     */
    blur: TotemUI.Util.notImplemented,
    /**
     * Focuses this control.
     */
    focus: TotemUI.Util.notImplemented,
    /**
     * Gets if the control is readonly.
     *
     * @returns {boolean} True if is readonly; otherwise false.
     */
    isReadonly: function isReadonly() {
        return this.readonly;
    },
    /**
     * Sets if the control is readonly.
     *
     * @param {boolean} readonly True if control should be readonly; otherwise false.
     */
    setReadonly: function setReadonly(readonly) {
        if (this.readonly == readonly)
            return;

        this.readonly = readonly;
        this._trigger(TotemUI.InputControl.events.readonlyChanged, readonly);
    }
});