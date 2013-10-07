var TotemUI = TotemUI || {};

/**
 * @class
 */
TotemUI.Util = {
    /**
     * Gets maximum ZIndex for the element for which this BusyIndicator was created.
     *
     * @param {jQuery} $element Element of which z-index should be got.
     * @returns {Number} ZIndex for this element.
     * @private
     */
    _getMaximumZIndexForElement: function _getMaximumZIndexForElement($element) {
        var currentElement = $element;
        var maximumZIndex = 0;
        do
        {
            var zIndex = currentElement.css("z-index");
            if (zIndex == "auto")
                continue;
            if (zIndex > maximumZIndex)
                maximumZIndex = zIndex;
        } while (currentElement.length && !(currentElement = currentElement.parent()).is(document.body));

        return maximumZIndex;
    },
    /**
     * Extends 'basePrototype' with 'childPrototype'.
     * @param basePrototype Base prototype.
     * @param childPrototype Child prototype.
     * @returns {*} Extended prototype.
     */
    extend: function extend(basePrototype, childPrototype) {
        var intermediatePrototype = Object.create(basePrototype);
        var childPrototypeKeys = Object.keys(childPrototype);

        childPrototypeKeys.forEach(function (propertyName) {
            intermediatePrototype[propertyName] = childPrototype[propertyName];
        });

        return intermediatePrototype;
    },
    /**
     * Gets Position and Dimensions of visible part of the element.
     *
     * @param $element Element to check.
     * @returns {bool|{left:Number, top:Number, width:Number, height:Number, zIndex:Number}} False informs that element is not visible; Object contains properties of the visible part of element.
     */
    getElementPositionAndDimensions: function getElementPositionAndDimensions($element) {
        var elementIsVisible = $element.is(":visible");
        var elementBoundingRectangle = $element[0].getBoundingClientRect();
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;

        var isOutsideViewX = elementBoundingRectangle.right <= 0 || elementBoundingRectangle.left >= windowWidth;
        var isOutsideViewY = elementBoundingRectangle.bottom <= 0 || elementBoundingRectangle.top >= windowHeight;

        if (isOutsideViewX || isOutsideViewY || !elementIsVisible)
            return false;
        else {
            var elementZIndex = TotemUI.Util._getMaximumZIndexForElement($element);

            var targetHeight = elementBoundingRectangle.height + Math.min(elementBoundingRectangle.top, 0) + (windowHeight - Math.max(elementBoundingRectangle.bottom, windowHeight));
            var targetWidth = elementBoundingRectangle.width + Math.min(elementBoundingRectangle.left, 0) + (windowWidth - Math.max(elementBoundingRectangle.right, windowWidth));

            return {
                left: elementBoundingRectangle.left < 0 ? window.scrollX : elementBoundingRectangle.left,
                top: elementBoundingRectangle.top < 0 ? window.scrollY : elementBoundingRectangle.top,
                width: targetWidth,
                height: targetHeight,
                zIndex: elementZIndex + 1
            };
        }
    },
    /**
     * Checks if object 'value' is an Array.
     * @param value Object to check if is array.
     * @returns {boolean} True if is array; otherwise false.
     */
    isArray: function (value) {
        return value instanceof Array;
    },
    /**
     * Method used as a placeholder for derived classes methods.
     */
    notImplemented: function notImplemented() {
        throw "Not implemented!";
    }
};