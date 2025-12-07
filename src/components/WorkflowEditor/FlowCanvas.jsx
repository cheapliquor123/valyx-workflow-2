import { useCallback } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShallow } from "zustand/react/shallow";

import useWorkflowStore from "../../store/useWorkflowStore";
import { fetchNodeDetails } from "../../api/api";
import CustomEdge from "../Edge/CustomEdge";

const edgeTypes = {
  buttonedge: CustomEdge,
};

const FlowCanvas = ({ nodeTypes }) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    addNode,
    updateNodeData,
  } = useWorkflowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      onNodesDelete: state.onNodesDelete,
      addNode: state.addNode,
      updateNodeData: state.updateNodeData,
    }))
  );

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      const activityName = event.dataTransfer.getData("text/plain");

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let flowType = "activity";
      let apiNodeType = "Activity";

      if (type === "trigger") {
        flowType = "trigger";
        apiNodeType = "Trigger";
      } else if (type === "controller") {
        flowType = "controller";
        apiNodeType = "Controller";
      }

      // Generate clean ID
      const slug = activityName.toLowerCase().replace(/_/g, "-");
      let baseId = `${slug}-node`;
      let finalId = baseId;
      let counter = 1;
      while (nodes.some((n) => n.id === finalId)) {
        finalId = `${baseId}-${counter}`;
        counter++;
      }

      const newNode = {
        id: finalId,
        type: flowType,
        position,
        data: {
          label: "",
          activityId: activityName,
          nodeType: apiNodeType,
          params: {},
          schema: {},
          isLoading: true,
        },
      };

      addNode(newNode);

      try {
        const details = await fetchNodeDetails(activityName);
        const schema = details && details.params ? details.params : {};
        const initialParams = {};
        Object.keys(schema).forEach((key) => {
          initialParams[key] = "";
        });

        updateNodeData(finalId, {
          params: initialParams,
          schema: schema,
          isLoading: false,
        });
      } catch (err) {
        console.error("Failed to populate node:", err);
        updateNodeData(finalId, { isLoading: false });
      }
    },
    [screenToFlowPosition, addNode, updateNodeData, nodes]
  );

  return (
    <div style={{ flexGrow: 1, height: "100%", backgroundColor: "#F5F5F5" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
