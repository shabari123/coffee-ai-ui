import { getSessionId } from "../utils/session";

const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(message) {
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            session_id: getSessionId(),
            message: message,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return await response.json();
}