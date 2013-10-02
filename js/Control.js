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

    configuration = _.extend({}, TotemUI.Control.defaultConfiguration, configuration);

    this.enabled = configuration.enabled;
};

/**
 * Default configuration of the Control.
 * @class
 */
TotemUI.Control.defaultConfiguration = {
    enabled: false
};

/**
 * Enumeration of available control events.
 * @enum {string}
 */
TotemUI.Control.events = {
    enabledChanged: "enabledChanged"
};

TotemUI.Control.prototype = TotemUI.Util.extend(TotemUI.Core.EventEmitter.prototype, {
    /**
     * Disposes instance of the control.
     */
    dispose: function dispose() { },
    /**
     * Gets if the control is enabled.
     *
     * @returns {boolean} True if is enabled; otherwise false.
     */
    isEnabled: function isEnabled() {
        return this.enabled;
    },
    /**
     * Sets if the control is enabled.
     *
     * @param {boolean} enabled True if the control should be enabled; otherwise false.
     */
    setEnabled: function setEnabled(enabled) {
        if (this.enabled === enabled)
            return;

        var previousValue = this.enabled;
        this.enabled = enabled;

        this._trigger(TotemUI.Control.events.enabledChanged, new TotemUI.Events.ValueChangedEvent(previousValue, enabled));
    }
});