"use client";
import React from "react";

function HowItWorks() {
	return (
		<div className="p-8 min-h-screen bg-gradient-to-r from-green-50 via-white to-green-50">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-4xl font-bold text-green-600 text-center mb-6">
					How It Works
				</h2>
				<p className="text-gray-700 mb-4">
					Our AI Mock Interview app is designed to help you improve
					your interview skills by simulating a realistic interview
					experience. Here's how it works:
				</p>

				<div className="space-y-6">
					<div>
						<h3 className="text-2xl font-semibold text-gray-800">
							Step 1: Input Your Information
						</h3>
						<p className="text-gray-600">
							Enter details such as your job role, tech stack, and
							years of experience. This information allows our AI
							to tailor questions specific to your profile.
						</p>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-gray-800">
							Step 2: Answer the Interview Questions
						</h3>
						<p className="text-gray-600">
							Our app generates medium-level questions relevant to
							your experience. For each question, you can record a
							video response, mimicking a real interview
							environment.
						</p>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-gray-800">
							Step 3: Receive Feedback
						</h3>
						<p className="text-gray-600">
							After each question, your speech is transcribed into
							text and compared against an ideal answer. You’ll
							receive a rating based on relevance, clarity, and
							completeness, plus an overall score on the feedback
							page.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HowItWorks;
