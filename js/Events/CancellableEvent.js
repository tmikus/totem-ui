var TotemUI = TotemUI || {};
TotemUI.Events = TotemUI.Events || {};

/**
 * @constructor
 * @class
 */
TotemUI.Events.CancellableEvent = function CancellableEvent() {
    this.cancelled = false;
};

TotemUI.Events.CancellableEvent.prototype = {
    /**
     * Checks if this event is cancelled.
     *
     * @returns {Boolean} True if is cancelled; otherwise false.
     * @name TotemUI.Events.CancellableEvent#isCancelled
     * @memberOf TotemUI.Events.CancellableEvent
     * @public
     */
    isCancelled: function isCancelled() {
        return this.cancelled;
    },
    /**
     * Sets if this event is cancelled.
     * @param {Boolean} cancelled True if should be cancelled; otherwise false.
     *
     * @name TotemUI.Events.CancellableEvent#setCancelled
     * @memberOf TotemUI.Events.CancellableEvent
     * @public
     */
    setCancelled: function setCancelled(cancelled) {
        this.cancelled = cancelled;
    }
};