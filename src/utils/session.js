export function getSessionId() {
    console.log("getSessionId called");

    let sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        console.log("Generated:", sessionId);
        localStorage.setItem("session_id", sessionId);
    }

    return sessionId;
}