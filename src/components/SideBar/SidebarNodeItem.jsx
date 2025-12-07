import { ListItem, ListItemText, Paper, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const SidebarNodeItem = ({ activityName, categoryColor, onDragStart }) => {
  return (
    <ListItem sx={{ p: 0.5 }}>
      <Paper
        elevation={1}
        draggable
        onDragStart={onDragStart}
        sx={{
          width: "100%",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          cursor: "grab",
          borderLeft: `3px solid ${categoryColor}`,
          "&:hover": {
            backgroundColor: "#fafafa",
            boxShadow: 2,
          },
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <DragIndicatorIcon sx={{ color: "#ccc", mr: 1, fontSize: 20 }} />
        <ListItemText
          primary={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {activityName.replace(/_/g, " ")}
            </Typography>
          }
        />
      </Paper>
    </ListItem>
  );
};

export default SidebarNodeItem;
