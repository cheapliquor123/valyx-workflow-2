import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  getConnectedEdges,
} from "@xyflow/react";

// Helper: Generate next Edge ID
const generateNextEdgeId = (edges) => {
  let maxIndex = 0;
  edges.forEach((edge) => {
    const match = edge.id.match(/^edge(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxIndex) maxIndex = num;
    }
  });
  return `edge${maxIndex + 1}`;
};

const useWorkflowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  workflowId: null,
  workflowName: "",

  // --- NEW: Change Tracking State ---
  savedState: null, // Stores the JSON string of the last saved/loaded state

  // --- Actions ---

  // Set the baseline state (Call this on Load and after Save)
  setSavedState: (stateString) => {
    set({ savedState: stateString });
  },

  setWorkflow: (nodes, edges, workflowId, workflowName) => {
    set({
      nodes,
      edges,
      workflowId,
      workflowName: workflowName || "Untitled Workflow",
    });
  },

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    const currentEdges = get().edges;
    const nextId = generateNextEdgeId(currentEdges);

    const newEdge = {
      ...connection,
      id: nextId,
      type: "buttonedge",
      animated: false,
      style: { stroke: "#555", strokeWidth: 2 },
    };

    set({ edges: addEdge(newEdge, currentEdges) });
  },

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    });
  },

  updateNodeParam: (nodeId, paramKey, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          const updatedParams = { ...node.data.params, [paramKey]: value };
          return { ...node, data: { ...node.data, params: updatedParams } };
        }
        return node;
      }),
    });
  },

  deleteEdge: (edgeId) => {
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
  },

  onNodesDelete: (deletedNodes) => {
    const { nodes, edges } = get();
    const connectedEdges = getConnectedEdges(deletedNodes, edges);
    const connectedEdgeIds = connectedEdges.map((edge) => edge.id);
    set({ edges: edges.filter((edge) => !connectedEdgeIds.includes(edge.id)) });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges } = get();
    const remainingNodes = nodes.filter((n) => n.id !== nodeId);
    const remainingEdges = edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
    set({ nodes: remainingNodes, edges: remainingEdges });
  },

  getIncomingEdges: (nodeId) => {
    const { edges, nodes } = get();
    return edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        return {
          edgeId: edge.id,
          sourceLabel: sourceNode ? sourceNode.data.label : "Unknown Node",
          sourceId: edge.source,
        };
      });
  },

  getWorkflowSnapshot: () => ({
    nodes: get().nodes,
    edges: get().edges,
    workflowId: get().workflowId,
    workflowName: get().workflowName,
  }),
}));

export default useWorkflowStore;
