/**
 * Yjs WebSocket Server for Real-Time Collaboration
 * 
 * This server handles:
 * 1. WebSocket connections from clients
 * 2. Yjs document synchronization
 * 3. Awareness (cursor presence)
 * 4. Room management
 * 
 * Run with: node yjsServer.js
 */

const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const PORT = process.env.YJS_PORT || 1234;

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Yjs WebSocket Server Running\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Track active rooms and connections
const rooms = new Map();

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    // Extract room name from URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const roomName = url.pathname.slice(1); // Remove leading '/'

    // Get user info from query params
    const params = url.searchParams;
    const userId = params.get('userId');
    const userName = params.get('userName');
    const userColor = params.get('userColor');

    console.log(`User ${userName} (${userId}) joined room: ${roomName}`);

    // Track room
    if (!rooms.has(roomName)) {
        rooms.set(roomName, new Set());
    }
    rooms.get(roomName).add(ws);

    // Setup Yjs WebSocket connection
    setupWSConnection(ws, req, {
        // Optional: Add persistence here
        // This would save/load documents from a database
        gc: true // Enable garbage collection
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log(`User ${userName} left room: ${roomName}`);
        const room = rooms.get(roomName);
        if (room) {
            room.delete(ws);
            if (room.size === 0) {
                rooms.delete(roomName);
                console.log(`Room ${roomName} is now empty`);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Yjs WebSocket Server running on ws://localhost:${PORT}`);
    console.log(`📡 Ready to accept connections`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    wss.close(() => {
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
});
