var TotemUI = TotemUI || {};
TotemUI.Core = TotemUI.Core || {};

/**
 * Initializes instance of a object that can emit events.
 *
 * @constructor
 * @class
 */
TotemUI.Core.EventEmitter = function EventEmitter() {
    this.boundEventListeners = [];
};

TotemUI.Core.EventEmitter.prototype = {
    /**
     * Triggers event of the control with specified name and arguments.
     *
     * @param {string} eventName Name of the event to trigger.
     * @param [eventArguments] Arguments for the event.
     * @name EventEmitter#_trigger
     * @protected
     */
    _trigger: function _trigger(eventName, eventArguments) {
        var eventListeners = this.boundEventListeners[eventName];
        if (!eventListeners)
            return;

        for (var index = 0; index < eventListeners.length; index++) {
            eventListeners[index](this, eventArguments);
        }
    },
    /**
     * Removes event handler from this control.
     *
     * @param {string} eventName Name of the event.
     * @param {Function} callback Callback to remove.
     * @name EventEmitter#off
     */
    off: function off(eventName, callback) {
        var eventListeners = this.boundEventListeners[eventName];
        if (!eventListeners)
            return;

        for (var index = 0; index < eventListeners.length; index++) {
            if (eventListeners[index] === callback) {
                delete eventListeners[index];
                break;
            }
        }
    },
    /**
     * Binds event handler to this control under specified event name.
     *
     * @param {string} eventName Name of the event to fire.
     * @param {Function} callback Callback to fire after event has occurred.
     * @returns {Function} Dispose function for the event handler.
     */
    on: function on(eventName, callback) {
        var isDisposed = false;
        var eventListeners = this.boundEventListeners[eventName] || (this.boundEventListeners[eventName] = []);

        eventListeners.push(callback);

        return function disposeEventHandler() {
            if (isDisposed)
                throw "Event is already disposed!";

            for (var index = 0; index < eventListeners.length; index++) {
                if (eventListeners[index] === callback) {
                    delete eventListeners[index];
                    break;
                }
            }
            isDisposed = true;
        };
    }
};