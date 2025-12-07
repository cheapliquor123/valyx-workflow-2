const API_ENDPOINT = 'https://rubik.valyx.com/';

/**
 * Fetches the workflow node data from the API endpoint.
 * @param {AbortSignal} signal - Signal to cancel the fetch request.
 * @returns {Promise<Object | null>} The activity, controller, and trigger data.
 */
export async function fetchNodeData(signal) {
    try {
        const response = await fetch(`${API_ENDPOINT}nodes`, { signal }); // <--- Pass the signal here
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data; 
        
    } catch (error) {
        // Check if the error is due to the request being aborted
        if (error.name === 'AbortError') {
            console.log('Fetch aborted by Strict Mode cleanup.');
            return null; // Return null if aborted, preventing state update
        }

        console.error("Error fetching node data:", error);
        return null;
    }
}

export async function fetchWorkflowById(workflowId, signal) {
    try {
        const response = await fetch(`${API_ENDPOINT}workflows/${workflowId}`, { signal });
        if (!response.ok) throw new Error("Failed to fetch workflow");
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') return null;
        throw error;
    }
}

/**
 * Fetches the detailed schema for a specific node (activity/trigger/controller).
 * @param {string} nodeName - The system name of the node (e.g., 'payment_advice_parsing_activity')
 */
export async function fetchNodeDetails(nodeName) {
    try {
        const response = await fetch(`${API_ENDPOINT}nodeDetails/${nodeName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch node details: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching node details:", error);
        return null; 
    }
}

/**
 * Updates an existing workflow.
 * @param {string} workflowId 
 * @param {object} payload - The transformed workflow object
 */
export async function updateWorkflow(workflowId, payload) {
    try {
        const response = await fetch(`${API_ENDPOINT}workflow/update/${workflowId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Save failed: ${errorBody || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error saving workflow:", error);
        throw error;
    }
}