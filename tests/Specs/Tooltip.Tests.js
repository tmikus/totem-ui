describe("Tooltip", function () {
    var labelElement;
    var $labelElement;
    var tooltip;

    beforeEach(function () {
        labelElement = document.createElement("span");
        labelElement.innerText = "Hello world label";
        document.body.appendChild(labelElement);
        $labelElement = $(labelElement);

        tooltip = new TotemUI.Tooltip(labelElement);
    });

    afterEach(function () {
        tooltip.dispose();
        document.body.removeChild(labelElement);
    });

    it("should create its instance and dispose in non-error way", function () {
        expect(tooltip).not.toBeNull();
    });

    describe("'Hide delay' property tests", function () {
        it("should return correct default value of 'hideDelay'", function () {
            expect(tooltip.getHideDelay()).toEqual(TotemUI.Tooltip.defaultConfiguration.hideDelay);
        });

        it("should set 'hideDelay' value", function () {
            var hideDelay = 125125;
            tooltip.setHideDelay(hideDelay);
            expect(tooltip.getHideDelay()).toEqual(hideDelay);
        });

        it("should set 'hideDelay' and trigger 'hideDelayChanged' event with correct arguments", function () {
            var previousValue = tooltip.getHideDelay();
            var value = 12412;
            var mockEvents = {
                hideDelayChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousValue);
                    expect(e.getValue()).toEqual(value);
                }
            };

            spyOn(mockEvents, 'hideDelayChanged').andCallThrough();

            tooltip.on(TotemUI.Tooltip.events.hideDelayChanged, mockEvents.hideDelayChanged);
            tooltip.setHideDelay(value);

            expect(mockEvents.hideDelayChanged).toHaveBeenCalled();
        });
    });

    describe("'Horizontal position' property tests", function () {
        it("should return correct default value of 'horizontalPosition'", function () {
            expect(tooltip.getHorizontalPosition()).toEqual(TotemUI.Tooltip.defaultConfiguration.horizontalPosition);
        });

        it("should set 'horizontalPosition' value", function () {
            var horizontalPosition = TotemUI.Tooltip.horizontalPosition.right;
            tooltip.setHorizontalPosition(horizontalPosition);
            expect(tooltip.getHorizontalPosition()).toEqual(horizontalPosition);
        });

        it("should set 'horizontalPosition' and trigger 'horizontalPositionChanged' event with correct arguments", function () {
            var previousValue = tooltip.getHorizontalPosition();
            var value = TotemUI.Tooltip.horizontalPosition.right;
            var mockEvents = {
                horizontalPositionChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousValue);
                    expect(e.getValue()).toEqual(value);
                }
            };

            spyOn(mockEvents, 'horizontalPositionChanged').andCallThrough();

            tooltip.on(TotemUI.Tooltip.events.horizontalPositionChanged, mockEvents.horizontalPositionChanged);
            tooltip.setHorizontalPosition(value);

            expect(mockEvents.horizontalPositionChanged).toHaveBeenCalled();
        });
    });

    describe("'Text' property tests", function () {
        it("should return correct default value of 'text'", function () {
            expect(tooltip.getText()).toEqual(TotemUI.Tooltip.defaultConfiguration.text);
        });

        it("should set 'text' value", function () {
            var text = "Some text of the tooltip";
            tooltip.setText(text);
            expect(tooltip.getText()).toEqual(text);
        });

        it("should set 'text' and trigger 'textChanged' event with correct arguments", function () {
            var previousValue = tooltip.getText();
            var value = "Hello world test text";
            var mockEvents = {
                textChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousValue);
                    expect(e.getValue()).toEqual(value);
                }
            };

            spyOn(mockEvents, 'textChanged').andCallThrough();

            tooltip.on(TotemUI.Tooltip.events.textChanged, mockEvents.textChanged);
            tooltip.setText(value);

            expect(mockEvents.textChanged).toHaveBeenCalled();
        });
    });

    describe("'Vertical position' property tests", function () {
        it("should return correct default value of 'verticalProperty'", function () {
            expect(tooltip.getVerticalPosition()).toEqual(TotemUI.Tooltip.defaultConfiguration.verticalPosition);
        });

        it("should set 'verticalProperty' value", function () {
            var verticalPosition = TotemUI.Tooltip.verticalPosition.bottom;
            tooltip.setVerticalPosition(verticalPosition);
            expect(tooltip.getVerticalPosition()).toEqual(verticalPosition);
        });

        it("should set 'verticalPosition' and trigger 'verticalPositionChanged' event with correct arguments", function () {
            var previousValue = tooltip.getVerticalPosition();
            var value = TotemUI.Tooltip.verticalPosition.bottom;
            var mockEvents = {
                verticalPositionChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousValue);
                    expect(e.getValue()).toEqual(value);
                }
            };

            spyOn(mockEvents, 'verticalPositionChanged').andCallThrough();

            tooltip.on(TotemUI.Tooltip.events.verticalPositionChanged, mockEvents.verticalPositionChanged);
            tooltip.setVerticalPosition(value);

            expect(mockEvents.verticalPositionChanged).toHaveBeenCalled();
        });
    });
});