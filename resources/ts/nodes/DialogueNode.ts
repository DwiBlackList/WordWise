import {Node} from "../Node";
import {NodeManager} from "../NodeManager";

export class DialogueNode extends Node {
    text: string;
    imagePath: string;

    constructor(x: number, y: number, {text = "", imagePath = ""}: { text: string, imagePath?: string } = {text: "", imagePath: ""}) {
        super(x, y);
        this.text = text;
        this.imagePath = imagePath;
        this.element.className += " auto-resize dialogue-node";

        // Create and append a label for the Dialogue Node
        const label = document.createElement("span");
        label.className = "node-label";
        label.textContent = "Dialogue";
        this.element.appendChild(label);

        // Create and append a text area for dialogue text
        const dialogueText = document.createElement("textarea");
        dialogueText.className = "dialogue-textarea lde-textarea";
        dialogueText.placeholder = "Enter dialogue...";
        dialogueText.value = text;
        this.element.appendChild(dialogueText);
        
        dialogueText.addEventListener("input", (event) => {
            const target = event.target as HTMLTextAreaElement;
            this.text = target.value;
        });

        // Create and append an image upload input
        const imageUpload = document.createElement("input");
        imageUpload.type = "file";
        imageUpload.accept = "image/*";
        imageUpload.className = "dialogue-image-upload";
        this.element.appendChild(imageUpload);

        imageUpload.addEventListener("change", async (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const formData = new FormData();
                formData.append("file", target.files[0]);

                // Get CSRF token from meta tag
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                try {
                    // Upload the image to the server
                    const response = await fetch("/levels/upload/image", {
                        method: "POST",
                        headers: {
                            'X-CSRF-TOKEN': csrfToken || ''
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Image upload failed');
                    }

                    const result = await response.json();
                    this.imagePath = result.filePath;
                } catch (error) {
                    alert('Image upload failed');
                }
            }
        });
    }

    serialize(): { x: number; y: number; id: string; text: string; type: string; connections: string[], imagePath: string } {
        return {
            ...super.serialize(),
            text: this.text,
            imagePath: this.imagePath
        };
    }

}
