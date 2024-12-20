import {NodeManager} from "./NodeManager";
import {Node} from "./Node";

interface Command {
    execute(): void;

    undo(): void;
}

class AddNodeCommand implements Command {
    private manager: NodeManager;
    private readonly node: Node;

    constructor(manager: NodeManager, node: Node) {
        this.manager = manager;
        this.node = node;
    }

    execute(): void {
        this.manager.addNodeToCanvas(this.node);
    }

    undo(): void {
        this.manager.removeNodeFromCanvas(this.node.id);
    }
}

class RemoveNodeCommand implements Command {
    private manager: NodeManager;
    private readonly node: Node;

    constructor(manager: NodeManager, node: Node) {
        this.manager = manager;
        this.node = node;
    }

    execute(): void {
        this.manager.removeNodeFromCanvas(this.node.id);
    }

    undo(): void {
        this.manager.addNodeToCanvas(this.node);
    }
}

export {Command, AddNodeCommand, RemoveNodeCommand};
