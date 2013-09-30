var TotemUI = TotemUI || {};

/**
 * Creates instance of a DataBoundControl class.
 *
 * @param {TotemUI.DataBoundControl.defaultConfiguration} configuration Control's configuration.
 *
 * @constructor
 * @class TotemUI.DataBoundControl
 * @extends TotemUI.Control
 */
TotemUI.DataBoundControl = function DataBoundControl(configuration) {
    TotemUI.Control.apply(this, arguments);
};

/**
 * @class
 * @extends TotemUI.Control.defaultConfiguration
 */
TotemUI.DataBoundControl.defaultConfiguration = TotemUI.Util.extend(TotemUI.Control.defaultConfiguration, {
    dataSource: null
});