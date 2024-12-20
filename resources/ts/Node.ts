import {NodeManager} from "./NodeManager";

export class Node {
    id: string;
    x: number;
    y: number;
    connections: Node[];
    element: HTMLDivElement;

    constructor(x: number, y: number) {
        if (new.target === Node) {
            throw new TypeError("Cannot construct Node instances directly");
        }

        // Automatically generate an ID using NodeManager
        this.id = NodeManager.getInstance().generateNodeId();
        this.x = x;
        this.y = y;
        this.connections = [];

        // Create and style HTML element
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.className = "node";
        this.setPosition(x, y);
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    addConnection(node: Node): void {
        if (!this.connections.includes(node)) {
            this.connections.push(node);
        }
    }

    removeConnection(node: Node): void {
        this.connections = this.connections.filter(conn => conn !== node);
    }

    serialize(): { x: number; y: number; id: string; type: string; connections: string[] } {
        return {
            id: this.id,
            type: this.constructor.name,
            x: this.x,
            y: this.y,
            connections: this.connections.map(conn => conn.id)
        };
    }
}
