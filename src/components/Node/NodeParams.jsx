import React from "react";
import {
  Box,
  Typography,
  TextField,
  Skeleton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import useWorkflowStore from "../../store/useWorkflowStore";

const HIDDEN_PARAMS = [
  "inputEdgeName",
  "input_edge_name",
  "trueEdgeOutput",
  "falseEdgeOutput",
  "true_edge_output",
  "false_edge_output"
  
    // 'trueEdgeOutput', 
    // 'true_edge_output', 
    // 'trueEdge',
    
    // 'falseEdgeOutput', 
    // 'false_edge_output', 
    // 'falseEdge',
];

// Validation Utility
const getValidationError = (value, fieldDef) => {
  if (
    fieldDef.isRequired &&
    (value === undefined || value === null || value === "")
  ) {
    return "This field is required";
  }
  if (!value) return null;

  const isVariable = value.toString().startsWith("$");
  if (fieldDef.type === "url" && !isVariable) {
    try {
      new URL(value);
    } catch (_) {
      return "Invalid URL format";
    }
  }
  return null;
};

const NodeParams = ({ nodeId, params, schema = {}, isLoading }) => {
  const updateNodeParam = useWorkflowStore((state) => state.updateNodeParam);
  const getIncomingEdges = useWorkflowStore((state) => state.getIncomingEdges);

  const incomingEdges = nodeId ? getIncomingEdges(nodeId) : [];

  const handleChange = (key, newValue) => {
    updateNodeParam(nodeId, key, newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Skeleton variant="rectangular" height={30} />
        <Skeleton variant="rectangular" height={30} />
      </Box>
    );
  }

  if (!params || Object.keys(params).length === 0) {
    return (
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontStyle: "italic" }}
      >
        No parameters configured
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {Object.entries(params).map(([key, value]) => {
        if (HIDDEN_PARAMS.includes(key)) return null;

        const fieldDef = schema[key] || {};
        const isRequired = fieldDef.isRequired || false;
        const hint = fieldDef.hint || "";
        const apiType = fieldDef.type || "text";

        // Logic
        const isExplicitDropdown =
          fieldDef.allowedValues && Array.isArray(fieldDef.allowedValues);
        const isEdgeSelector =
          apiType === "edge_input" ||
          key.includes("input_edge_name") ||
          key.includes("inputEdgeName");

        // Value Display
        let displayValue =
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : value;
        if (displayValue === undefined || displayValue === null)
          displayValue = "";

        if (isExplicitDropdown && displayValue === "")
          displayValue = fieldDef.allowedValues[0] || "";
        if (isEdgeSelector && displayValue === "" && incomingEdges.length > 0)
          displayValue = incomingEdges[0].edgeId;

        // Validation
        const error = getValidationError(displayValue, fieldDef);
        const hasError = Boolean(error);

        const stopPropagation = (e) => {
          e.stopPropagation();
        };

        // EDGE SELECTOR RENDER
        if (isEdgeSelector) {
          return (
            <Box
              key={key}
              sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
            >
              <TextField
                select
                className="nodrag" 
                onMouseDown={stopPropagation} 
                error={hasError}
                helperText={
                  hasError
                    ? error
                    : incomingEdges.length === 0
                    ? "Connect a node to see options"
                    : hint
                }
                label={key.replace(/_/g, " ")}
                value={displayValue}
                onChange={(e) => handleChange(key, e.target.value)}
                required={isRequired}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                InputProps={{ style: { fontSize: "0.8rem" } }}
                disabled={incomingEdges.length === 0}
              >
                {incomingEdges.length === 0 ? (
                  <MenuItem value="" disabled>
                    No incoming connections
                  </MenuItem>
                ) : (
                  incomingEdges.map((edge) => (
                    <MenuItem
                      key={edge.edgeId}
                      value={edge.edgeId}
                      sx={{ fontSize: "0.8rem" }}
                    >
                      Connection from <b>&nbsp;{edge.sourceLabel}</b>
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Box>
          );
        }

        // STANDARD INPUT RENDER
        return (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
          >
            <TextField
              select={isExplicitDropdown}
              className="nodrag"
              onMouseDown={stopPropagation} 
              error={hasError}
              helperText={hasError ? error : null}
              label={key.replace(/_/g, " ")}
              value={displayValue}
              onChange={(e) => handleChange(key, e.target.value)}
              required={isRequired}
              placeholder={hint}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              InputProps={{ style: { fontSize: "0.8rem" } }}
            >
              {isExplicitDropdown
                ? fieldDef.allowedValues.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: "0.8rem" }}>
                      {opt}
                    </MenuItem>
                  ))
                : null}
            </TextField>

            {!isExplicitDropdown && hint && !hasError && (
              <Tooltip title={hint} placement="top">
                <InfoIcon
                  color="action"
                  sx={{ fontSize: 16, mt: 1, cursor: "help" }}
                />
              </Tooltip>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default NodeParams;
