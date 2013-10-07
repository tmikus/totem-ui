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
    })
});