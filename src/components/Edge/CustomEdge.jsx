import React from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
} from '@xyflow/react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // <--- Using Trash Icon
import useWorkflowStore from '../../store/useWorkflowStore';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected, // <--- React Flow passes this automatically!
}) {
    const deleteEdge = useWorkflowStore((state) => state.deleteEdge);

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt) => {
        evt.stopPropagation();
        deleteEdge(id);
    };

    return (
        <>
            {/* The Path itself. We thicken it slightly when selected for better visibility */}
            <BaseEdge 
                path={edgePath} 
                markerEnd={markerEnd} 
                style={{
                    ...style,
                    strokeWidth: selected ? 3 : 2, // Thicker when selected
                    stroke: selected ? '#2196F3' : '#555', // Blue when selected
                }} 
            />
            
            {/* ONLY render the button if the edge is selected */}
            {selected && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            fontSize: 12,
                            pointerEvents: 'all',
                            zIndex: 100
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={onEdgeClick}
                            sx={{
                                backgroundColor: '#fff', 
                                border: '1px solid #d32f2f', // Red border
                                color: '#d32f2f',           // Red icon
                                width: 24,
                                height: 24,
                                minHeight: 0, 
                                padding: 0,
                                boxShadow: 2,
                                '&:hover': {
                                    backgroundColor: '#d32f2f', // Solid red on hover
                                    color: '#fff'
                                }
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}