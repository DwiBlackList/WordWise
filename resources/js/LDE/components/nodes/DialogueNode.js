import {Node} from "./Node";

export class DialogueNode extends Node {
    constructor(id, x, y, {text = ""}, nodeManager) {
        super(id, x, y);
        this.element.className += " auto-resize dialogue-node";

        const label = document.createElement("span");
        label.className = "node-label";
        label.textContent = "Dialogue";
        this.element.appendChild(label);

        const dialogueText = document.createElement("textarea");
        dialogueText.className = "dialogue-textarea lde-textarea";
        dialogueText.placeholder = "Enter dialogue...";
        dialogueText.value = text;
        this.element.appendChild(dialogueText);

        dialogueText.addEventListener("input", (event) => {
            const oldValue = event.target.defaultValue;
            const newValue = event.target.value;
            nodeManager.inputChangeAction(this, dialogueText, oldValue, newValue);
            event.target.defaultValue = newValue;
        });
    }
}
