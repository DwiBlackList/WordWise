import {Node} from "./Node";

export class ChoiceNode extends Node {
    constructor(id, x, y, {text = ""}, nodeManager) {
        super(id, x, y);
        this.element.className += " auto-resize choice-node";

        const label = document.createElement("span");
        label.className = "node-label";
        label.textContent = "Choice";
        this.element.appendChild(label);

        const choiceText = document.createElement("textarea");
        choiceText.className = "choice-textarea lde-textarea";
        choiceText.placeholder = "Enter choice...";
        choiceText.value = text;
        this.element.appendChild(choiceText);

        choiceText.addEventListener("input", (event) => {
            const oldValue = event.target.defaultValue;
            const newValue = event.target.value;
            nodeManager.inputChangeAction(this, choiceText, oldValue, newValue);
            event.target.defaultValue = newValue;
        });
    }
}
