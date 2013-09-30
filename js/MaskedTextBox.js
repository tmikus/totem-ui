var TotemUI = TotemUI || {};

/**
 * Creates new instance of a MaskedTextBox class.
 *
 * @constructor
 * @class
 * @extends TotemUI.Control
 */
TotemUI.MaskedTextBox = function MaskedTextBox() {
    TotemUI.Control.apply(this, arguments);

    this.mask = "";
    this.promptText = "_";
};

TotemUI.MaskedTextBox.prototype = TotemUI.Util.extend(TotemUI.Control.prototype, {
    /**
     * Gets mask of the MaskedTextBox.
     * @returns {string} Mask of the MaskedTextBox.
     */
    getMask: function getMask() {
        return this.mask;
    },
    /**
     * Gets prompt text - the text that is shown instead of blank space in which
     * user can write.
     * @returns {string} Prompt text.
     */
    getPromptText: function getPromptText() {
        return this.promptText;
    },
    /**
     * Gets value - stripped from literals and prompt.
     * @returns {string}
     */
    getValue: function getValue() {

    },
    /**
     * Gets value with literals - prompt characters are removed.
     * @returns {string}
     */
    getValueWithLiterals: function getValueWithLiterals() {

    },
    /**
     * Gets value with prompt - literal characters are removed.
     * @returns {string}
     */
    getValueWithPrompt: function getValueWithPrompt() {

    },
    /**
     * Gets value with prompt and literals.
     * @returns {string}
     */
    getValueWithPromptAndLiterals: function getValueWithPromptAndLiterals() {

    },
    /**
     * Sets mask of the MaskedTextBox.
     * @param {string} mask Mask to set.
     */
    setMask: function setMask(mask) {

    },
    /**
     * Sets prompt text to specified string.
     * @param {string} prompt Prompt to set.
     */
    setPromptText: function setPromptText(prompt) {

    },
    /**
     * Sets value to the specified string.
     * @param {string} value Value to set.
     */
    setValue: function setValue(value) {

    },
    /**
     * Sets value with literals.
     * @param {string} value Value with literals to set.
     */
    setValueWithLiterals: function setValueWithLiterals(value) {

    },
    /**
     * Sets value with prompt.
     * @param {string} value Value with prompt.
     */
    setValueWithPrompt: function setValueWithPrompt(value) {

    },
    /**
     * Sets value with prompt and literals.
     * @param {string} value Value with prompt.
     */
    setValueWithPromptAndLiterals: function setValueWithPromptAndLiterals(value) {

    }
});