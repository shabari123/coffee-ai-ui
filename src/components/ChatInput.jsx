import { useState } from "react";

function ChatInput({ onSend, loading }) {
    const [input, setInput] = useState("");
    const handleClick = () => {
        if (!input.trim()) {
            return;
        }

        onSend(input);
        setInput("");
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleClick();
        }
    };
    return (
        <div className="chat-input">
            <input
                disabled={loading}
                type="text"
                value={input}
                onKeyDown={handleKeyDown}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about coffee..."
            />

            <button disabled={loading} onClick={handleClick}>
                {loading ? "Thinking..." : "Send"}
            </button>
        </div>
    );
}

export default ChatInput;