import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import ChatInput from "./components/ChatInput";
import { sendMessage } from "./services/api";

import "./styles/App.css";

function App() {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef(null);

	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({
				behavior: "smooth"
			});
		}
	}, [messages]);

	async function handleSend(message) {
		setLoading(true);

		setMessages((previousMessages) => [
			...previousMessages,
			{
				sender: "User",
				text: message,
				products: []
			},
			{
				sender: "AI",
				text: "",
				products: [],
				typing: true
			},
		]);

		try {
			const response = await sendMessage(message);

			setMessages((previousMessages) => {
				const updatedMessages = [...previousMessages];

				updatedMessages[updatedMessages.length - 1] = {
					sender: "AI",
					text: response.response,
					products: response.products,
					typing: false
				};

				return updatedMessages;
			});

		} catch (error) {
			console.error(error);

			setMessages((previousMessages) => {
				const updatedMessages = [...previousMessages];

				updatedMessages[updatedMessages.length - 1] = {
					sender: "AI",
					text: "Sorry, something went wrong.",
					products: [],
					typing: false
				};

				return updatedMessages;
			});

		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="chat-container">
			<Header />
				<div className="messages">

					{messages.length === 0 && (
						<div className="welcome-screen">

							<div className="welcome-icon">
								☕
							</div>

							<h1>Welcome to Swasthya Coffee</h1>

							<p>
								Ask me anything about our coffee.
							</p>

							<div className="suggestion-container">

								<button
									className="suggestion-button"
									onClick={() => handleSend("Recommend me a strong coffee")}
								>
									Recommend a strong coffee
								</button>

								<button
									className="suggestion-button"
									onClick={() => handleSend("Show me the available products")}
								>
									Show me the available products
								</button>

								<button
									className="suggestion-button"
									onClick={() => handleSend("Which coffee is good for filter coffee?")}
								>
									Which coffee is good for filter coffee?
								</button>

							</div>

						</div>
					)}

					{messages.map((message, index) => (
						message.typing ? (
							<div key={index} className="message ai">
								<div className="typing-bubble">
									<span className="typing-icon">☕</span>

									<div className="typing-dots">
										<span></span>
										<span></span>
										<span></span>
									</div>
								</div>
							</div>
						) : (
							<Message
								key={index}
								sender={message.sender}
								text={message.text}
								products={message.products || []}
							/>
						)
					))}

					<div ref={bottomRef}></div>

				</div>

			<ChatInput
				onSend={handleSend}
				loading={loading}
			/>
		</div>
	);
}

export default App;