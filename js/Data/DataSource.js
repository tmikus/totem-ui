var TotemUI = TotemUI || {};
TotemUI.Data = TotemUI.Data || {};

/**
 * Creates instance of the data source.
 * This class is base class for more specific data source.
 * @constructor
 * @class
 * @extends TotemUI.Core.EventEmitter
 */
TotemUI.Data.DataSource = function DataSource() {
    TotemUI.Core.EventEmitter.apply(this, arguments);
};

TotemUI.Data.DataSource.prototype = TotemUI.Util.extend(TotemUI.Core.EventEmitter.prototype, {

});
