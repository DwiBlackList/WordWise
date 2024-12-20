import {NodeManager} from "./components/NodeManager";
import {CanvasManager} from "./CanvasManager";

document.addEventListener("DOMContentLoaded", function () {
    jsPlumb.ready(function () {
        const nodeManager = new NodeManager("node-container");
        const canvasManager = new CanvasManager("node-container", "zoom-label");

        document.getElementById('add-dialogue').addEventListener('click', () => {
            nodeManager.addNode('dialogue', 100, 100);
        });

        document.getElementById('add-choice').addEventListener('click', () => {
            nodeManager.addNode('choice', 200, 100);
        });

        document.getElementById('add-end').addEventListener('click', () => {
            nodeManager.addNode('end', 300, 100);
        });

        document.getElementById('undo').addEventListener('click', () => {
            nodeManager.undo();
        });

        document.getElementById('redo').addEventListener('click', () => {
            nodeManager.redo();
        });

        document.addEventListener("keydown", (event) => {
            if ((event.key === 'x' || event.key === 'Delete') && nodeManager.selectedNode) {
                jsPlumb.removeAllEndpoints(nodeManager.selectedNode);
                nodeManager.selectedNode.remove();
                nodeManager.selectedNode = null;
            } else if (event.ctrlKey && event.key === 'z') {
                // event.shiftKey ? stateManager.redo() : stateManager.undo();
                nodeManager.undo();
            }
        });

        document.getElementById("toggle-tooltip").addEventListener("click", function () {
            const tooltip = document.querySelector(".tooltip");
            tooltip.classList.toggle("minimized");
            const icon = this.querySelector("#icon");
            icon.innerText = tooltip.classList.contains("minimized") ? "Tooltips" : "";
            icon.className = tooltip.classList.contains("minimized") ? "icon" : "icon-showed";
            this.className = tooltip.classList.contains("minimized") ? "tooltip-button" : "tooltip-button-showed";
        });

    });
});
