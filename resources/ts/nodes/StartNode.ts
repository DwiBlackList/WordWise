import {Node} from "../Node";
import {NodeManager} from "../NodeManager";

export class StartNode extends Node {
    constructor(x: number, y: number) {
        super(x, y);
        this.element.className += " start-node";

        const label: HTMLSpanElement = document.createElement("span");
        label.className = "node-label";
        label.textContent = "Start";
        this.element.appendChild(label);
    }
}
