var TotemUI = TotemUI || {};

/**
 * @class
 */
TotemUI.Util = {
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
     * Extracts size from the size string like "20px".
     *
     * @param {String} sizeString Size string.
     * @return {Number} Size. Default 0.
     * @private
     */
    _extractSize: function _extractSize(sizeString) {
        if (sizeString && sizeString != "" && TotemUI.Util.stringEndsWith(sizeString, "px")) {
            var size = sizeString.substr(0, sizeString.length - 2);
            if (!isNaN(size)) {
                var convertedSize = parseInt(size);
                return convertedSize < 0 ? 0 : convertedSize;
            }
        }
        return 0;
    },
    /**
     * Gets Position and Dimensions of visible part of the element.
     *
     * @param $element Element to check.
     * @returns {bool|{left:Number, top:Number, width:Number, height:Number, zIndex:Number}} False informs that element is not visible; Object contains properties of the visible part of element.
     */
    getElementPositionAndDimensions: function getElementPositionAndDimensions($element) {
        var elementIsVisible = $element.css("visibility") == "visible" && $element.css("display") != "none";
        var elementPosition = $element.offset();
        var elementHeight = $element.height();
        var elementWidth = $element.width();
        var elementZIndex = TotemUI.Util._getMaximumZIndexForElement($element);
        var windowScrollX = window.scrollX;
        var windowScrollY = window.scrollY;
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;

        var topOffset = TotemUI.Util._extractSize($element.css("padding-top"))
            + TotemUI.Util._extractSize($element.css("margin-top"))
            + TotemUI.Util._extractSize($element.css("border-top-width"));
        var bottomOffset = TotemUI.Util._extractSize($element.css("padding-bottom"))
            + TotemUI.Util._extractSize($element.css("margin-bottom"));
        var leftOffset = TotemUI.Util._extractSize($element.css("padding-left"))
            + TotemUI.Util._extractSize($element.css("margin-left"))
            + TotemUI.Util._extractSize($element.css("border-left-width"));
        var rightOffset = TotemUI.Util._extractSize($element.css("padding-right"))
            + TotemUI.Util._extractSize($element.css("margin-right"));

        elementHeight += topOffset + bottomOffset;
        elementWidth += leftOffset + rightOffset;

        var isOutsideViewX = elementPosition.left >= windowWidth + windowScrollX ||
            elementPosition.left + elementWidth <= windowScrollX;
        var isOutsideViewY = elementPosition.top >= windowHeight + windowScrollY ||
            elementPosition.top + elementHeight <= windowScrollY;

        if (isOutsideViewX || isOutsideViewY || !elementIsVisible)
            return false;
        else {
            var overlayX = elementPosition.left < windowScrollX ? windowScrollX : elementPosition.left;
            var overlayY = elementPosition.top < windowScrollY ? windowScrollY : elementPosition.top;
            var overlayWidth = 0;
            var overlayHeight = 0;

            // If end of the element is outside of the visible part of the screen...
            if (elementPosition.left + elementWidth > windowScrollX + windowWidth) {
                overlayWidth = elementWidth - (overlayX - elementPosition.left) - (elementPosition.left + elementWidth - (windowScrollX + windowWidth));
            } else {
                overlayWidth = elementWidth - (overlayX - elementPosition.left);
            }

            // If end of the element is outside of the visible part of the screen...
            if (elementPosition.top + elementHeight > windowScrollY + windowHeight) {
                overlayHeight = elementHeight - (overlayY - elementPosition.top) - (elementPosition.top + elementHeight - (windowScrollY + windowHeight));
            } else {
                overlayHeight = elementHeight - (overlayY - elementPosition.top);
            }

            return {
                left: overlayX,
                top: overlayY,
                width: overlayWidth,
                height: overlayHeight,
                zIndex: elementZIndex + 1
            };
        }
    },
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
     * Method used as a placeholder for derived classes methods.
     */
    notImplemented: function notImplemented() {
        throw "Not implemented!";
    },
    /**
     * Checks if string 'string' ends with 'ending.
     *
     * @param {String} string String to check if it ends with specified phrase.
     * @param {String} ending Expected ending of the string.
     * @returns {boolean} True if it ends with 'ending'; otherwise false.
     */
    stringEndsWith: function (string, ending) {
        return string.substr(string.length - ending.length) == ending;
    }
};