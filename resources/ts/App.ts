import {NodeManager} from "./NodeManager";
import {DialogueNode} from "./nodes/DialogueNode";
import {ChoiceNode} from "./nodes/ChoiceNode";
import {StartNode} from "./nodes/StartNode";
import {Node} from "./Node";
import {Export} from "./Export";
// import {EndNode} from "./nodes/EndNode";

document.addEventListener("DOMContentLoaded", () => {
// Initialize NodeManager with the ID of the container element
    const containerId = "node-container";
    const nodeManager = new NodeManager(containerId);
    // const data: Node[] = [
    //     {
    //         "id": "node1",
    //         "type": "StartNode",
    //         "x": 50,
    //         "y": 496,
    //         "connections": [
    //             "node2"
    //         ]
    //     },
    //     {
    //         "id": "node2",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [
    //             "node4",
    //             "node6",
    //             "node8"
    //         ],
    //         "text": "Halo, nama saya babi, nama kamu siapa?"
    //     },
    //     {
    //         "id": "node4",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node9"
    //         ],
    //         "text": "Halo, nama saya anjing"
    //     },
    //     {
    //         "id": "node6",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node9"
    //         ],
    //         "text": "Hai, aku anjing"
    //     },
    //     {
    //         "id": "node8",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node10"
    //         ],
    //         "text": "oh hai, saya anjing"
    //     },
    //     {
    //         "id": "node9",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [
    //             "node12",
    //             "node14"
    //         ],
    //         "text": "senang bertemu dengan mu anjing"
    //     },
    //     {
    //         "id": "node10",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [
    //             "node16",
    //             "node18",
    //             "node14"
    //         ],
    //         "text": "salam kenal anjing"
    //     },
    //     {
    //         "id": "node12",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node20"
    //         ],
    //         "text": "kamu suka apa babi?"
    //     },
    //     {
    //         "id": "node14",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node19"
    //         ],
    //         "text": "kamu seperti apa babi?"
    //     },
    //     {
    //         "id": "node16",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node21"
    //         ],
    //         "text": "kamu babi"
    //     },
    //     {
    //         "id": "node18",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node21"
    //         ],
    //         "text": "kamu bau"
    //     },
    //     {
    //         "id": "node19",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [
    //             "node23",
    //             "node25"
    //         ],
    //         "text": "aku seperti babi"
    //     },
    //     {
    //         "id": "node20",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [
    //             "node23",
    //             "node25"
    //         ],
    //         "text": "aku suka anjing"
    //     },
    //     {
    //         "id": "node21",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [
    //             "node25",
    //             "node23"
    //         ],
    //         "text": "walah, kamu ngentot"
    //     },
    //     {
    //         "id": "node23",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node26"
    //         ],
    //         "text": "the fuck"
    //     },
    //     {
    //         "id": "node25",
    //         "type": "ChoiceNode",
    //         "x": 200,
    //         "y": 200,
    //         "connections": [
    //             "node26"
    //         ],
    //         "text": "walawe"
    //     },
    //     {
    //         "id": "node26",
    //         "type": "DialogueNode",
    //         "x": 100,
    //         "y": 100,
    //         "connections": [],
    //         "text": "ya gitulah"
    //     }
    // ];

    nodeManager.addNode(new StartNode(50, window.innerHeight / 2));

// Event listeners for node creation
    document.getElementById("add-dialogue")?.addEventListener("click", () => {
        nodeManager.addNode(new DialogueNode(100, 100));
    });

    document.getElementById("add-choice")?.addEventListener("click", () => {
        const node = new ChoiceNode(200, 200);
        nodeManager.addNode(new ChoiceNode(200, 200));
    });

    document.getElementById("export")?.addEventListener("click", () => {
        const nodes = nodeManager.getNodes();
        const serializedData = nodes.map(node => node.serialize());
        new Export(serializedData);
    });

// document.getElementById("addStartNode")?.addEventListener("click", () => {
//     const node = new StartNode(nodeManager.generateNodeId(), 50, 50);
//     addNode(node);
// });
//
// document.getElementById("addEndNode")?.addEventListener("click", () => {
//     const node = new EndNode(nodeManager.generateNodeId(), 300, 300);
//     addNode(node);
// });

// Undo and redo actions
    document.getElementById("undo")?.addEventListener("click", () => {
        nodeManager.undo();
    });

    document.getElementById("redo")?.addEventListener("click", () => {
        nodeManager.redo();
    })
});
