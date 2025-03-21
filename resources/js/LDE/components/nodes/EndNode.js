﻿import {Node} from "./Node";

export class EndNode extends Node {
    constructor(id, x, y, options = {}) {
        super(id, x, y);
        this.element.className += " end-node";

        const label = document.createElement("span");
        label.className = "node-label";
        label.textContent = "End";
        this.element.appendChild(label);
    }
}
