const axios = require('axios');

/**
 * OmniShield Telemetry Plugin
 * Intercepts incoming HTTP requests, extracts metadata, and forwards it to the OmniShield backend.
 */
function omnishieldPlugin(req, res, next) {
    const startTime = Date.now();

    // Hook into the response finish event to capture outgoing payload sizes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        // Extract relevant metadata for threat analysis
        const telemetryData = {
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.headers['user-agent'] || 'Unknown',
            endpoint: req.originalUrl,
            method: req.method,
            event_type: req.method === 'DELETE' ? 'STRUCTURAL_DELETE' : 'STANDARD_ACCESS',
            request_rate: 1, // Will be aggregated by backend
            payload_size: res.get('Content-Length') ? parseInt(res.get('Content-Length')) : 0, // Outgoing size
            timestamp: new Date().toISOString(),
            duration_ms: duration
        };

        // Forward telemetry to OmniShield asynchronously (non-blocking)
        const OMNISHIELD_API_URL = process.env.OMNISHIELD_API_URL || 'http://localhost:8000/api/external/v1/telemetry';
        const OMNISHIELD_API_KEY = process.env.OMNISHIELD_API_KEY;

        if (!OMNISHIELD_API_KEY) {
            console.warn('[OmniShield Plugin] WARNING: No API Key provided in environment!');
            return;
        }

        axios.post(OMNISHIELD_API_URL, telemetryData, {
            headers: {
                'X-API-Key': OMNISHIELD_API_KEY,
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            // Silently fail or log locally so we don't crash the host server if OmniShield is down
            console.error('[OmniShield Plugin] Failed to send telemetry data:', err.message);
        });
    });

    // Continue to the next middleware/route handler
    next();
}

module.exports = omnishieldPlugin;
