describe("TwoStageButton", function () {
    var buttonElement;
    var $buttonElement;
    var twoStageButton;

    beforeEach(function () {
        buttonElement = document.createElement("div");
        document.body.appendChild(buttonElement);

        $buttonElement = $(buttonElement);

        twoStageButton = new TotemUI.TwoStageButton(buttonElement);
    });

    afterEach(function () {
        twoStageButton.dispose();
        document.body.removeChild(buttonElement);
    });

    it("should create its instance and dispose in non-error way", function () {
        expect(twoStageButton).not.toBeNull();
    });

    describe("Interaction tests", function () {
        it("should have correct content after initialization", function () {
            expect($buttonElement.children(":visible").text()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.content);
        });

        it ("shouldn't throw exception after first click on the button", function () {
            function clickButton() {
                $buttonElement.click();
            }
            expect(clickButton).not.toThrow();
        });

        it("should have correct content after clicking", function () {
            $buttonElement.click();
            expect($buttonElement.children(":visible").text()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.confirmMessage);
        });

        it("should restore content to original state after configured timeout", function () {
            jasmine.Clock.useMock();

            // Checking content if it is normal
            expect($buttonElement.children(":visible").text()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.content);

            // Clicking on the button to show the confirmation message
            $buttonElement.click();

            // Checking if content has confirm message
            expect($buttonElement.children(":visible").text()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.confirmMessage);

            // Calling mouse leave event
            $buttonElement.mouseleave();

            // Making sure content is ok
            expect($buttonElement.children(":visible").text()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.confirmMessage);

            // Calling timeout
            jasmine.Clock.tick(TotemUI.TwoStageButton.defaultConfiguration.clickTimeout + 1);

            // Checking if content went back to normal
            expect($buttonElement.children(":visible").text()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.content);
        });

        it("should call 'click' event after double clicking on the button", function () {
            var mockEvents = {
                click: function (sender, e) {
                }
            };

            // Adding spy to the click method.
            spyOn(mockEvents, 'click');

            // Binding click event handler to the button
            twoStageButton.on(TotemUI.TwoStageButton.events.click, mockEvents.click);

            // Checking if first click does not fire event
            $buttonElement.click();
            expect(mockEvents.click).not.toHaveBeenCalled();

            // Checking if second click does fire the event
            $buttonElement.click();
            expect(mockEvents.click).toHaveBeenCalled();
        });
    });

    describe("'Click timeout' property tests", function () {
        it("should return correct click timeout", function () {
            expect(twoStageButton.getClickTimeout()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.clickTimeout);
        });

        it("should set click timeout", function () {
            var clickTimeout = 3000;
            twoStageButton.setClickTimeout(clickTimeout);
            expect(twoStageButton.getClickTimeout()).toEqual(clickTimeout);
        });

        it("should set click timeout and trigger 'clickTimeoutChanged' event with correct arguments", function () {
            var previousClickTimeout = twoStageButton.getClickTimeout();
            var clickTimeout = 3000;
            var mockEvents = {
                clickTimeoutChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousClickTimeout);
                    expect(e.getValue()).toEqual(clickTimeout);
                }
            };

            spyOn(mockEvents, 'clickTimeoutChanged').andCallThrough();

            twoStageButton.on(TotemUI.TwoStageButton.events.clickTimeoutChanged, mockEvents.clickTimeoutChanged);
            twoStageButton.setClickTimeout(clickTimeout);

            expect(mockEvents.clickTimeoutChanged).toHaveBeenCalled();
        });

        it("should not trigger 'clickTimeoutChanged' when setting click timeout to same value", function () {
            var mockEvents = {
                clickTimeoutChanged: function (sender, e) {
                }
            };

            spyOn(mockEvents, 'clickTimeoutChanged');
            twoStageButton.on(TotemUI.TwoStageButton.events.clickTimeoutChanged, mockEvents.clickTimeoutChanged);

            twoStageButton.setClickTimeout(twoStageButton.getClickTimeout());

            expect(mockEvents.clickTimeoutChanged).not.toHaveBeenCalled();
        });
    });

    describe("'Confirm message' property tests", function () {
        it("should return correct confirm message", function () {
            expect(twoStageButton.getConfirmMessage()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.confirmMessage);
        });

        it("should set confirm message", function () {
            var confirmMessage = "Example confirm message";
            twoStageButton.setConfirmMessage(confirmMessage);
            expect(twoStageButton.getConfirmMessage()).toEqual(confirmMessage);
        });

        it("should set confirm message and trigger 'confirmMessageChanged' event with correct arguments", function () {
            var previousMessage = twoStageButton.getConfirmMessage();
            var confirmMessage = "Example confirm message";
            var mockEvents = {
                confirmMessageChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousMessage);
                    expect(e.getValue()).toEqual(confirmMessage);
                }
            };

            spyOn(mockEvents, 'confirmMessageChanged').andCallThrough();

            twoStageButton.on(TotemUI.TwoStageButton.events.confirmMessageChanged, mockEvents.confirmMessageChanged);
            twoStageButton.setConfirmMessage(confirmMessage);

            expect(mockEvents.confirmMessageChanged).toHaveBeenCalled();
        });

        it("should not trigger 'confirmMessageChanged' when setting confirm message to same value", function () {
            var mockEvents = {
                confirmMessageChanged: function (sender, e) {
                }
            };

            spyOn(mockEvents, 'confirmMessageChanged');
            twoStageButton.on(TotemUI.TwoStageButton.events.confirmMessageChanged, mockEvents.confirmMessageChanged);

            twoStageButton.setConfirmMessage(twoStageButton.getConfirmMessage());

            expect(mockEvents.confirmMessageChanged).not.toHaveBeenCalled();
        });
    });

    describe("'Content' property tests", function () {
        it("should return correct content", function () {
            expect(twoStageButton.getContent()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.content);
        });

        it("should set content", function () {
            var content = "Example content";
            twoStageButton.setContent(content);
            expect(twoStageButton.getContent()).toEqual(content);
        });

        it("should set content and trigger 'contentChanged' event with correct arguments", function () {
            var previousContent = twoStageButton.getContent();
            var content = "Example content";
            var mockEvents = {
                contentChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previousContent);
                    expect(e.getValue()).toEqual(content);
                }
            };

            spyOn(mockEvents, 'contentChanged').andCallThrough();

            twoStageButton.on(TotemUI.TwoStageButton.events.contentChanged, mockEvents.contentChanged);
            twoStageButton.setContent(content);

            expect(mockEvents.contentChanged).toHaveBeenCalled();
        });

        it("should not trigger 'contentChanged' when setting content to same value", function () {
            var mockEvents = {
                contentChanged: function (sender, e) {
                }
            };

            spyOn(mockEvents, 'contentChanged');
            twoStageButton.on(TotemUI.TwoStageButton.events.contentChanged, mockEvents.contentChanged);

            twoStageButton.setContent(twoStageButton.getContent());

            expect(mockEvents.contentChanged).not.toHaveBeenCalled();
        });
    });

    describe("'Start timeout after click' property tests", function () {
        it("should return correct value of 'startTimeoutAfterClick'", function () {
            expect(twoStageButton.isStartingTimeoutAfterClick()).toEqual(TotemUI.TwoStageButton.defaultConfiguration.startTimeoutAfterClick);
        });

        it("should set timeout after click property", function () {
            var startTimeoutAfterClick = !TotemUI.TwoStageButton.defaultConfiguration.startTimeoutAfterClick;
            twoStageButton.setStartTimeoutAfterClick(startTimeoutAfterClick);
            expect(twoStageButton.isStartingTimeoutAfterClick()).toEqual(startTimeoutAfterClick);
        });

        it("should set 'startTimeoutAfterClick' and trigger 'startTimeoutAfterClickChanged' event with correct arguments", function () {
            var previous = twoStageButton.isStartingTimeoutAfterClick();
            var current = !previous;
            var mockEvents = {
                startTimeoutAfterClickChanged: function (sender, e) {
                    expect(e).not.toBeNull();
                    expect(e.getPreviousValue()).toEqual(previous);
                    expect(e.getValue()).toEqual(current);
                }
            };

            spyOn(mockEvents, 'startTimeoutAfterClickChanged').andCallThrough();

            twoStageButton.on(TotemUI.TwoStageButton.events.startTimeoutAfterClickChanged, mockEvents.startTimeoutAfterClickChanged);
            twoStageButton.setStartTimeoutAfterClick(current);

            expect(mockEvents.startTimeoutAfterClickChanged).toHaveBeenCalled();
        });

        it("should not trigger 'startTimeoutAfterClickChanged' when setting 'startTimeoutAfterClick' to same value", function () {
            var mockEvents = {
                startTimeoutAfterClickChanged: function (sender, e) {
                }
            };

            spyOn(mockEvents, 'startTimeoutAfterClickChanged');
            twoStageButton.on(TotemUI.TwoStageButton.events.startTimeoutAfterClickChanged, mockEvents.startTimeoutAfterClickChanged);

            twoStageButton.setStartTimeoutAfterClick(twoStageButton.isStartingTimeoutAfterClick());

            expect(mockEvents.startTimeoutAfterClickChanged).not.toHaveBeenCalled();
        });
    });
});