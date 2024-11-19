import React, { useState } from "react";

function FeedbackForm({ questionId, mockId }) {
	const [feedback, setFeedback] = useState("");
	const [rating, setRating] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch("/api/submitFeedback", {
			method: "POST",
			body: JSON.stringify({ questionId, mockId, feedback, rating }),
		});
		const data = await response.json();
		if (data.success) {
			alert("Feedback submitted!");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4">
			<textarea
				value={feedback}
				onChange={(e) => setFeedback(e.target.value)}
				placeholder="Enter your feedback here"
				rows={4}
				className="w-full p-3 border rounded-lg"
			/>
			<div className="mt-3">
				<label htmlFor="rating" className="block">
					Rating:
				</label>
				<select
					id="rating"
					value={rating}
					onChange={(e) => setRating(e.target.value)}
					className="w-full p-3 border rounded-lg"
				>
					<option value="">Select Rating</option>
					<option value="1">1 - Poor</option>
					<option value="2">2 - Fair</option>
					<option value="3">3 - Good</option>
					<option value="4">4 - Very Good</option>
					<option value="5">5 - Excellent</option>
				</select>
			</div>
			<button
				type="submit"
				className="mt-3 p-3 bg-blue-500 text-white rounded-lg"
			>
				Submit Feedback
			</button>
		</form>
	);
}

export default FeedbackForm;
