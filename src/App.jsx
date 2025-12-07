import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import WorkflowEditor from './components/WorkflowEditor/WorkflowEditor'
import '@xyflow/react/dist/style.css';
function App() {

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <WorkflowEditor />
      </div>
    </ReactFlowProvider>
  )
}

export default App
