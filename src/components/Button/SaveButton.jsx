import React, { useState } from "react";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import useWorkflowStore from "../../store/useWorkflowStore";
import { updateWorkflow } from "../../api/api";
import { transformReactFlowToWorkflow } from "../../utils/flowTransformers";

const SIMULATE_ONLY = false;

const SaveButton = () => {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Selectors
  const getWorkflowSnapshot = useWorkflowStore(
    (state) => state.getWorkflowSnapshot
  );
  const savedState = useWorkflowStore((state) => state.savedState);
  const setSavedState = useWorkflowStore((state) => state.setSavedState);

  const handleSave = async () => {
    try {
      const { nodes, edges, workflowId, workflowName } = getWorkflowSnapshot();

      if (!workflowId) {
        throw new Error("Critical Error: Workflow ID is missing.");
      }

      // 1. Generate Current Payload
      const payloadObject = transformReactFlowToWorkflow(nodes, edges, {
        name: workflowName,
      });
      const payloadString = JSON.stringify(payloadObject);

      // 2. DIRTY CHECK: Compare with last saved state
      if (savedState && payloadString === savedState) {
        setToast({
          open: true,
          severity: "info",
          message: "No changes to save.",
        });
        return; // Stop execution here
      }

      setSaving(true);

      // 3. API CALL
      if (SIMULATE_ONLY) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Simulation Save:", payloadObject);
        // Update baseline for next click
        setSavedState(payloadString);
        setToast({
          open: true,
          severity: "success",
          message: "Simulation: Saved!",
        });
      } else {
        const response = await updateWorkflow(workflowId, payloadObject);
        console.log("Server Response:", response);

        // Update baseline for next click
        setSavedState(payloadString);

        const successMsg = response.message || "Workflow saved successfully!";
        setToast({ open: true, severity: "success", message: successMsg });
      }
    } catch (error) {
      console.error("Save Failed:", error);
      setToast({
        open: true,
        severity: "error",
        message: `Save Failed: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={
          saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
        }
        onClick={handleSave}
        disabled={saving}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1000,
          boxShadow: 3,
          fontWeight: "bold",
        }}
      >
        {saving ? "Saving..." : "Save Workflow"}
      </Button>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SaveButton;
