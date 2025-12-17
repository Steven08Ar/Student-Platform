/**
 * Python Code Execution Server
 * 
 * Standalone Express server for executing Python 3.9 code
 * in isolated Docker containers.
 */

const express = require('express');
const cors = require('cors');
const executionRoutes = require('./routes/execution');

const app = express();
const PORT = process.env.EXECUTION_PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Parse JSON with size limit
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api', executionRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Python Execution Server',
        version: '1.0.0',
        endpoints: {
            execute: 'POST /api/execute',
            health: 'GET /api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   Python Execution Server                  ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`🐍 Running on port ${PORT}`);
    console.log(`🔒 Security: Docker sandboxing enabled`);
    console.log(`⏱️  Timeout: 5 seconds`);
    console.log(`💾 Memory limit: 128MB`);
    console.log(`⚡ CPU limit: 0.5 cores`);
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});
