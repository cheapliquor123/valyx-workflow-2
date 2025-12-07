// src/utils/sidebarUtils.js

/**
 * Initiates the drag operation for React Flow.
 * @param {Event} event - The drag event.
 * @param {string} nodeType - The type of React Flow node.
 * @param {string} activityName - The unique ID/name of the activity.
 */
// export const onDragStart = (event, nodeType, activityName) => {
//     event.dataTransfer.setData('application/reactflow', nodeType);
//     event.dataTransfer.setData('text/plain', activityName); 
//     event.dataTransfer.effectAllowed = 'move';
// };
export const onDragStart = (event, nodeType, activityName) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('text/plain', activityName); 
    event.dataTransfer.effectAllowed = 'move';
};

/**
 * Maps the backend category key to the corresponding React Flow node type.
 * @param {string} categoryKey - The key from CATEGORY_CONFIG (e.g., 'controllers').
 * @returns {string} The React Flow node type.
 */
// export const mapCategoryToNodeType = (categoryKey) => {
//     switch (categoryKey) {
//         case 'controllers':
//             return 'customControllerNode'; 
//         case 'triggers':
//             return 'input'; 
//         default:
//             return 'default';
//     }
// };
export const mapCategoryToNodeType = (categoryKey) => {
    switch (categoryKey) {
        case 'controllers':
            return 'controller'; // Maps to ControllerNode
        case 'triggers':
            return 'trigger';    // Maps to TriggerNode
        default:
            return 'activity';   // Maps to ActivityNode
    }
};