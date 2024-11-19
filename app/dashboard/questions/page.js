"use client";
import React from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Questions() {
	const faqList = [
		{
			question: "What is an AI mock interview?",
			answer: "An AI mock interview is a simulated interview experience where AI generates questions based on your job role and tech stack, giving you an opportunity to practice and receive feedback.",
		},
		{
			question: "How are the questions generated?",
			answer: "Questions are generated based on the job role, tech stack, and years of experience you input. This ensures relevant, medium-level questions for your practice.",
		},
		{
			question: "What happens to my recorded answers?",
			answer: "Your answers are converted to text using speech recognition, then analyzed for content quality. A rating is provided, and all data is securely handled.",
		},
		{
			question: "How is the feedback calculated?",
			answer: "Feedback is based on comparing your answer text to an ideal answer. This provides insights on key points missed, strengths, and areas for improvement.",
		},
	];

	return (
		<div className="p-8 min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
			<div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
					Frequently Asked Questions
				</h2>

				<div className="space-y-4">
					{faqList.map((faq, index) => (
						<Collapsible key={index}>
							<CollapsibleTrigger className="text-lg font-semibold text-gray-700 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-all">
								{faq.question}
							</CollapsibleTrigger>
							<CollapsibleContent className="p-4 text-gray-600">
								{faq.answer}
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</div>
		</div>
	);
}

export default Questions;
