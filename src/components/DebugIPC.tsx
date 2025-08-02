import React from 'react';

const DebugIPC: React.FC = () => {
    const testIPC = () => {
        if (window.ipcRenderer) {
            console.log("✅ IPC Renderer is available");
            window.ipcRenderer.send("test-message");
        } else {
            console.log("❌ IPC Renderer is NOT available");
        }
    };

    // Only show in development
    if (import.meta.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 10,
            right: 10,
            zIndex: 9999,
            background: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px'
        }}>
            <button onClick={testIPC} style={{
                background: 'darkred',
                color: 'white',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
            }}>
                Test IPC
            </button>
        </div>
    );
};

export default DebugIPC;
