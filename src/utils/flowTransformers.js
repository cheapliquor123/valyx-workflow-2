import dagre from "dagre";
import { LAYOUT_CONFIG, AUTO_WIRE_CONFIG } from "../config/constants";

const { NODE_WIDTH, NODE_HEIGHT, RANKSEP, NODESEP } = LAYOUT_CONFIG;

/**
 * Maps API Node Type to our specific Custom Component Keys
 */
const getReactFlowNodeType = (apiNodeType) => {
  const type = apiNodeType ? apiNodeType.toLowerCase() : "activity";
  if (type.includes("trigger")) return "trigger";
  if (type.includes("controller")) return "controller";
  return "activity";
};

/**
 * Calculates node positions using Dagre (Horizontal LR)
 */
const calculateDagreLayout = (nodesMap, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", ranksep: RANKSEP, nodesep: NODESEP });
  g.setDefaultEdgeLabel(() => ({}));

  Object.values(nodesMap).forEach((node) => {
    g.setNode(node.nodeId, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.fromNodeId, edge.toNodeId);
  });

  dagre.layout(g);

  const layout = {};
  g.nodes().forEach((nodeId) => {
    const node = g.node(nodeId);
    layout[nodeId] = {
      x: node.x - NODE_WIDTH / 2,
      y: node.y - NODE_HEIGHT / 2,
    };
  });

  return layout;
};

// --- TRANSFORMER (API -> REACT FLOW) ---
export const transformWorkflowToReactFlow = (apiResponse) => {
  if (!apiResponse || !apiResponse.definition) {
    return { initialNodes: [], initialEdges: [] };
  }

  const { nodes: apiNodesMap, edges: apiEdges } = apiResponse.definition;
  const layoutPositions = calculateDagreLayout(apiNodesMap, apiEdges);

  const initialNodes = Object.values(apiNodesMap).map((node) => ({
    id: node.nodeId,
    type: getReactFlowNodeType(node.nodeType),
    position: layoutPositions[node.nodeId] || { x: 0, y: 0 },
    data: {
      label: node.nodeName || node.activityName,
      activityId: node.activityName,
      nodeType: node.nodeType,
      params: node.nodeParams?.params || (node.params ? node.params : {}),
    },
  }));

  const initialEdges = apiEdges.map((edge) => ({
    id: edge.edgeName || edge.edgeId || `${edge.fromNodeId}-${edge.toNodeId}`,
    source: edge.fromNodeId,
    target: edge.toNodeId,
    type: "buttonedge",
    animated: false,
    style: { stroke: "#555", strokeWidth: 2 },
  }));

  return { initialNodes, initialEdges };
};

// --- REVERSE TRANSFORMER (REACT FLOW -> API) ---
export const transformReactFlowToWorkflow = (nodes, edges, workflowMeta) => {
  const apiNodes = {};

  nodes.forEach((node) => {
    // --- Auto-Wiring Logic ---
    const finalParams = { ...(node.data.params || {}) };
    const incomingEdge = edges.find((e) => e.target === node.id);

    // 1. Wire Incoming Inputs
    if (incomingEdge) {
      // Standard wiring
      if (finalParams.hasOwnProperty("inputEdgeName"))
        finalParams.inputEdgeName = incomingEdge.id;
      if (finalParams.hasOwnProperty("input_edge_name"))
        finalParams.input_edge_name = incomingEdge.id;

      // Special wiring based on Config
      const specificKey = AUTO_WIRE_CONFIG[node.data.activityId];
      if (specificKey) {
        finalParams[specificKey] = incomingEdge.id;
      }
    }

    // 2. Wire Controller Outputs
    if (node.data.nodeType === "Controller" || node.type === "controller") {
      const outgoingEdges = edges.filter((e) => e.source === node.id);

      const trueEdge = outgoingEdges.find((e) => e.sourceHandle === "true");
      if (trueEdge) finalParams.trueEdgeOutput = trueEdge.id;

      const falseEdge = outgoingEdges.find((e) => e.sourceHandle === "false");
      if (falseEdge) finalParams.falseEdgeOutput = falseEdge.id;

      if (incomingEdge) finalParams.inputEdgeName = incomingEdge.id;
    }

    apiNodes[node.id] = {
      nodeId: node.id,
      nodeType: node.data.nodeType || "Activity",
      nodeName: node.data.label,
      activityName: node.data.activityId,
      nodeParams: { params: finalParams },
    };
  });

  const apiEdges = edges.map((edge) => ({
    edgeId: edge.id,
    fromNodeId: edge.source,
    toNodeId: edge.target,
    edgeName: edge.id,
  }));

  return {
    workflowName: workflowMeta.name || "Updated Workflow",
    nodes: apiNodes,
    edges: apiEdges,
  };
};
