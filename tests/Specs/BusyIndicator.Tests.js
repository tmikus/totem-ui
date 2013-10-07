describe("BusyIndicator", function () {
    function initializeElementToCover() {
        var element = document.createElement("div");

        element.innerHTML = "Hello world container";
        element.style.height = "300px";
        element.style.width = "200px";

        document.body.appendChild(element);

        return element;
    }

    var busyIndicator;
    var elementToCover;

    beforeEach(function () {
        elementToCover = initializeElementToCover();
        busyIndicator = new TotemUI.BusyIndicator(elementToCover);
    });

    afterEach(function () {
        busyIndicator.dispose();
        document.body.removeChild(elementToCover);
    });

    it("should create its instance and dispose in non-error way", function () {
        expect(busyIndicator).not.toBeNull();
    });

    it("should show busy indicator", function () {
        busyIndicator.show();
        expect(busyIndicator.isShown()).toBeTruthy();
    });

    it("should show and hide busy indicator", function () {
        busyIndicator.show();
        expect(busyIndicator.isShown()).toBeTruthy();

        busyIndicator.hide();
        expect(busyIndicator.isShown()).toBeFalsy();
    });

    it("should fire 'showing' and 'shown' events while showing", function () {
        var events = {
            onShowingCalled: function () { },
            onShownCalled: function () { }
        };

        spyOn(events, 'onShowingCalled');
        spyOn(events, 'onShownCalled');

        busyIndicator.on(TotemUI.BusyIndicator.events.showing, events.onShowingCalled);
        busyIndicator.on(TotemUI.BusyIndicator.events.shown, events.onShownCalled);

        busyIndicator.show();

        expect(events.onShowingCalled).toHaveBeenCalled();
        expect(events.onShownCalled).toHaveBeenCalled();
    });

    it("should fire 'hiding' and 'hidden' events while hiding", function () {
        var events = {
            onHidingCalled: function () { },
            onHiddenCalled: function () { }
        };

        spyOn(events, 'onHidingCalled');
        spyOn(events, 'onHiddenCalled');

        busyIndicator.on(TotemUI.BusyIndicator.events.hiding, events.onHidingCalled);
        busyIndicator.on(TotemUI.BusyIndicator.events.hidden, events.onHiddenCalled);

        busyIndicator.show();
        busyIndicator.hide();

        expect(events.onHidingCalled).toHaveBeenCalled();
        expect(events.onHiddenCalled).toHaveBeenCalled();
    });

    it("should fire 'showing' and cancel 'shown' event while showing", function () {
        var events = {
            onShowingCalled: function (sender, e) {
                e.setCancelled(true);
            },
            onShownCalled: function () { }
        };

        spyOn(events, 'onShowingCalled').andCallThrough();
        spyOn(events, 'onShownCalled');

        busyIndicator.on(TotemUI.BusyIndicator.events.showing, events.onShowingCalled);
        busyIndicator.on(TotemUI.BusyIndicator.events.shown, events.onShownCalled);

        busyIndicator.show();

        expect(events.onShowingCalled).toHaveBeenCalled();
        expect(events.onShownCalled).not.toHaveBeenCalled();
    });

    it("should fire 'hiding' and cancel 'hidden' event while hiding", function () {
        var events = {
            onHidingCalled: function (sender, e) {
                e.setCancelled(true);
            },
            onHiddenCalled: function () { }
        };

        spyOn(events, 'onHidingCalled').andCallThrough();
        spyOn(events, 'onHiddenCalled');

        busyIndicator.on(TotemUI.BusyIndicator.events.hiding, events.onHidingCalled);
        busyIndicator.on(TotemUI.BusyIndicator.events.hidden, events.onHiddenCalled);

        busyIndicator.show();
        busyIndicator.hide();

        expect(events.onHidingCalled).toHaveBeenCalled();
        expect(events.onHiddenCalled).not.toHaveBeenCalled();
    });

    it("should return false on second call to '_initialize' method", function () {
        // First call to _initialize method.
        expect(busyIndicator._initialize()).toBeTruthy();

        // Second call to _initialize method - this should return false
        expect(busyIndicator._initialize()).toBeFalsy();
    });

    it("should hide the BusyIndicator if element to cover is outside browser viewport to the left", function () {
        elementToCover.style.position = "absolute";
        elementToCover.style.left = "-200px";

        busyIndicator.show();
        expect(busyIndicator.$busyIndicatorElement.hasClass("shown")).toBeFalsy();
    });

    it("should hide the BusyIndicator if element to cover is outside browser viewport to the top", function () {
        elementToCover.style.position = "absolute";
        elementToCover.style.top = "-300px";

        busyIndicator.show();
        expect(busyIndicator.$busyIndicatorElement.hasClass("shown")).toBeFalsy();
    });

    it("should show the BusyIndicator if element to cover is partially outside browser viewport to the left", function () {
        elementToCover.style.position = "absolute";
        elementToCover.style.left = "-150px";

        busyIndicator.show();
        expect(busyIndicator.$busyIndicatorElement.hasClass("shown")).toBeTruthy();
    });
});