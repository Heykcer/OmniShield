const axios = require('axios');

const PHISHING_API_URL = 'http://localhost:8001/scan';

console.log("=========================================");
console.log("🎣  OmniShield Phishing Simulator Started 🎣");
console.log("=========================================\n");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPhishingTests() {
    try {
        // --- TEST 1: Legitimate URL ---
        console.log("[Test 1/3] Testing Legitimate URL...");
        console.log("Scanning: https://www.google.com");
        
        try {
            const res1 = await axios.post(PHISHING_API_URL, {
                url: "https://www.google.com",
                model: "xgboost"
            });
            console.log(`✅ Result: ${res1.data.is_phishing ? 'PHISHING DETECTED' : 'SAFE'}`);
            console.log(`📊 Risk Score: ${(res1.data.risk_score * 100).toFixed(2)}%`);
        } catch (e) {
            console.error("❌ Failed to connect to Phishing Service. Is it running on port 8001?");
        }
        console.log("-----------------------------------------");
        await sleep(2000);

        // --- TEST 2: Typical Phishing URL (IP Address instead of Domain) ---
        console.log("[Test 2/3] Testing IP-based Phishing URL...");
        console.log("Scanning: http://192.168.1.100/secure/login.php");
        
        try {
            const res2 = await axios.post(PHISHING_API_URL, {
                url: "http://192.168.1.100/secure/login.php",
                model: "xgboost"
            });
            console.log(`✅ Result: ${res2.data.is_phishing ? 'PHISHING DETECTED' : 'SAFE'}`);
            console.log(`📊 Risk Score: ${(res2.data.risk_score * 100).toFixed(2)}%`);
            console.log(`🤖 Explainable AI Output: \n${res2.data.explanation}`);
        } catch (e) {
            console.error("❌ Failed to connect to Phishing Service.");
        }
        console.log("-----------------------------------------");
        await sleep(2000);

        // --- TEST 3: Advanced Phishing (At Symbol, Hyphens, long URL) ---
        console.log("[Test 3/3] Testing Advanced Phishing URL...");
        console.log("Scanning: https://secure-login-update-account@www.pay-pal-security-check-online.com/auth/verify?session=9823487234098234098234");
        
        try {
            const res3 = await axios.post(PHISHING_API_URL, {
                url: "https://secure-login-update-account@www.pay-pal-security-check-online.com/auth/verify?session=9823487234098234098234",
                model: "xgboost"
            });
            console.log(`✅ Result: ${res3.data.is_phishing ? 'PHISHING DETECTED' : 'SAFE'}`);
            console.log(`📊 Risk Score: ${(res3.data.risk_score * 100).toFixed(2)}%`);
            console.log(`🤖 Explainable AI Output: \n${res3.data.explanation}`);
        } catch (e) {
            console.error("❌ Failed to connect to Phishing Service.");
        }
        console.log("-----------------------------------------");

        console.log("\n=========================================");
        console.log("🎉 Phishing Simulations Complete! 🎉");
        console.log("=========================================");
        
    } catch (error) {
        console.error("An error occurred during simulation:", error.message);
    }
}

runPhishingTests();
