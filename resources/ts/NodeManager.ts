import {jsPlumb, jsPlumbInstance} from "jsplumb";
import {Node} from "./Node";
import {Command, AddNodeCommand} from "./Command";

class NodeManager {
    jsPlumbInstance: jsPlumbInstance;
    private idCounter: number;
    private nodes: Map<string, Node>;
    private undoStack: Command[];
    private redoStack: Command[];
    private static instance: NodeManager;
    private readonly gridSize: number;
    private readonly nodeContainer: HTMLElement;
    private selectedNode: Node | null = null; // Track the selected node

    constructor(containerId: string) {
        this.idCounter = 1;
        this.nodeContainer = document.getElementById(containerId) as HTMLElement;
        this.nodes = new Map();
        this.undoStack = [];
        this.redoStack = [];
        this.gridSize = 20;

        // Initialize jsPlumb instance
        this.jsPlumbInstance = jsPlumb.getInstance();
        this.initializeJsPlumb();

        // Assign this instance to the static instance property
        NodeManager.instance = this;
    }

    static getInstance(): NodeManager {
        return NodeManager.instance;
    }

    initializeJsPlumb(): void {
        this.jsPlumbInstance.setContainer(this.nodeContainer);
        this.jsPlumbInstance.importDefaults({
            Connector: ["Flowchart", {cornerRadius: 5, gap: 10}],
            PaintStyle: {stroke: "#888", strokeWidth: 2},
            HoverPaintStyle: {stroke: "#ac74d3", strokeWidth: 3},
            EndpointStyle: {radius: 3, fill: "#888"},
            ConnectorStyle: {stroke: "#888", strokeWidth: 2},
        });

        this.jsPlumbInstance.bind("connection", (info) => {
            const sourceNode = this.nodes.get(info.sourceId);
            const targetNode = this.nodes.get(info.targetId);
            if (sourceNode && targetNode) {
                sourceNode.addConnection(targetNode);
            }
        });

        this.jsPlumbInstance.bind("connectionDetached", (info) => {
            const sourceNode = this.nodes.get(info.sourceId);
            const targetNode = this.nodes.get(info.targetId);
            if (sourceNode && targetNode) {
                sourceNode.removeConnection(targetNode);
            }
        });
    }

    generateNodeId(): string {
        return `node${this.idCounter++}`;
    }

    getNodes(): Node[] {
        return Array.from(this.nodes.values());
    }

    addNode(node: Node): void {
        const command = new AddNodeCommand(this, node);
        this.executeCommand(command);
    }

    addNodeToCanvas(node: Node): void {
        this.nodes.set(node.id, node);
        this.nodeContainer.appendChild(node.element);
        this.makeNodeDraggable(node);
        this.addEndpoints(node.element, node.constructor.name);

        // Add click event listener to select the node
        node.element.addEventListener('click', () => {
            this.selectNode(node);
        });
    }

    removeNodeFromCanvas(nodeId: string): void {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Prevent deletion of StartNode and EndNode
        if (node.constructor.name === 'StartNode' || node.constructor.name === 'EndNode') {
            console.warn(`Cannot delete ${node.constructor.name}`);
            return;
        }

        this.nodes.delete(nodeId);
        this.nodeContainer.removeChild(node.element);
        this.jsPlumbInstance.removeAllEndpoints(node.element);
    }

    makeNodeDraggable(node: Node): void {
        this.jsPlumbInstance.draggable(node.element, {
            containment: "parent",
            // @ts-ignore
            grid: [this.gridSize, this.gridSize],
            drag: () => {
                this.jsPlumbInstance.repaintEverything();
            },
        });
    }

    addEndpoints(node: HTMLElement, type: string): void {
        if (type !== "StartNode") {
            this.jsPlumbInstance.addEndpoint(node, {
                anchor: "Left",
                isTarget: true,
                paintStyle: {fill: "#2196f3"},
                maxConnections: -1,
                endpoint: ["Dot", {radius: 7}],
            });
        }

        if (type !== "EndNode") {
            this.jsPlumbInstance.addEndpoint(node, {
                anchor: "Right",
                isSource: true,
                paintStyle: {fill: "#ff9800"},
                maxConnections: -1,
                endpoint: ["Dot", {radius: 7}],
            });
        }
    }

    executeCommand(command: Command): void {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
    }

    undo(): void {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }

    selectNode(node: Node): void {
        if (this.selectedNode) {
            this.selectedNode.element.classList.remove('selected');
        }
        this.selectedNode = node;
        this.selectedNode.element.classList.add('selected');
    }

    deselectNode(): void {
        if (this.selectedNode) {
            this.selectedNode.element.classList.remove('selected');
            this.selectedNode = null;
        }
    }
}

export {NodeManager};