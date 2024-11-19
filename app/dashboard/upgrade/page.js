"use client";
import React from "react";

function Upgrade() {
	const plans = [
		{
			title: "Basic",
			price: "$9.99/mo",
			features: [
				"Access to AI-generated questions",
				"Basic feedback report",
				"5 interviews per month",
			],
		},
		{
			title: "Pro",
			price: "$19.99/mo",
			features: [
				"Advanced AI question customization",
				"Detailed feedback analysis",
				"Unlimited interviews",
			],
		},
		{
			title: "Premium",
			price: "$29.99/mo",
			features: [
				"One-on-one feedback sessions",
				"Priority support",
				"Access to exclusive content",
			],
		},
	];

	return (
		<div className="p-8 min-h-screen bg-gradient-to-r from-purple-50 via-white to-purple-50">
			<div className="max-w-5xl mx-auto text-center mb-8">
				<h2 className="text-4xl font-bold text-purple-600 mb-4">
					Upgrade Your Experience
				</h2>
				<p className="text-gray-700">
					Choose a plan that best suits your interview preparation
					needs.
				</p>
			</div>

			<div className="flex flex-wrap gap-3 justify-center">
				{plans.map((plan, index) => (
					<div
						key={index}
						className="bg-white shadow-lg rounded-lg p-8 w-full md:w-80 hover:shadow-2xl transition-all"
					>
						<h3 className="text-2xl font-semibold text-gray-800 mb-4">
							{plan.title}
						</h3>
						<p className="text-3xl font-bold text-purple-600 mb-4">
							{plan.price}
						</p>
						<ul className="space-y-3 mb-6">
							{plan.features.map((feature, idx) => (
								<li key={idx} className="text-gray-600">
									{feature}
								</li>
							))}
						</ul>
						<button className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-all">
							Select Plan
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default Upgrade;
