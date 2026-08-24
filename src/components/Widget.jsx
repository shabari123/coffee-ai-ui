import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { sendMessage } from "../services/api";

function Widget() {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const bottomRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth"
		});
	}, [messages]);

	async function handleSend(message) {
		if (!message.trim() || loading) return;

		setLoading(true);

		setMessages((previous) => [
			...previous,
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
			}
		]);

		try {
			const response = await sendMessage(message);

			setMessages((previous) => {
				const updated = [...previous];

				updated[updated.length - 1] = {
					sender: "AI",
					text: response.response,
					products: response.products || [],
					typing: false
				};

				return updated;
			});
		} catch (error) {
			console.error(error);

			setMessages((previous) => {
				const updated = [...previous];

				updated[updated.length - 1] = {
					sender: "AI",
					text: "Sorry, something went wrong. Please try again.",
					products: [],
					typing: false
				};

				return updated;
			});
		} finally {
			setLoading(false);
		}
	}

	function sendSuggestion(text) {
		setIsOpen(true);
		handleSend(text);
	}

	return (
		<div className="sw-widget">

			{/* Chat Window */}
			{isOpen && (
				<div className="sw-widget-window">

					{/* Header */}
					<div className="sw-widget-header">

						<div className="sw-widget-brand">

							<div className="sw-widget-logo">
								☕
							</div>

							<div>
								<div className="sw-widget-title">
									Swasthya Coffee
								</div>

								<div className="sw-widget-subtitle">
									AI Coffee Assistant
								</div>
							</div>

						</div>

						<button
							className="sw-widget-close"
							onClick={() => setIsOpen(false)}
							aria-label="Close chat"
						>
							×
						</button>

					</div>


					{/* Messages */}
					<div className="sw-widget-messages">

						{messages.length === 0 && (
							<div className="sw-widget-welcome">

								<div className="sw-widget-welcome-icon">
									☕
								</div>

								<h2>
									Hi! 👋
								</h2>

								<p>
									How can I help you find the right coffee?
								</p>

								<div className="sw-widget-suggestions">

									<button
										onClick={() =>
											sendSuggestion(
												"Recommend me a strong coffee"
											)
										}
									>
										Recommend a strong coffee
									</button>

									<button
										onClick={() =>
											sendSuggestion(
												"Show me the available products"
											)
										}
									>
										Show available products
									</button>

									<button
										onClick={() =>
											sendSuggestion(
												"Which coffee is good for filter coffee?"
											)
										}
									>
										Best coffee for filter coffee
									</button>

								</div>

							</div>
						)}


						{messages.map((message, index) => (
							message.typing ? (
								<div
									key={index}
									className="sw-widget-typing"
								>
									<span>☕</span>

									<div className="sw-widget-dots">
										<span></span>
										<span></span>
										<span></span>
									</div>
								</div>
							) : (
								<div
									key={index}
									className="sw-widget-message-wrapper"
								>
									<Message
										sender={message.sender}
										text={message.text}
										products={message.products || []}
									/>
								</div>
							)
						))}

						<div ref={bottomRef} />

					</div>


					{/* Input */}
					<div className="sw-widget-input">

						<input
							type="text"
							placeholder="Ask about coffee..."
							disabled={loading}
							onKeyDown={(event) => {
								if (
									event.key === "Enter" &&
									event.target.value.trim()
								) {
									handleSend(event.target.value);
									event.target.value = "";
								}
							}}
						/>

						<button
							disabled={loading}
							onClick={(event) => {
								const input =
									event.currentTarget
										.previousElementSibling;

								if (input.value.trim()) {
									handleSend(input.value);
									input.value = "";
								}
							}}
						>
							{loading ? "..." : "➤"}
						</button>

					</div>

				</div>
			)}


			{/* Floating Button */}
			<button
				className={`sw-widget-button ${
					isOpen ? "sw-widget-button-open" : ""
				}`}
				onClick={() => setIsOpen((previous) => !previous)}
				aria-label="Open Swasthya Coffee Assistant"
			>
				{isOpen ? "×" : "☕"}
			</button>

		</div>
	);
}

export default Widget;