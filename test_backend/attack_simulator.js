const axios = require('axios');

const TARGET_URL = 'http://localhost:4000';

console.log("=========================================");
console.log("🛡️  OmniShield Attack Simulator Started 🛡️");
console.log("=========================================\n");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    try {
        // --- TEST 1: API Abuse / DDoS ---
        console.log("[Test 1/4] Simulating API Abuse (DDoS)...");
        console.log("Sending 1500 requests rapidly to /api/products...");
        
        let ddosPromises = [];
        for(let i = 0; i < 1500; i++) {
            // We ignore errors here in case the server crashes or rate limits
            ddosPromises.push(axios.get(`${TARGET_URL}/api/products`).catch(()=>{}));
        }
        await Promise.all(ddosPromises);
        console.log("✅ DDoS simulation complete.\n");

        await sleep(2000); // Pause between tests

        // --- TEST 2: Malware Indicators ---
        console.log("[Test 2/4] Simulating Malware Indicator (Malicious User-Agent)...");
        console.log("Sending request with User-Agent: sqlmap/1.5.2#dev...");
        
        await axios.get(`${TARGET_URL}/api/products`, {
            headers: { 'User-Agent': 'sqlmap/1.5.2#dev' }
        });
        console.log("✅ Malware simulation complete.\n");

        await sleep(2000);

        // --- TEST 3: Data Exfiltration ---
        console.log("[Test 3/4] Simulating Data Exfiltration...");
        console.log("Requesting massive database dump from /api/admin/db-export...");
        
        try {
            await axios.get(`${TARGET_URL}/api/admin/db-export`);
        } catch(e) {
            // Axios might struggle parsing 60MB into memory, we just care that the request was made
        }
        console.log("✅ Data Exfiltration simulation complete.\n");

        await sleep(2000);

        // --- TEST 4: Insider Threat ---
        console.log("[Test 4/4] Simulating Insider Threat...");
        console.log("Sending unauthorized DELETE request to /api/users/123...");
        
        await axios.delete(`${TARGET_URL}/api/users/123`);
        console.log("✅ Insider Threat simulation complete.\n");

        console.log("=========================================");
        console.log("🎉 All attack simulations sent! 🎉");
        console.log("Check your OmniShield backend dashboard to verify threat detection.");
        console.log("=========================================");
        
    } catch (error) {
        console.error("An error occurred during simulation:", error.message);
    }
}

runTests();
