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

    it("should have correct content after initialization", function () {
        expect($buttonElement.children(":visible").text()).toEqual("");
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
        expect($buttonElement.children(":visible").text()).toEqual("");

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
        expect($buttonElement.children(":visible").text()).toEqual("");
    });
});