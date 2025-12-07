import {
  List,
  Collapse,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SidebarNodeItem from "./SidebarNodeItem";
import { onDragStart } from "../../utils/sidebarUtils";

const SidebarCategory = ({
  categoryKey,
  categoryTitle,
  categoryColor,
  nodeType,
  items,
  isOpen,
  onToggle,
}) => {
  return (
    <div key={categoryKey}>
      {/* Clickable Header */}
      <ListItemButton
        onClick={() => onToggle(categoryKey)}
        sx={{
          pt: 1.5,
          pb: 1.5,
          pl: 2,
          pr: 1,
          mt: 1,
          borderLeft: `4px solid ${categoryColor}`,
          bgcolor: "#f9f9f9",
          "&:hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ListItemText
          primary={categoryTitle}
          primaryTypographyProps={{
            variant: "subtitle2",
            fontWeight: "bold",
            color: "#333",
          }}
        />
        {isOpen ? (
          <ExpandLess sx={{ color: "action.active" }} />
        ) : (
          <ExpandMore sx={{ color: "action.active" }} />
        )}
      </ListItemButton>

      <Divider />

      {/* Collapsible Content */}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ p: 1 }}>
          {items.map((activityName) => (
            <SidebarNodeItem
              key={activityName}
              activityName={activityName}
              nodeType={nodeType}
              categoryColor={categoryColor}
              onDragStart={(event) =>
                onDragStart(event, nodeType, activityName)
              }
            />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default SidebarCategory;
