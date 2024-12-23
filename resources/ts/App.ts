import {NodeManager} from "./NodeManager";
import {DialogueNode} from "./nodes/DialogueNode";
import {ChoiceNode} from "./nodes/ChoiceNode";
import {StartNode} from "./nodes/StartNode";
import {EndNode} from "./nodes/EndNode";
import {Node} from "./Node";
import {Export} from "./Export";
import {CanvasManager} from "./CanvasManager";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize NodeManager with the ID of the container element
    const containerId = "node-container";
    const nodeManager = new NodeManager(containerId);
    const canvasManager = new CanvasManager(containerId, "zoom-label");

    nodeManager.addNode(new StartNode(50, window.innerHeight / 2));
    nodeManager.addNode(new EndNode(window.innerWidth - 200, window.innerHeight / 2));

    // Event listeners for node creation
    document.getElementById("add-dialogue")?.addEventListener("click", () => {
        nodeManager.addNode(new DialogueNode(100, 100));
    });

    document.getElementById("add-choice")?.addEventListener("click", () => {
        const node = new ChoiceNode(200, 200);
        nodeManager.addNode(new ChoiceNode(200, 200));
    });

    document.getElementById("export")?.addEventListener("click", () => {
        const level_name = document.getElementById("level_name") as HTMLInputElement;
        const class_id = document.getElementById("class_id") as HTMLInputElement;
        const nodes = nodeManager.getNodes();
        const serializedData = nodes.map(node => node.serialize());

        // Include level_name and class_id in the data sent to Export
        new Export(serializedData, level_name.value, class_id.value);
    });

    document.getElementById("add-start")?.addEventListener("click", () => {
        nodeManager.addNode(new StartNode(0, window.innerHeight / 2));
    });

    document.getElementById("add-end")?.addEventListener("click", () => {
        nodeManager.addNode(new EndNode(0, window.innerHeight / 2));
    });

    // Undo and redo actions
    document.getElementById("undo")?.addEventListener("click", () => {
        nodeManager.undo();
    });

    document.getElementById("redo")?.addEventListener("click", () => {
        nodeManager.redo();
    });

    // Shortcut for selecting nodes
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === 'z') {
            nodeManager.undo();
        } else if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
            nodeManager.redo();
        } else if (event.key === 'x' || event.key === 'Delete') {
            if (nodeManager.selectedNode) {
                nodeManager.removeNodeFromCanvas(nodeManager.selectedNode.id);
                nodeManager.deselectNode();
            }
        }
    });

    // Zoom and pan actions
    canvasManager.initEventListeners();
});