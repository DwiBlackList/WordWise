import {jsPlumb} from "jsplumb";
import {DialogueNode} from "./nodes/DialogueNode";
import {ChoiceNode} from "./nodes/ChoiceNode";
import {StartNode} from "./nodes/StartNode";
import {EndNode} from "./nodes/EndNode";
import {Node} from "./nodes/Node";

class NodeManager {
    constructor(containerId) {
        this.nodeCounter = 0;
        this.nodeContainer = document.getElementById(containerId);
        this.selectedNode = null;
        this.startNode = null;
        this.nodes = [];
        this.undoStack = [];
        this.redoStack = [];
        this.gridSize = 20;

        this.initializeJsPlumb(containerId);
        this.createInitialNodes();
    }

    initializeJsPlumb(containerId) {
        jsPlumb.setContainer(containerId);
        jsPlumb.importDefaults({
            Connector: ["Flowchart", {cornerRadius: 5, gap: 10}],
            PaintStyle: {stroke: "#888", strokeWidth: 2},
            HoverPaintStyle: {stroke: "#ac74d3", strokeWidth: 3},
            EndpointStyle: {radius: 3, fill: "#888"},
            ConnectorStyle: {stroke: "#888", strokeWidth: 2}
        });
    }

    createInitialNodes() {
        const initialY = Math.round(window.innerHeight / 2 / this.gridSize) * this.gridSize;
        this.addNode("start", this.gridSize, initialY);
        this.addNode("end", Math.round((window.innerWidth - 200) / this.gridSize) * this.gridSize, initialY);
    }

    addNode(node) {
        if (type === "start" && this.startNode) {
            console.warn("A start node already exists.");
            return;
        }

        this.nodeCounter++;
        const id = `node${this.nodeCounter}`;

        this.nodeContainer.appendChild(node.element);
        this.makeNodeDraggable(node.element);
        this.addEndpoints(node.element, type);
        this.addNodeClickListener(node);

        this.nodes.push(node);
        this.executeAction({action: 'add', node});
        return node.element;
    }


    makeNodeDraggable(element) {
        jsPlumb.draggable(element, {
            containment: "parent",
            grid: [this.gridSize, this.gridSize],
            drag: () => {
                jsPlumb.repaintEverything();
            }
        });
    }

    addNodeClickListener(node) {
        node.element.addEventListener("click", () => {
            this.selectedNode = node.element;
            document.querySelectorAll(".node").forEach(n => n.classList.remove("selected"));
            node.element.classList.add("selected");
        });
    }

    addEndpoints(node, type) {
        if (type !== "start") {
            jsPlumb.addEndpoint(node, {
                anchor: "Left",
                isTarget: true,
                paintStyle: {fill: "#2196f3"},
                maxConnections: -1,
                endpoint: ["Dot", {radius: 7}],
            });
        }

        if (type !== "end") {
            jsPlumb.addEndpoint(node, {
                anchor: "Right",
                isSource: true,
                paintStyle: {fill: "#ff9800"},
                maxConnections: -1,
                endpoint: ["Dot", {radius: 7}],
            });
        }
    }

    executeAction(action) {
        this.undoStack.push(action);
        this.redoStack = [];
        if (action.action === 'add') {
            this.addNode(action.node.type, action.node.x, action.node.y, action.node.options);
        }
    }

    undo() {
        const lastAction = this.undoStack.pop();
        if (!lastAction) return;

        switch (lastAction.action) {
            case 'add':
                this.removeNode(lastAction.node.id);
                break;
            // Add more cases if needed
        }
        this.redoStack.push(lastAction);
    }

    redo() {
        const lastUndo = this.redoStack.pop();
        if (!lastUndo) return;

        switch (lastUndo.action) {
            case 'add':
                this.addNode(lastUndo.node.type, lastUndo.node.x, lastUndo.node.y, lastUndo.node.options);
                break;
            // Add more cases if needed
        }
        this.undoStack.push(lastUndo);
    }

    removeNode(nodeId) {
        const nodeIndex = this.nodes.findIndex(node => node.id === nodeId);
        if (nodeIndex === -1) return;

        const node = this.nodes[nodeIndex];
        this.nodeContainer.removeChild(node.element);
        this.nodes.splice(nodeIndex, 1);
        jsPlumb.removeAllEndpoints(node.element);
    }

    serialize() {
        return JSON.stringify(this.nodes.map(node => ({
            id: node.id,
            type: node.constructor.name,
            x: node.x,
            y: node.y,
            options: node.options
        })));
    }

    deserialize(data) {
        const nodesData = JSON.parse(data);
        this.nodes = nodesData.map(nodeData => {
            const {id, type, x, y, options} = nodeData;
            const node = this.createNode(type, id, x, y, options);
            this.nodeContainer.appendChild(node.element);
            this.makeNodeDraggable(node.element);
            this.addEndpoints(node.element, type);
            return node;
        });
    }

    inputChangeAction(node, element, oldValue, newValue) {
        const action = {
            execute: () => {
                element.value = newValue;
            },
            undo: () => {
                element.value = oldValue;
            }
        };
        this.executeAction(action);
    }
}

export {NodeManager};
