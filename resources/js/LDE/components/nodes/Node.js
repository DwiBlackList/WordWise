import {NodeManager} from "../NodeManager"

export class Node {
    constructor(id, x, y) {
        if (new.target === Node) {
            throw new TypeError("Cannot construct Node instances directly");
        }
        this.id = id
        this.x = x;
        this.y = y;
        this.connections = [];

        // Create and style HTML element
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.className = "node";
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;

    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    addConnection(node) {
        if (!this.connections.includes(node)) {
            this.connections.push(node);
        }
    }

    removeConnection(node) {
        this.connections = this.connections.filter(conn => conn !== node);
    }

    serialize() {
        return {
            id: this.id,
            type: this.constructor.name,
            x: this.x,
            y: this.y,
            connections: this.connections.map(conn => conn.id)
        };
    }
}
