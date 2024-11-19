"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModel";
import { v4 as uuidv4 } from "uuid";

function AddNewInterview() {
	const [JsonResponse, setJsonResponse] = useState([]);
	const route = useRouter();
	const { user } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		jobPosition: "",
		jobDesc: "",
		jobExperience: "",
	});

	const onSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		const InputPromt = `Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION} interview questions and answers in JSON format based on the following: Job Position: ${formData.jobPosition}, Job Description: ${formData.jobDesc}, Years of Experience: ${formData.jobExperience}. Only return the JSON, without any additional text.`;
		const result = await chatSession.sendMessage(InputPromt);
		const MockJsonResp = result.response
			.text()
			.replace("```json", "")
			.replace("```", "");
		console.log(JSON.parse(MockJsonResp));
		setJsonResponse(JSON.parse(MockJsonResp));
		if (MockJsonResp) {
			const resp = await db
				.insert(MockInterview)
				.values({
					mockId: uuidv4(),
					jsonMockResp: MockJsonResp,
					jobPosition: formData.jobPosition,
					jobDesc: formData.jobDesc,
					jobExperience: formData.jobExperience,
					createdBy: user?.primaryEmailAddress?.emailAddress,
					createdAt: moment().format("DD-MM-yyyy"),
				})
				.returning({ mockId: MockInterview.mockId });
			console.log("Insert ID:", resp);
			if (resp) {
				route.push("/dashboard/interview/" + resp[0].mockId);
				
			}
		} else {
			console.log("ERROR");
		}

		setLoading(false);
		console.log(JsonResponse);
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			{/* Job Position Input */}
			<div>
				<label className="block text-sm font-medium text-white mb-1">
					Job Position
				</label>
				<input
					type="text"
					value={formData.jobPosition}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							jobPosition: e.target.value,
						}))
					}
					className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md 
                             text-white placeholder-white/50 focus:outline-none focus:ring-2 
                             focus:ring-white/50"
					placeholder="e.g. Frontend Developer"
					required
				/>
			</div>

			{/* Job Description Input */}
			<div>
				<label className="block text-sm font-medium text-white mb-1">
					Job Description
				</label>
				<textarea
					value={formData.jobDesc}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							jobDesc: e.target.value,
						}))
					}
					className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md 
                             text-white placeholder-white/50 focus:outline-none focus:ring-2 
                             focus:ring-white/50 min-h-[80px]"
					placeholder="Enter job description..."
					required
				/>
			</div>

			{/* Experience Input */}
			<div>
				<label className="block text-sm font-medium text-white mb-1">
					Years of Experience
				</label>
				<input
					type="text"
					value={formData.jobExperience}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							jobExperience: e.target.value,
						}))
					}
					className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md 
                             text-white placeholder-white/50 focus:outline-none focus:ring-2 
                             focus:ring-white/50"
					placeholder="e.g. 3"
					required
				/>
			</div>

			{/* Submit Button */}
			<Button
				type="submit"
				disabled={loading}
				className="w-full bg-white text-teal-600 hover:bg-white/90 
                         transition-colors font-medium py-2 px-4 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-white/50
                         disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? "Creating..." : "Start Interview"}
			</Button>
		</form>
	);
}

export default AddNewInterview;
