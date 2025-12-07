import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import BaseNode from "./BaseNode";
import NodeParams from "./NodeParams";
import { NODE_COLORS } from "../../config/constants";

const handleStyle = {
  width: 14,
  height: 14,
  background: "#555",
  border: "3px solid white",
  zIndex: 10,
};

const ActivityNode = ({ id, data, isConnectable, selected }) => {
  return (
    <BaseNode
      id={id}
      label={data.label}
      selected={selected}
      color={NODE_COLORS.ACTIVITY}
      typeCaption={
        data.activityId ? data.activityId.replace(/_/g, " ") : "ACTIVITY"
      }
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ ...handleStyle, left: -9 }}
      />

      <NodeParams
        nodeId={id}
        params={data.params}
        schema={data.schema}
        isLoading={data.isLoading}
      />

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ ...handleStyle, right: -9 }}
      />
    </BaseNode>
  );
};

export default memo(ActivityNode);
