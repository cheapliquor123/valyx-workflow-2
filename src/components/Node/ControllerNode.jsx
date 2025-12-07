import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Typography } from "@mui/material";
import BaseNode from "./BaseNode";
import NodeParams from "./NodeParams";
import { NODE_COLORS } from "../../config/constants";

const handleStyle = {
  width: 14,
  height: 14,
  border: "3px solid white",
  zIndex: 10,
};

const ControllerNode = ({ id, data, isConnectable, selected }) => {
  return (
    <BaseNode
      id={id}
      label={data.label}
      selected={selected}
      color={NODE_COLORS.CONTROLLER}
      typeCaption={
        data.activityId ? data.activityId.replace(/_/g, " ") : "CONTROLLER"
      }
      minWidth={300} // Controllers are slightly wider
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ ...handleStyle, background: "#555", left: -9 }}
      />

      <NodeParams
        nodeId={id}
        params={data.params}
        schema={data.schema}
        isLoading={data.isLoading}
      />

      {/* Labels for True/False */}
      <Box
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#4CAF50", fontWeight: "bold", fontSize: "0.7rem" }}
        ></Typography>
        <Typography
          variant="caption"
          sx={{ color: "#F44336", fontWeight: "bold", fontSize: "0.7rem" }}
        ></Typography>
      </Box>

      {/* TRUE Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        isConnectable={isConnectable}
        style={{ ...handleStyle, background: "#4CAF50", right: -9, top: "40%" }}
      />

      {/* FALSE Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        isConnectable={isConnectable}
        style={{ ...handleStyle, background: "#F44336", right: -9, top: "75%" }}
      />
    </BaseNode>
  );
};

export default memo(ControllerNode);
