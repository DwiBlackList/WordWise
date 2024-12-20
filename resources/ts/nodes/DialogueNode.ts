import {Node} from "../Node";
import {NodeManager} from "../NodeManager";

export class DialogueNode extends Node {
    text: string;

    constructor(x: number, y: number, {text = ""}: { text: string } = {text: ""}) {
        super(x, y);
        this.text = text;
        this.element.className += " auto-resize dialogue-node";

        // Create and append a label for the Dialogue Node
        const label = document.createElement("span");
        label.className = "node-label";
        label.textContent = "Dialogue";
        this.element.appendChild(label);

        // Create and append a text area for dialogue text
        const dialogueText = document.createElement("textarea");
        dialogueText.className = "dialogue-textarea lde-textarea";
        dialogueText.placeholder = "Enter dialogue...";
        dialogueText.value = text;
        this.element.appendChild(dialogueText);
        
        dialogueText.addEventListener("input", (event) => {
            const target = event.target as HTMLTextAreaElement;
            this.text = target.value;
        });
    }

    serialize(): { x: number; y: number; id: string; text: string; type: string; connections: string[] } {
        return {
            ...super.serialize(),
            text: this.text
        };
    }

}
