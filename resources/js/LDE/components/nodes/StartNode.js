import {Node} from "./Node";

export class StartNode extends Node {
    constructor(id, x, y, options = {}) {
        super(id, x, y);
        this.element.className += " start-node";

        const label = document.createElement("span");
        label.className = "node-label";
        label.textContent = "Start";
        this.element.appendChild(label);
    }
}
