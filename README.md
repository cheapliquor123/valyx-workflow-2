# Valyx Workflow Editor

A drag-and-drop workflow editor built with React, React Flow, and Material UI.

## Quick Start


### 1. Installation
Clone the repo and install dependencies:

```bash
git clone <repository-url>
cd valyx-workflow
npm install
```

### 2. Running the App
Start the development serve

```bash
npm run dev
```

## User Guide
### 1. Adding Nodes
Drag and Drop: Open the Sidebar on the left. Drag any Trigger, Controller, or Activity onto the canvas.

Auto-Layout: The editor automatically assigns a unique ID (e.g., email-analysis-node-1) and loads the default parameters from the API.

### 2. Renaming Nodes
Edit Title: Click directly on the Header Title of any node (the colored box at the top).

Type & Change: The text field is editable. Type your custom name (e.g., "Check for Spam") and click away to save. The internal system ID remains unchanged.

### 3. Connecting Nodes
Draw Connections: Click and drag from a Right Handle (Source) of one node to a Left Handle (Target) of another.

Controllers: Controller nodes have two output handles on the right:

Top Handle (Green): The "True" / "If" path.

Bottom Handle (Red): The "False" / "Else" path.

### 4. Configuring Parameters
Smart Inputs: Some fields (like "Input Edge Name") require you to reference another node.

Context-Aware Dropdowns: You do not need to type IDs manually. If a field expects an edge input, simply click the dropdown. It will show a list of currently connected upstream nodes (e.g., "Connection from Create Email Trigger").

### 5. Deleting Items
Delete Node: Hover over any node. A Trash Icon will appear in the top-right corner. Click it to remove the node and all its connections.

Delete Edge: Click on any connecting line to select it (it turns blue). A Red Trash Icon will appear in the middle of the line. Click the icon to delete the connection.

### 6. Saving the Workflow
Smart Save: Click the "Save Workflow" button in the top right.

Validation: The system automatically checks if there are changes. If the workflow hasn't changed since the last save, no request is sent to the server.

Auto-Wiring: Technical details (like inputEdgeName or trueEdgeOutput) are hidden from the UI but are automatically calculated and injected into the payload when you save.
