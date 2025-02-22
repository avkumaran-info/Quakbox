import React, { useState } from 'react';
import BroadcastStream from './BroadcastStream'; // Broadcasting component
import BroadcastWatch from './BroadcastWatch'; // Watching component

const bwatch = () => {
    const [mode, setMode] = useState('broadcast'); // 'broadcast' or 'watch'

    return (
        <div>
            <h1>Live Streaming</h1>
            <button onClick={() => setMode('broadcast')}>Start Broadcasting</button>
            <button onClick={() => setMode('watch')}>Watch Stream</button>

            {mode === 'broadcast' ? (
                <BroadcastStream />
            ) : (
                <BroadcastWatch />
            )}
        </div>
    );
};

export default bwatch;
