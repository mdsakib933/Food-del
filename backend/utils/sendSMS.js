import axios from "axios";

/**
 * Sends SMS notification to the given phone number after payment completion.
 * Supports Twilio, Fast2SMS, or clean fallback logging.
 * 
 * @param {string} phone - Recipient phone/mobile number
 * @param {string} message - SMS message content
 */
export const sendSMS = async (phone, message) => {
    try {
        console.log("==========================================");
        console.log(`[SMS NOTIFICATION] Sending to: ${phone}`);
        console.log(`[SMS MESSAGE]: ${message}`);
        console.log("==========================================");

        // 1. Fast2SMS Integration (if API key present)
        if (process.env.FAST2SMS_API_KEY) {
            const response = await axios.post(
                "https://www.fast2sms.com/dev/bulkV2",
                {
                    route: "q",
                    message: message,
                    language: "english",
                    flash: 0,
                    numbers: phone
                },
                {
                    headers: {
                        authorization: process.env.FAST2SMS_API_KEY
                    }
                }
            );
            console.log("[Fast2SMS Response]:", response.data);
            return { success: true, provider: "Fast2SMS", data: response.data };
        }

        // 2. Twilio Integration (if credentials present)
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

            const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
            const params = new URLSearchParams();
            params.append("To", phone.startsWith("+") ? phone : `+91${phone}`);
            params.append("From", twilioPhone);
            params.append("Body", message);

            const response = await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                params.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: authHeader
                    }
                }
            );
            console.log("[Twilio Response]:", response.data);
            return { success: true, provider: "Twilio", data: response.data };
        }

        // 3. Fallback Logged Output (Simulated SMS)
        return { success: true, provider: "SimulatedConsole", message: "SMS dispatched to console logger" };
    } catch (error) {
        console.error("[SMS ERROR]: Failed to send SMS:", error?.response?.data || error.message);
        // Return success object so payment processing does not fail if SMS provider is down
        return { success: false, error: error.message };
    }
};
