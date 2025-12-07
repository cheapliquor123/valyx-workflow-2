import React, { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useWorkflowData from '../../hooks/useWorkflowData';
import useWorkflowStore from '../../store/useWorkflowStore';
import { transformReactFlowToWorkflow } from '../../utils/flowTransformers'; 
import SideBar from '../SideBar/SideBar'; 
import FlowCanvas from './FlowCanvas'; 
import SaveButton from '../Button/SaveButton'; 
import WorkflowSkeleton from '../UI/WorkflowSkeleton'; 

import TriggerNode from '../Node/TriggerNode';
import ControllerNode from '../Node/ControllerNode';
import ActivityNode from '../Node/ActivityNode';

const nodeTypes = {
    trigger: TriggerNode,
    controller: ControllerNode,
    activity: ActivityNode,
    default: ActivityNode,
};

const WorkflowEditor = () => {
    const { initialNodes, initialEdges, loading, error, workflowId } = useWorkflowData();
    
    const setWorkflow = useWorkflowStore((state) => state.setWorkflow);
    const setSavedState = useWorkflowStore((state) => state.setSavedState); 
    useEffect(() => {
        if (!loading && initialNodes && initialNodes.length > 0) {
            const id = workflowId || "twflow_2ec5078699";
            const name = "My Workflow";

            // 1. Initialize State
            setWorkflow(initialNodes, initialEdges, id, name);

            // 2. CALCULATE BASELINE SNAPSHOT
            // This ensures the button knows the "starting point" of the data
            const initialPayload = transformReactFlowToWorkflow(initialNodes, initialEdges, { name });
            setSavedState(JSON.stringify(initialPayload));
        }
    }, [loading, initialNodes, initialEdges, setWorkflow, setSavedState, workflowId]);

    if (loading) return <WorkflowSkeleton />;

    if (error) {
        return (
            <div style={{ padding: 40, color: '#d32f2f', textAlign: 'center' }}>
                <h2>Error Loading Workflow</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            <ReactFlowProvider>
                <SideBar />
                <div style={{ position: 'relative', flexGrow: 1, height: '100%' }}>
                    <SaveButton />
                    <FlowCanvas nodeTypes={nodeTypes} />
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default WorkflowEditor;