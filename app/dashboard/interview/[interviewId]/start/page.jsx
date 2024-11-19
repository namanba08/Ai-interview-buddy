"use client";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_compnents/QuestionsSections";
import RecordAnswerSection from "./_compnents/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
function StartInterview({ params }) {
	const [interviewData, setInterviewData] = useState();
	const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
	const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [rating, setRating] = useState(0);
	const [startTime, setStartTime] = useState(null); // To store the interview start time
	const [endTime, setEndTime] = useState(null);

	useEffect(() => {
		GetInterviewDetail();
	}, []);

	/**
	 * Used to Get Interview Details by MockId/Interview Id
	 */

	const GetInterviewDetail = async () => {
		const result = await db
			.select()
			.from(MockInterview)
			.where(eq(MockInterview.mockId, params.interviewId));

		const jsonMockResp = JSON.parse(result[0]?.jsonMockResp);

		setMockInterviewQuestion(jsonMockResp);

		setInterviewData(result[0]);
		setStartTime(new Date());
	};
	const handleEndInterview = async () => {
		try {
			// Capture end time when the interview ends
			const end = new Date();
			setEndTime(end);

			// Calculate duration (in minutes)
			const durationInMinutes = Math.round((end - startTime) / 60000);

			console.log(`Interview duration: ${durationInMinutes} minutes`);

			const result = await db
				.select()
				.from(UserAnswer)
				.where(eq(UserAnswer.mockIdRef, params.interviewId))
				.orderBy(UserAnswer.id);


			const totalRating = result.reduce(
				(sum, item) => sum + Number(item.rating),
				0
			);
			setRating((totalRating / result?.length).toFixed(2));
			// Update the MockInterview table with both the duration and overall rating
			const updateResponse = await db
				.update(MockInterview)
				.set({
					duration: durationInMinutes,
          rating: rating,
				})
				.where(eq(MockInterview.mockId, interviewData.mockId));

			if (updateResponse) {
				toast(
					`Interview ended. Duration: ${durationInMinutes} minutes`
				);
				console.log("Interview data updated successfully.");
			} else {
				toast("Failed to update interview data.");
			}
		} catch (error) {
			console.error("Error updating interview data:", error);
			toast("Error occurred while updating the interview data.");
		}
	};

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* Questions */}
				<QuestionsSections
					activeQuestionIndex={activeQuestionIndex}
					mockInterViewQuestion={mockInterviewQuestion}
				/>
				{/* Video/ Audio Recording */}
				<RecordAnswerSection
					activeQuestionIndex={activeQuestionIndex}
					mockInterViewQuestion={mockInterviewQuestion}
					interviewData={interviewData}
				/>
			</div>

			<div className="flex justify-end gap-6">
				{activeQuestionIndex > 0 && (
					<Button
						disabled={activeQuestionIndex == 0}
						onClick={() =>
							setActiveQuestionIndex(activeQuestionIndex - 1)
						}
					>
						Previous Question
					</Button>
				)}

				{activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
					<Button
						onClick={() =>
							setActiveQuestionIndex(activeQuestionIndex + 1)
						}
					>
						Next Question
					</Button>
				)}

				{activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
					<Link
						href={
							"/dashboard/interview/" +
							interviewData?.mockId +
							"/feedback"
						}
					>
						<Button onClick={handleEndInterview}>
							End Interview
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}

export default StartInterview;
