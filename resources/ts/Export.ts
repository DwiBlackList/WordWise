interface Node {
    id: string;
    type: string;
    x: number;
    y: number;
    connections: string[];
    text?: string;
    imagePath?: string; // Add imagePath property to Node interface
}

interface DialogueData {
    dialogue_data: string;
    level_name: string;
    chapter_name: string;
    class_id: string;
}

interface ApiResponse {
    message: string;
    data: {
        id: number;
        dialogue_data: string;
        level_name: string;
        chapter_name: string;
        class_id: string;
    };
}

export class Export {
    constructor(data: Node[], private level_name: string, private chapter_name: string, private class_id: string) {
        this.convertDialogue(data);
    }

    async convertDialogue(data: Node[]) {
        const nodeMap: Record<string, Node> = {};
        const nodeIdToDialogueIndex: Record<string, number> = {}; // Map to store dialogue index by node ID
        let dialogueCounter = 0; // Counter for numbering dialogues
        const processedNodes: Set<string> = new Set(); // Set to track processed nodes

        // Populate the nodeMap
        data.forEach(node => {
            nodeMap[node.id] = node;
        });

        const processNode = (nodeId: string, indent: string = ""): string => {
            if (processedNodes.has(nodeId)) {
                return ""; // Skip already processed nodes
            }
            processedNodes.add(nodeId);

            const currentNode = nodeMap[nodeId];
            if (!currentNode) {
                throw new Error(`Node with ID ${nodeId} not found in nodeMap`);
            }
            let result = "";

            // Process DialogueNode
            if (currentNode.type === 'DialogueNode') {
                const dialogueTag = `Dialog${nodeIdToDialogueIndex[nodeId]}`;
                result += `${indent}<${dialogueTag}>\n`;
                result += `${indent}\t<Character>Villager</Character>\n`;
                result += `${indent}\t<Question>\n`;
                if (currentNode.imagePath) {
                    result += `${indent}\t\t<PhotoPath>https://lunarinteractive.net${currentNode.imagePath}</PhotoPath>\n`;
                }
                result += `${indent}\t\t${currentNode.text}\n`;
                result += `${indent}\t</Question>\n`;

                // Process each choice
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
                        result += `${indent}\t<${optionTag} Action="${actionValue}">\n`;
                        if (choiceNode.imagePath) {
                            result += `${indent}\t\t<PhotoPath>https://lunarinteractive.net${choiceNode.imagePath}</PhotoPath>\n`;
                        }
                        result += `${indent}\t\t${choiceNode.text || '...'}\n`;
                        result += `${indent}\t</${optionTag}>\n`;
                    }
                });

                result += `${indent}</${dialogueTag}>\n`;

                // Process each choice's connections
                nextChoices.forEach(choiceId => {
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

        // Start processing from StartNode
        const startNode = data.find(node => node.type === 'StartNode');
        let dialogueXML = "<Level>\n";
        if (startNode && startNode.connections.length > 0) {
            startNode.connections.forEach(connectionId => {
                if (!nodeIdToDialogueIndex.hasOwnProperty(connectionId)) {
                    nodeIdToDialogueIndex[connectionId] = dialogueCounter;
                    dialogueCounter++;
                }
                dialogueXML += processNode(connectionId, "\t");
            });
        }
        dialogueXML += "</Level>";

        // Output the generated dialogue
        console.log(dialogueXML);
        await this.storeDialogue('../api/v1/levels', {
            dialogue_data: dialogueXML,
            level_name: this.level_name,
            chapter_name: this.chapter_name,
            class_id: this.class_id
        });
    }

    async storeDialogue(url: string, data: DialogueData): Promise<ApiResponse | null> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Dialogue stored successfully!');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}