import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { sendMessage } from "../services/api";

function Widget() {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const bottomRef = useRef(null);
	const inputRef = useRef(null);

	/*
	 * Tell the WordPress parent page when the widget
	 * opens or closes.
	 */
	useEffect(() => {
		window.parent.postMessage(
			{
				type: "SWASTHYA_WIDGET_RESIZE",
				open: isOpen
			},
			"https://swasthyacoffee.com"
		);
	}, [isOpen]);

	/*
	 * Keep the latest message visible.
	 */
	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth"
		});
	}, [messages]);

	/*
	 * Focus input when chat opens.
	 */
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 250);
		}
	}, [isOpen]);

	/*
	 * Send message to backend.
	 */
	async function handleSend(message) {
		const cleanMessage = message.trim();

		if (!cleanMessage || loading) return;

		setLoading(true);

		setMessages((previous) => [
			...previous,
			{
				sender: "User",
				text: cleanMessage,
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
			const response = await sendMessage(cleanMessage);

			setMessages((previous) => {
				const updated = [...previous];

				updated[updated.length - 1] = {
					sender: "AI",
					text:
						response?.response ||
						"Sorry, I couldn't find an answer.",
					products: response?.products || [],
					typing: false
				};

				return updated;
			});
		} catch (error) {
			console.error("Widget error:", error);

			setMessages((previous) => {
				const updated = [...previous];

				updated[updated.length - 1] = {
					sender: "AI",
					text:
						"Sorry, something went wrong. Please try again.",
					products: [],
					typing: false
				};

				return updated;
			});
		} finally {
			setLoading(false);

			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}

	/*
	 * Suggestion button.
	 */
	function sendSuggestion(text) {
		setIsOpen(true);
		handleSend(text);
	}

	/*
	 * Input handler.
	 */
	function handleKeyDown(event) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();

			const value = event.target.value;

			if (value.trim()) {
				handleSend(value);
				event.target.value = "";
			}
		}
	}

	/*
	 * Send button.
	 */
	function handleInputSend() {
		const value = inputRef.current?.value || "";

		if (value.trim()) {
			handleSend(value);
			inputRef.current.value = "";
		}
	}

	return (
		<div className="sw-widget">

			{/* =================================================
			    CHAT WINDOW
			    ================================================= */}

			{isOpen && (
				<div
					className="sw-widget-window"
					role="dialog"
					aria-label="Swasthya Coffee AI Assistant"
				>

					{/* =========================
					    HEADER
					    ========================= */}

					<div className="sw-widget-header">

						<div className="sw-widget-brand">

							<div className="sw-widget-logo">
								☕
							</div>

							<div className="sw-widget-brand-text">

								<div className="sw-widget-title">
									Swasthya Coffee
								</div>

								<div className="sw-widget-subtitle">
									AI Assistant • Online
								</div>

							</div>

						</div>

						<button
							type="button"
							className="sw-widget-close"
							onClick={() => setIsOpen(false)}
							aria-label="Close chat"
						>
							×
						</button>

					</div>


					{/* =========================
					    MESSAGES
					    ========================= */}

					<div className="sw-widget-messages">

						{/* Welcome screen */}

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
										type="button"
										onClick={() =>
											sendSuggestion(
												"Recommend me a strong coffee"
											)
										}
									>
										Recommend a strong coffee
									</button>

									<button
										type="button"
										onClick={() =>
											sendSuggestion(
												"Show me the available products"
											)
										}
									>
										Show available products
									</button>

									<button
										type="button"
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


						{/* =========================
						    CHAT MESSAGES
						    ========================= */}

						{messages.map((message, index) => (
							message.typing ? (

								<div
									key={index}
									className="sw-widget-typing"
								>

									<span className="sw-widget-typing-icon">
										☕
									</span>

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


					{/* =========================
					    INPUT
					    ========================= */}

					<div className="sw-widget-input">

						<input
							ref={inputRef}
							type="text"
							placeholder="Ask about coffee..."
							disabled={loading}
							onKeyDown={handleKeyDown}
							aria-label="Ask about coffee"
						/>

						<button
							type="button"
							disabled={loading}
							onClick={handleInputSend}
							aria-label="Send message"
						>
							{loading ? "•••" : "➤"}
						</button>

					</div>

				</div>
			)}


			{/* =================================================
			    FLOATING CHAT BUTTON
			    ================================================= */}

			<button
				type="button"
				className={`sw-widget-button ${
					isOpen ? "sw-widget-button-open" : ""
				}`}
				onClick={() =>
					setIsOpen((previous) => !previous)
				}
				aria-label={
					isOpen
						? "Close Swasthya Coffee Assistant"
						: "Open Swasthya Coffee Assistant"
				}
			>

				<span className="sw-widget-button-icon">
					{isOpen ? "×" : "☕"}
				</span>

			</button>

		</div>
	);
}

export default Widget;