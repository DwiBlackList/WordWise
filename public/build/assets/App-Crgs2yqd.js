var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { j as jsplumb } from "./jsplumb-ukg1E-b_.js";
import "./_commonjsHelpers-DWwsNxpa.js";
class AddNodeCommand {
  constructor(manager, node) {
    __publicField(this, "manager");
    __publicField(this, "node");
    this.manager = manager;
    this.node = node;
  }
  execute() {
    this.manager.addNodeToCanvas(this.node);
  }
  undo() {
    this.manager.removeNodeFromCanvas(this.node.id);
  }
}
const _NodeManager = class _NodeManager {
  // Track the selected node
  constructor(containerId) {
    __publicField(this, "jsPlumbInstance");
    __publicField(this, "idCounter");
    __publicField(this, "nodes");
    __publicField(this, "undoStack");
    __publicField(this, "redoStack");
    __publicField(this, "gridSize");
    __publicField(this, "nodeContainer");
    __publicField(this, "selectedNode", null);
    this.idCounter = 1;
    this.nodeContainer = document.getElementById(containerId);
    this.nodes = /* @__PURE__ */ new Map();
    this.undoStack = [];
    this.redoStack = [];
    this.gridSize = 20;
    this.jsPlumbInstance = jsplumb.jsPlumb.getInstance();
    this.initializeJsPlumb();
    _NodeManager.instance = this;
  }
  static getInstance() {
    return _NodeManager.instance;
  }
  initializeJsPlumb() {
    this.jsPlumbInstance.setContainer(this.nodeContainer);
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { cornerRadius: 5, gap: 10 }],
      PaintStyle: { stroke: "#888", strokeWidth: 2 },
      HoverPaintStyle: { stroke: "#ac74d3", strokeWidth: 3 },
      EndpointStyle: { radius: 3, fill: "#888" },
      ConnectorStyle: { stroke: "#888", strokeWidth: 2 }
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
  generateNodeId() {
    return `node${this.idCounter++}`;
  }
  getNodes() {
    return Array.from(this.nodes.values());
  }
  addNode(node) {
    const command = new AddNodeCommand(this, node);
    this.executeCommand(command);
  }
  addNodeToCanvas(node) {
    this.nodes.set(node.id, node);
    this.nodeContainer.appendChild(node.element);
    this.makeNodeDraggable(node);
    this.addEndpoints(node.element, node.constructor.name);
    node.element.addEventListener("click", () => {
      this.selectNode(node);
    });
  }
  removeNodeFromCanvas(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    if (node.constructor.name === "StartNode" || node.constructor.name === "EndNode") {
      console.warn(`Cannot delete ${node.constructor.name}`);
      return;
    }
    this.nodes.delete(nodeId);
    this.nodeContainer.removeChild(node.element);
    this.jsPlumbInstance.removeAllEndpoints(node.element);
  }
  makeNodeDraggable(node) {
    this.jsPlumbInstance.draggable(node.element, {
      containment: "parent",
      // @ts-ignore
      grid: [this.gridSize, this.gridSize],
      drag: () => {
        this.jsPlumbInstance.repaintEverything();
      }
    });
  }
  addEndpoints(node, type) {
    if (type !== "StartNode") {
      this.jsPlumbInstance.addEndpoint(node, {
        anchor: "Left",
        isTarget: true,
        paintStyle: { fill: "#2196f3" },
        maxConnections: -1,
        endpoint: ["Dot", { radius: 7 }]
      });
    }
    if (type !== "EndNode") {
      this.jsPlumbInstance.addEndpoint(node, {
        anchor: "Right",
        isSource: true,
        paintStyle: { fill: "#ff9800" },
        maxConnections: -1,
        endpoint: ["Dot", { radius: 7 }]
      });
    }
  }
  executeCommand(command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }
  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }
  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }
  selectNode(node) {
    if (this.selectedNode) {
      this.selectedNode.element.classList.remove("selected");
    }
    this.selectedNode = node;
    this.selectedNode.element.classList.add("selected");
  }
  deselectNode() {
    if (this.selectedNode) {
      this.selectedNode.element.classList.remove("selected");
      this.selectedNode = null;
    }
  }
};
__publicField(_NodeManager, "instance");
let NodeManager = _NodeManager;
class Node {
  constructor(x, y) {
    __publicField(this, "id");
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "connections");
    __publicField(this, "element");
    if (new.target === Node) {
      throw new TypeError("Cannot construct Node instances directly");
    }
    this.id = NodeManager.getInstance().generateNodeId();
    this.x = x;
    this.y = y;
    this.connections = [];
    this.element = document.createElement("div");
    this.element.id = this.id;
    this.element.className = "node";
    this.setPosition(x, y);
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
    this.connections = this.connections.filter((conn) => conn !== node);
  }
  serialize() {
    return {
      id: this.id,
      type: this.constructor.name,
      x: this.x,
      y: this.y,
      connections: this.connections.map((conn) => conn.id)
    };
  }
}
class DialogueNode extends Node {
  constructor(x, y, { text = "" } = { text: "" }) {
    super(x, y);
    __publicField(this, "text");
    this.text = text;
    this.element.className += " auto-resize dialogue-node";
    const label = document.createElement("span");
    label.className = "node-label";
    label.textContent = "Dialogue";
    this.element.appendChild(label);
    const dialogueText = document.createElement("textarea");
    dialogueText.className = "dialogue-textarea lde-textarea";
    dialogueText.placeholder = "Enter dialogue...";
    dialogueText.value = text;
    this.element.appendChild(dialogueText);
    dialogueText.addEventListener("input", (event) => {
      const target = event.target;
      this.text = target.value;
    });
  }
  serialize() {
    return {
      ...super.serialize(),
      text: this.text
    };
  }
}
class ChoiceNode extends Node {
  constructor(x, y, { text = "" } = { text: "" }) {
    super(x, y);
    __publicField(this, "text");
    this.text = text;
    this.element.className += " auto-resize choice-node";
    const label = document.createElement("span");
    label.className = "node-label";
    label.textContent = "Player Choice";
    this.element.appendChild(label);
    const dialogueText = document.createElement("textarea");
    dialogueText.className = "choice-textarea lde-textarea";
    dialogueText.placeholder = "Enter dialogue...";
    dialogueText.value = text;
    this.element.appendChild(dialogueText);
    dialogueText.addEventListener("input", (event) => {
      const target = event.target;
      this.text = target.value;
    });
  }
  serialize() {
    return {
      ...super.serialize(),
      text: this.text
    };
  }
}
class StartNode extends Node {
  constructor(x, y) {
    super(x, y);
    this.element.className += " start-node";
    const label = document.createElement("span");
    label.className = "node-label";
    label.textContent = "Start";
    this.element.appendChild(label);
  }
}
class Export {
  constructor(data, level_name, chapter_name, class_id) {
    this.level_name = level_name;
    this.chapter_name = chapter_name;
    this.class_id = class_id;
    this.convertDialogue(data);
  }
  async convertDialogue(data) {
    const nodeMap = {};
    const nodeIdToDialogueIndex = {};
    let dialogueCounter = 0;
    const processedNodes = /* @__PURE__ */ new Set();
    data.forEach((node) => {
      nodeMap[node.id] = node;
    });
    const processNode = (nodeId, indent = "") => {
      if (processedNodes.has(nodeId)) {
        return "";
      }
      processedNodes.add(nodeId);
      const currentNode = nodeMap[nodeId];
      if (!currentNode) {
        throw new Error(`Node with ID ${nodeId} not found in nodeMap`);
      }
      let result = "";
      if (currentNode.type === "DialogueNode") {
        const dialogueTag = `Dialog${nodeIdToDialogueIndex[nodeId]}`;
        result += `${indent}<${dialogueTag}>
`;
        result += `${indent}	<Character>Villager</Character>
`;
        result += `${indent}	<Question>${currentNode.text}</Question>
`;
        const nextChoices = currentNode.connections;
        nextChoices.forEach((choiceId, index) => {
          const choiceNode = nodeMap[choiceId];
          if (choiceNode) {
            const optionTag = `Option${String.fromCharCode(65 + index)}`;
            const nextNodeId = choiceNode.connections.length > 0 ? choiceNode.connections[0] : null;
            let actionValue = -1;
            if (nextNodeId) {
              if (!nodeIdToDialogueIndex.hasOwnProperty(nextNodeId)) {
                nodeIdToDialogueIndex[nextNodeId] = dialogueCounter;
                dialogueCounter++;
              }
              actionValue = nodeIdToDialogueIndex[nextNodeId];
            }
            result += `${indent}	<${optionTag} Action="${actionValue}">${choiceNode.text || "..."}</${optionTag}>
`;
          }
        });
        result += `${indent}</${dialogueTag}>
`;
        nextChoices.forEach((choiceId) => {
          const choiceNode = nodeMap[choiceId];
          if (choiceNode && choiceNode.connections.length > 0) {
            const nextNodeId = choiceNode.connections[0];
            if (!nodeIdToDialogueIndex.hasOwnProperty(nextNodeId)) {
              nodeIdToDialogueIndex[nextNodeId] = dialogueCounter;
              dialogueCounter++;
            }
            result += processNode(nextNodeId, indent);
          }
        });
      }
      return result;
    };
    const startNode = data.find((node) => node.type === "StartNode");
    let dialogueXML = "<Level>\n";
    if (startNode && startNode.connections.length > 0) {
      startNode.connections.forEach((connectionId) => {
        if (!nodeIdToDialogueIndex.hasOwnProperty(connectionId)) {
          nodeIdToDialogueIndex[connectionId] = dialogueCounter;
          dialogueCounter++;
        }
        dialogueXML += processNode(connectionId, "	");
      });
    }
    dialogueXML += "</Level>";
    console.log(dialogueXML);
    await this.storeDialogue("../api/v1/levels", {
      dialogue_data: dialogueXML,
      level_name: this.level_name,
      chapter_name: this.chapter_name,
      class_id: this.class_id
    });
  }
  async storeDialogue(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Dialogue stored successfully!");
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}
class CanvasManager {
  constructor(containerId, zoomLabelId) {
    __publicField(this, "nodeContainer");
    __publicField(this, "zoomLabel");
    __publicField(this, "zoomLevel");
    __publicField(this, "isPanning");
    __publicField(this, "startX");
    __publicField(this, "startY");
    __publicField(this, "panX");
    __publicField(this, "panY");
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
    var _a;
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
    (_a = document.getElementById("reset-zoom")) == null ? void 0 : _a.addEventListener("click", () => {
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
document.addEventListener("DOMContentLoaded", () => {
  var _a, _b, _c, _d, _e, _f;
  const containerId = "node-container";
  const nodeManager = new NodeManager(containerId);
  const canvasManager = new CanvasManager(containerId, "zoom-label");
  nodeManager.addNode(new StartNode(50, window.innerHeight / 2));
  (_a = document.getElementById("add-dialogue")) == null ? void 0 : _a.addEventListener("click", () => {
    nodeManager.addNode(new DialogueNode(100, 100));
  });
  (_b = document.getElementById("add-choice")) == null ? void 0 : _b.addEventListener("click", () => {
    nodeManager.addNode(new ChoiceNode(400, 400));
  });
  (_c = document.getElementById("export")) == null ? void 0 : _c.addEventListener("click", () => {
    const level_name = document.getElementById("level_name");
    const chapter_name = document.getElementById("chapter_name");
    const class_id = document.getElementById("class_id");
    if (!level_name.value.trim()) {
      level_name.style.borderColor = "red";
      alert("Level name is required.");
      return;
    } else if (!chapter_name.value.trim()) {
      chapter_name.style.borderColor = "red";
      alert("Chapter name is required.");
      return;
    } else {
      level_name.style.borderColor = "";
    }
    const nodes = nodeManager.getNodes();
    const serializedData = nodes.map((node) => node.serialize());
    new Export(serializedData, level_name.value, level_name.value, class_id.value);
    alert("Level has been created successfully.");
  });
  (_d = document.getElementById("add-start")) == null ? void 0 : _d.addEventListener("click", () => {
    nodeManager.addNode(new StartNode(0, window.innerHeight / 2));
  });
  (_e = document.getElementById("undo")) == null ? void 0 : _e.addEventListener("click", () => {
    nodeManager.undo();
  });
  (_f = document.getElementById("redo")) == null ? void 0 : _f.addEventListener("click", () => {
    nodeManager.redo();
  });
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "z") {
      nodeManager.undo();
    } else if (event.ctrlKey && event.shiftKey && event.key === "Z") {
      nodeManager.redo();
    } else if (event.key === "Escape" || event.key === "p" || event.key === "P") {
      nodeManager.deselectNode();
    } else if (event.key === "x" || event.key === "Delete") {
      if (nodeManager.selectedNode) {
        nodeManager.removeNodeFromCanvas(nodeManager.selectedNode.id);
        nodeManager.deselectNode();
      }
    }
  });
  canvasManager.initEventListeners();
});
