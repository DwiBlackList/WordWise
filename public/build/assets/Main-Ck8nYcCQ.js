import { j as jsplumb } from "./jsplumb-ukg1E-b_.js";
import "./_commonjsHelpers-DWwsNxpa.js";
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
    jsplumb.jsPlumb.setContainer(containerId);
    jsplumb.jsPlumb.importDefaults({
      Connector: ["Flowchart", { cornerRadius: 5, gap: 10 }],
      PaintStyle: { stroke: "#888", strokeWidth: 2 },
      HoverPaintStyle: { stroke: "#ac74d3", strokeWidth: 3 },
      EndpointStyle: { radius: 3, fill: "#888" },
      ConnectorStyle: { stroke: "#888", strokeWidth: 2 }
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
    `node${this.nodeCounter}`;
    this.nodeContainer.appendChild(node.element);
    this.makeNodeDraggable(node.element);
    this.addEndpoints(node.element, type);
    this.addNodeClickListener(node);
    this.nodes.push(node);
    this.executeAction({ action: "add", node });
    return node.element;
  }
  makeNodeDraggable(element) {
    jsplumb.jsPlumb.draggable(element, {
      containment: "parent",
      grid: [this.gridSize, this.gridSize],
      drag: () => {
        jsplumb.jsPlumb.repaintEverything();
      }
    });
  }
  addNodeClickListener(node) {
    node.element.addEventListener("click", () => {
      this.selectedNode = node.element;
      document.querySelectorAll(".node").forEach((n) => n.classList.remove("selected"));
      node.element.classList.add("selected");
    });
  }
  addEndpoints(node, type2) {
    if (type2 !== "start") {
      jsplumb.jsPlumb.addEndpoint(node, {
        anchor: "Left",
        isTarget: true,
        paintStyle: { fill: "#2196f3" },
        maxConnections: -1,
        endpoint: ["Dot", { radius: 7 }]
      });
    }
    if (type2 !== "end") {
      jsplumb.jsPlumb.addEndpoint(node, {
        anchor: "Right",
        isSource: true,
        paintStyle: { fill: "#ff9800" },
        maxConnections: -1,
        endpoint: ["Dot", { radius: 7 }]
      });
    }
  }
  executeAction(action) {
    this.undoStack.push(action);
    this.redoStack = [];
    if (action.action === "add") {
      this.addNode(action.node.type, action.node.x, action.node.y, action.node.options);
    }
  }
  undo() {
    const lastAction = this.undoStack.pop();
    if (!lastAction) return;
    switch (lastAction.action) {
      case "add":
        this.removeNode(lastAction.node.id);
        break;
    }
    this.redoStack.push(lastAction);
  }
  redo() {
    const lastUndo = this.redoStack.pop();
    if (!lastUndo) return;
    switch (lastUndo.action) {
      case "add":
        this.addNode(lastUndo.node.type, lastUndo.node.x, lastUndo.node.y, lastUndo.node.options);
        break;
    }
    this.undoStack.push(lastUndo);
  }
  removeNode(nodeId) {
    const nodeIndex = this.nodes.findIndex((node2) => node2.id === nodeId);
    if (nodeIndex === -1) return;
    const node = this.nodes[nodeIndex];
    this.nodeContainer.removeChild(node.element);
    this.nodes.splice(nodeIndex, 1);
    jsplumb.jsPlumb.removeAllEndpoints(node.element);
  }
  serialize() {
    return JSON.stringify(this.nodes.map((node) => ({
      id: node.id,
      type: node.constructor.name,
      x: node.x,
      y: node.y,
      options: node.options
    })));
  }
  deserialize(data) {
    const nodesData = JSON.parse(data);
    this.nodes = nodesData.map((nodeData) => {
      const { id, type: type2, x, y, options } = nodeData;
      const node = this.createNode(type2, id, x, y, options);
      this.nodeContainer.appendChild(node.element);
      this.makeNodeDraggable(node.element);
      this.addEndpoints(node.element, type2);
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
class CanvasManager {
  constructor(containerId, zoomLabelId) {
    this.nodeContainer = document.getElementById(containerId);
    this.zoomLabel = document.getElementById(zoomLabelId);
    this.zoomLevel = 1;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
    this.panX = 0;
    this.panY = 0;
    this.initEventListeners();
  }
  initEventListeners() {
    this.nodeContainer.addEventListener("mousedown", (event) => {
      this.isPanning = true;
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
    });
    document.addEventListener("mousemove", (event) => {
      if (this.isPanning) {
        this.panX = event.clientX - this.startX;
        this.panY = event.clientY - this.startY;
        this.updateCanvasZoom();
      }
    });
    document.addEventListener("mouseup", () => {
      this.isPanning = false;
    });
    this.nodeContainer.addEventListener("wheel", (event) => {
      event.preventDefault();
      const zoomSensitivity = 1e-3;
      this.zoomLevel += event.deltaY * -zoomSensitivity;
      this.zoomLevel = Math.min(Math.max(0.5, this.zoomLevel), 2);
      this.updateCanvasZoom();
    });
    document.getElementById("reset-zoom").addEventListener("click", () => {
      this.zoomLevel = 1;
      this.updateCanvasZoom();
    });
  }
  updateCanvasZoom() {
    const minZoomLevel = Math.min(window.innerWidth / this.nodeContainer.offsetWidth, window.innerHeight / this.nodeContainer.offsetHeight);
    this.zoomLevel = Math.max(minZoomLevel, Math.min(this.zoomLevel, 1.5));
    const maxPanX = (this.nodeContainer.offsetWidth * this.zoomLevel - window.innerWidth) / 2;
    const maxPanY = (this.nodeContainer.offsetHeight * this.zoomLevel - window.innerHeight) / 2;
    this.panX = Math.min(Math.max(this.panX, -maxPanX), 0);
    this.panY = Math.min(Math.max(this.panY, -maxPanY), 0);
    this.nodeContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
    this.zoomLabel.innerText = `${Math.round(this.zoomLevel * 100)}%`;
    jsPlumb.repaintEverything();
  }
}
document.addEventListener("DOMContentLoaded", function() {
  jsPlumb.ready(function() {
    const nodeManager = new NodeManager("node-container");
    new CanvasManager("node-container", "zoom-label");
    document.getElementById("add-dialogue").addEventListener("click", () => {
      nodeManager.addNode("dialogue", 100, 100);
    });
    document.getElementById("add-choice").addEventListener("click", () => {
      nodeManager.addNode("choice", 200, 100);
    });
    document.getElementById("add-end").addEventListener("click", () => {
      nodeManager.addNode("end", 300, 100);
    });
    document.getElementById("undo").addEventListener("click", () => {
      nodeManager.undo();
    });
    document.getElementById("redo").addEventListener("click", () => {
      nodeManager.redo();
    });
    document.addEventListener("keydown", (event) => {
      if ((event.key === "x" || event.key === "Delete") && nodeManager.selectedNode) {
        jsPlumb.removeAllEndpoints(nodeManager.selectedNode);
        nodeManager.selectedNode.remove();
        nodeManager.selectedNode = null;
      } else if (event.ctrlKey && event.key === "z") {
        nodeManager.undo();
      }
    });
    document.getElementById("toggle-tooltip").addEventListener("click", function() {
      const tooltip = document.querySelector(".tooltip");
      tooltip.classList.toggle("minimized");
      const icon = this.querySelector("#icon");
      icon.innerText = tooltip.classList.contains("minimized") ? "Tooltips" : "";
      icon.className = tooltip.classList.contains("minimized") ? "icon" : "icon-showed";
      this.className = tooltip.classList.contains("minimized") ? "tooltip-button" : "tooltip-button-showed";
    });
  });
});
