import { memo } from "react";
import {
  Card,
  CardContent,
  Box,
  IconButton,
  InputBase,
  Typography,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useWorkflowStore from "../../store/useWorkflowStore";
import { NODE_COLORS } from "../../config/constants"; // Ensure you have this file created as per previous step

/**
 * A Reusable Node Wrapper.
 * Handles: Selection styles, Delete logic, Editable Title, Header Color.
 */
const BaseNode = ({
  id,
  label,
  selected,
  color = NODE_COLORS.DEFAULT, // Default blue
  typeCaption = "NODE",
  children,
  minWidth = 280,
}) => {
  // Access store actions via hooks inside the component to avoid prop drilling
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleNameChange = (e) => {
    updateNodeData(id, { label: e.target.value });
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent selecting the node while deleting
    deleteNode(id);
  };

  return (
    <Card
      sx={{
        minWidth: minWidth,
        border: selected ? `2px solid ${color}` : "1px solid #e0e0e0",
        boxShadow: selected ? 4 : 1,
        borderRadius: 2,
        position: "relative",
        overflow: "visible", // Critical for handles
        "&:hover .delete-btn": { opacity: 1 },
      }}
    >
      {/* Delete Button (Visible on Hover) */}
      <IconButton
        className="delete-btn"
        size="small"
        onClick={handleDelete}
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          color: "#fff",
          opacity: 0,
          transition: "opacity 0.2s",
          zIndex: 20,
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      {/* Editable Header */}
      <Box
        sx={{
          backgroundColor: color,
          p: 1.5,
          pr: 4,
          color: "#fff",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
      >
        <InputBase
          value={label}
          onChange={handleNameChange}
          fullWidth
          placeholder="Node Name"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.875rem",
            "& .MuiInputBase-input": { padding: 0, textOverflow: "ellipsis" },
          }}
          onMouseDown={(e) => e.stopPropagation()} // Enable text selection
        />
      </Box>

      {/* Content Body */}
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            color: "#888",
            fontWeight: "bold",
            fontSize: "0.65rem",
          }}
        >
          {typeCaption}
        </Typography>
        <Divider sx={{ my: 1 }} />

        {/* Render Specific Node Content (Params, etc.) */}
        {children}
      </CardContent>
    </Card>
  );
};

export default memo(BaseNode);
