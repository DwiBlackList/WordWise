interface Node {
    id: string;
    type: string;
    x: number;
    y: number;
    connections: string[];
    text?: string;
}

interface DialogueData {
    dialogue_data: string;
}

interface ApiResponse {
    message: string;
    data: {
        id: number;
        dialogue_data: string;
    };
}

export class Export {
    constructor(data: Node[]) {
        this.convertDialogue(data);
    }

    async convertDialogue(data: Node[]) {
        const dialogue: string[] = [];
        const nodeMap: Record<string, Node> = {};
        const incomingConnectionsCount: Record<string, number> = {}; // Track incoming connections per node
        const createdLabels: Record<string, string> = {}; // Track labels for nodes with multiple incoming connections

        // Populate the nodeMap and count incoming connections
        data.forEach(node => {
            nodeMap[node.id] = node;
            node.connections.forEach(connectionId => {
                incomingConnectionsCount[connectionId] = (incomingConnectionsCount[connectionId] || 0) + 1;
            });
        });

        const processNode = (nodeId: string, indent: string = "") => {
            const currentNode = nodeMap[nodeId];

            // Add label if necessary (only if node has multiple incoming connections)
            if (incomingConnectionsCount[nodeId] > 1 && !createdLabels[nodeId]) {
                const labelName = `manyToOne_${Object.keys(createdLabels).length + 1}`;
                createdLabels[nodeId] = labelName;
                dialogue.push(`${indent}label ${labelName}`);
            } else if (incomingConnectionsCount[nodeId] > 1 && createdLabels[nodeId]) {
                dialogue.push(`${indent}jump ${createdLabels[nodeId]}`);
                return;
            }

            // Process DialogueNode
            if (currentNode.type === 'DialogueNode') {
                dialogue.push(`${indent}Villager: ${currentNode.text}`);

                // Process each choice
                const nextChoices = currentNode.connections;
                nextChoices.forEach(choiceId => {
                    const choiceNode = nodeMap[choiceId];
                    dialogue.push(`${indent}- ${choiceNode.text}`);

                    if (choiceNode.connections.length > 0) {
                        const nextNodeId = choiceNode.connections[0];
                        const nextIndent = indent + "\t";

                        // Check if next node needs a jump
                        if (incomingConnectionsCount[nextNodeId] > 1 && createdLabels[nextNodeId]) {
                            dialogue.push(`${nextIndent}jump ${createdLabels[nextNodeId]}`);
                        } else {
                            processNode(nextNodeId, nextIndent);
                        }
                    }
                });
            }
            // Process ChoiceNode
            else if (currentNode.type === 'ChoiceNode') {
                if (currentNode.connections.length > 0) {
                    const nextNodeId = currentNode.connections[0];
                    if (incomingConnectionsCount[nextNodeId] > 1 && createdLabels[nextNodeId]) {
                        dialogue.push(`${indent}jump ${createdLabels[nextNodeId]}`);
                    } else {
                        processNode(nextNodeId, indent);
                    }
                }
            }
        };

        // Start processing from StartNode
        const startNode = data.find(node => node.type === 'StartNode');
        if (startNode && startNode.connections.length > 0) {
            processNode(startNode.connections[0]);
        }
        // Output the generated dialogue
        console.log(dialogue.join('\n'));
        await this.storeDialogue('../api/v1/dialogues', {dialogue_data: dialogue.join('\n')});
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

// Example Usage
// Assuming the data variable holds the JSON structure you provided:
// const data: Node[] = [...]; // Your data here
// new Export(data);
