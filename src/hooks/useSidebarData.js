import { useState, useEffect } from 'react';
// Ensure the import path is correct for your project structure
// Example: import { fetchNodeData } from '../../api/api'; 
import { fetchNodeData } from '../api/api';

const useSidebarData = (fetchNodeData) => { // Accept the fetch function as a prop/argument
    const [sidebarData, setSidebarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const loadData = async () => {
            setLoading(true); // Ensure loading is set back to true on effect run
            setError(null);

            try {
                // *** CORRECTLY calling your provided fetchNodeData ***
                const data = await fetchNodeData(signal); 
                
                if (data) { 
                    setSidebarData(data);
                }
            } catch (err) {
                // Your fetchNodeData already handles AbortError internally, 
                // but we keep a check here just in case, or for other sync errors.
                if (err.name !== 'AbortError') {
                    setError(err.message || "An unknown error occurred during data processing.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            // This is the cleanup function that calls the controller.abort()
            controller.abort();
        };
    }, [fetchNodeData]); // Dependency array includes the fetch function

    return { sidebarData, loading, error };
};

export default useSidebarData;