/**
 * Python Executor Service
 * 
 * Executes Python 3.9 code in isolated Docker containers
 * with strict security controls and resource limits.
 */

const Docker = require('dockerode');
const docker = new Docker();

class PythonExecutor {
    constructor() {
        this.IMAGE_NAME = 'python-sandbox:3.9';
        this.TIMEOUT_MS = 5000; // 5 seconds
        this.MAX_CODE_LENGTH = 10000; // 10KB

        // Blacklist of dangerous operations
        this.BLACKLIST = [
            'import os',
            'import subprocess',
            'import socket',
            'import requests',
            'import urllib',
            'eval(',
            'exec(',
            '__import__',
            'open(',
            'compile(',
            'input(',
            'raw_input('
        ];
    }

    /**
     * Validate code before execution
     */
    validateCode(code) {
        // Check if code is provided
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid code input');
        }

        // Check length
        if (code.length > this.MAX_CODE_LENGTH) {
            throw new Error(`Code too long. Maximum ${this.MAX_CODE_LENGTH} characters allowed.`);
        }

        // Check if code is empty
        if (code.trim().length === 0) {
            throw new Error('Code cannot be empty');
        }

        // Check blacklist
        const lowerCode = code.toLowerCase();
        for (const forbidden of this.BLACKLIST) {
            if (lowerCode.includes(forbidden.toLowerCase())) {
                throw new Error(`Forbidden operation: ${forbidden.trim()}`);
            }
        }

        return true;
    }

    /**
     * Execute Python code in isolated Docker container
     */
    async execute(code) {
        const startTime = Date.now();
        let container = null;

        try {
            // Validate input
            this.validateCode(code);

            // Create container with strict security settings
            container = await docker.createContainer({
                Image: this.IMAGE_NAME,
                Cmd: ['python3', '-c', code],
                HostConfig: {
                    // Resource limits
                    Memory: 128 * 1024 * 1024, // 128MB RAM
                    MemorySwap: 128 * 1024 * 1024, // No swap
                    NanoCpus: 500000000, // 0.5 CPU cores

                    // Security settings
                    NetworkMode: 'none', // No network access
                    ReadonlyRootfs: true, // Read-only filesystem
                    Tmpfs: { '/tmp': 'rw,noexec,nosuid,size=10m' }, // 10MB writable temp

                    // Prevent privilege escalation
                    CapDrop: ['ALL'], // Drop all capabilities
                    SecurityOpt: ['no-new-privileges'] // Prevent setuid
                },
                AttachStdout: true,
                AttachStderr: true,
                Tty: false
            });

            // Start container
            await container.start();

            // Enforce timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Execution timeout (5 seconds exceeded)'));
                }, this.TIMEOUT_MS);
            });

            // Wait for completion or timeout
            let waitResult;
            try {
                waitResult = await Promise.race([
                    container.wait(),
                    timeoutPromise
                ]);
            } catch (timeoutError) {
                // Kill container on timeout
                try {
                    await container.kill();
                } catch (killError) {
                    console.error('Error killing container:', killError);
                }
                throw timeoutError;
            }

            // Get container logs
            const logsStream = await container.logs({
                stdout: true,
                stderr: true,
                timestamps: false
            });

            // Calculate execution time
            const executionTime = Date.now() - startTime;

            // Parse output
            const { stdout, stderr } = this.parseLogs(logsStream.toString('utf8'));

            // Cleanup container
            await container.remove({ force: true });

            return {
                success: waitResult.StatusCode === 0,
                stdout: stdout || '',
                stderr: stderr || '',
                exitCode: waitResult.StatusCode,
                executionTime
            };

        } catch (error) {
            const executionTime = Date.now() - startTime;

            // Cleanup container if it exists
            if (container) {
                try {
                    await container.remove({ force: true });
                } catch (cleanupError) {
                    console.error('Error cleaning up container:', cleanupError);
                }
            }

            return {
                success: false,
                stdout: '',
                stderr: error.message,
                exitCode: -1,
                executionTime
            };
        }
    }

    /**
     * Parse Docker container logs
     * Docker multiplexes stdout/stderr with 8-byte headers
     */
    parseLogs(logs) {
        const stdout = [];
        const stderr = [];

        let offset = 0;
        const buffer = Buffer.from(logs);

        while (offset < buffer.length) {
            // Docker log format: [stream_type][0][0][0][size_bytes]
            if (offset + 8 > buffer.length) break;

            const streamType = buffer[offset]; // 1=stdout, 2=stderr
            const size = buffer.readUInt32BE(offset + 4);

            if (offset + 8 + size > buffer.length) break;

            const content = buffer.slice(offset + 8, offset + 8 + size).toString('utf8');

            if (streamType === 1) {
                stdout.push(content);
            } else if (streamType === 2) {
                stderr.push(content);
            }

            offset += 8 + size;
        }

        return {
            stdout: stdout.join(''),
            stderr: stderr.join('')
        };
    }

    /**
     * Check if Docker image exists
     */
    async checkImage() {
        try {
            await docker.getImage(this.IMAGE_NAME).inspect();
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new PythonExecutor();
