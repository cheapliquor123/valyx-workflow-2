import { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Drawer,
  List,
} from "@mui/material";

import { fetchNodeData } from "../../api/api";
import useSidebarData from "../../hooks/useSidebarData";
import { mapCategoryToNodeType } from "../../utils/sidebarUtils";
import SidebarCategory from "./SidebarCategory";

const CATEGORY_CONFIG = [
  { key: "triggers", color: "#4CAF50" },
  { key: "controllers", color: "#FF9800" },
  { key: "activities", color: "#2196F3" },
];

const SIDEBAR_WIDTH = 340;

const SideBar = () => {
  const { sidebarData, loading, error } = useSidebarData(fetchNodeData);

  // --- CHANGED: Set 'activities' to false by default ---
  const [openSections, setOpenSections] = useState({
    triggers: false,
    controllers: false,
    activities: false, 
  });

  const handleToggle = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const renderContent = () => {
    if (loading)
      return (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    if (error)
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Box>
      );
    if (!sidebarData) return null;

    return (
      <List component="nav" disablePadding>
        {CATEGORY_CONFIG.map((config) => {
          const categoryKey = config.key;
          const categoryData = sidebarData[categoryKey];

          if (!categoryData || !categoryData.items) return null;

          return (
            <SidebarCategory
              key={categoryKey}
              categoryKey={categoryKey}
              categoryTitle={
                categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)
              }
              categoryColor={config.color}
              nodeType={mapCategoryToNodeType(categoryKey)}
              items={categoryData.items}
              isOpen={openSections[categoryKey]}
              onToggle={handleToggle}
            />
          );
        })}
      </List>
    );
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Workflow Actions
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>{renderContent()}</Box>
    </Drawer>
  );
};

export default SideBar;
