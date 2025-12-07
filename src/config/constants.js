export const NODE_COLORS = {
    TRIGGER: '#4CAF50',    // Green
    CONTROLLER: '#FF9800', // Orange
    ACTIVITY: '#2196F3',   // Blue
    DEFAULT: '#2196F3'
};

export const LAYOUT_CONFIG = {
    NODE_WIDTH: 320,
    NODE_HEIGHT: 200,
    RANKSEP: 150, // Horizontal spacing
    NODESEP: 60   // Vertical spacing
};

export const HIDDEN_PARAMS = [
    'inputEdgeName', 
    'input_edge_name', 
    'trueEdgeOutput', 
    'falseEdgeOutput',
    // 'condition' 
];

// Special auto-wiring rules for specific activities
export const AUTO_WIRE_CONFIG = {
    'email_analysis_activity': 'input_edge_name'
};