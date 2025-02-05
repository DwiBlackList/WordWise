import {Node} from "../Node";
import {NodeManager} from "../NodeManager";

export class EndNode extends Node {
    constructor(x: number, y: number) {
        super(x, y);
        this.element.className += " end-node";

        const label: HTMLSpanElement = document.createElement("span");
        label.className = "node-label";
        label.textContent = "End";
        this.element.appendChild(label);
    }
}
