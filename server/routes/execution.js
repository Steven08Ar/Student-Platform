/**
 * Code Execution API Routes
 */

const express = require('express');
const router = express.Router();
const pythonExecutor = require('../services/pythonExecutor');
const rateLimit = require('express-rate-limit');

// Rate limiting: 3 executions per minute per IP
const executionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    message: {
        success: false,
        error: 'Too many execution requests. Please wait before trying again.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * POST /api/execute
 * Execute Python 3.9 code
 * 
 * Request body:
 * {
 *   code: string,
 *   sessionId: string
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   stdout: string,
 *   stderr: string,
 *   exitCode: number,
 *   executionTime: number
 * }
 */
router.post('/execute', executionLimiter, async (req, res) => {
    try {
        const { code, sessionId } = req.body;

        // Validate request body
        if (!code) {
            return res.status(400).json({
                success: false,
                error: 'Code is required',
                stdout: '',
                stderr: 'Code is required',
                exitCode: -1,
                executionTime: 0
            });
        }

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Session ID is required',
                stdout: '',
                stderr: 'Session ID is required',
                exitCode: -1,
                executionTime: 0
            });
        }

        // Log execution attempt
        console.log(`[${sessionId}] Execution request received (${code.length} chars)`);

        // Execute code
        const result = await pythonExecutor.execute(code);

        // Log completion
        console.log(
            `[${sessionId}] Execution completed - Exit: ${result.exitCode}, Time: ${result.executionTime}ms`
        );

        res.json(result);

    } catch (error) {
        console.error('Execution error:', error);

        res.status(500).json({
            success: false,
            error: 'Internal server error',
            stdout: '',
            stderr: error.message || 'An unexpected error occurred',
            exitCode: -1,
            executionTime: 0
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
    try {
        // Check if Docker image exists
        const imageExists = await pythonExecutor.checkImage();

        res.json({
            status: 'ok',
            service: 'python-execution',
            dockerImage: imageExists ? 'available' : 'not found',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            service: 'python-execution',
            error: error.message
        });
    }
});

module.exports = router;
