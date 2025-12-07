import { useState, useEffect } from "react";
import { fetchWorkflowById } from "../api/api";
import { transformWorkflowToReactFlow } from "../utils/flowTransformers";

const WORKFLOW_ID = "twflow_2ec5078699";
const useWorkflowData = () => {
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadWorkflow = async () => {
      try {
        // 1. Fetch raw JSON
        const rawData = await fetchWorkflowById(WORKFLOW_ID, controller.signal);

        // 2. Transform to React Flow format with Auto-Layout
        const { initialNodes, initialEdges } =
          transformWorkflowToReactFlow(rawData);

        setInitialNodes(initialNodes);
        setInitialEdges(initialEdges);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkflow();

    return () => controller.abort();
  }, []);

  return { initialNodes, initialEdges, loading, error };
};

export default useWorkflowData;
