var TotemUI = TotemUI || {};
TotemUI.Events = TotemUI.Events || {};

/**
 * Creates instance of the event arguments for property value change event.
 *
 * @param previousValue Previous value of the property.
 * @param value Current value of the property.
 * @constructor
 * @class
 */
TotemUI.Events.ValueChangedEvent = function ValueChangedEvent(previousValue, value) {
    this.previousValue = previousValue;
    this.value = value;
};

TotemUI.Events.ValueChangedEvent.prototype = {
    /**
     * Gets previous value of the property.
     * @returns {*} Previous value of the property.
     */
    getPreviousValue: function getPreviousValue() {
        return this.previousValue;
    },
    /**
     * Gets current value of the property.
     * @returns {*} Value of the property.
     */
    getValue: function getValue() {
        return this.value;
    }
};