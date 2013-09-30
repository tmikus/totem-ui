var TotemUI = TotemUI || {};

/**
 * Initializes base instance of the control.
 * This class is common for every UI control of the TotemUI control toolkit.
 *
 * @param {*} [configuration] Configuration of the control.
 *
 * @constructor
 * @class
 * @extends TotemUI.Core.EventEmitter
 */
TotemUI.Control = function Control(configuration) {
    TotemUI.Core.EventEmitter.apply(this, arguments);

    // Preparing configuration - filling with defaults.
    configuration = _.extend({}, Control.defaultConfiguration, configuration);

    this.enabled = configuration.enabled;
    this.readonly = configuration.readonly;
};

/**
 * Default configuration of the Control.
 * @class
 */
TotemUI.Control.defaultConfiguration = {
    enabled: false,
    readonly: false
};

/**
 * Enumeration of available control events.
 * @enum {string}
 */
TotemUI.Control.events = {
    enabledChanged: "enabledChanged",
    readonlyChanged: "readonlyChanged"
};

TotemUI.Control.prototype = TotemUI.Util.extend(TotemUI.Core.EventEmitter.prototype, {
    /**
     * Removes focus from this control.
     */
    blur: TotemUI.Util.notImplemented,
    /**
     * Disposes instance of the control.
     */
    dispose: function dispose() { },
    /**
     * Focuses this control.
     */
    focus: TotemUI.Util.notImplemented,
    /**
     * Gets if the control is enabled.
     *
     * @returns {boolean} True if is enabled; otherwise false.
     */
    getEnabled: function getEnabled() {
        return this.enabled;
    },
    /**
     * Gets if the control is readonly.
     *
     * @returns {boolean} True if is readonly; otherwise false.
     */
    getReadonly: function getReadonly() {
        return this.readonly;
    },
    /**
     * Sets if the control is enabled.
     *
     * @param {boolean} enabled True if the control should be enabled; otherwise false.
     */
    setEnabled: function setEnabled(enabled) {
        if (this.enabled != enabled) {
            this.enabled = enabled;
            this._trigger(Control.events.enabledChanged, enabled);
        }
    },
    /**
     * Sets if the control is readonly.
     *
     * @param {boolean} readonly True if control should be readonly; otherwise false.
     */
    setReadonly: function setReadonly(readonly) {
        if (this.readonly != readonly) {
            this.readonly = readonly;
            this._trigger(Control.events.readonlyChanged, readonly);
        }
    }
});