import React from "react";

function InterviewTimer({ timeLeft }) {
	return (
		<div className="p-4 text-center bg-gray-200 rounded-lg">
			<h3 className="text-lg">Time Left: {timeLeft}s</h3>
		</div>
	);
}

export default InterviewTimer;
