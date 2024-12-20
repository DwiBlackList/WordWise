// CanvasManager.js
export class CanvasManager {
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
            const zoomSensitivity = 0.001;
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
