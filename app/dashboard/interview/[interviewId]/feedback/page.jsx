"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
	const [feedbackList, setFeedbackList] = useState([]);
	const [avgRating, setAvgRating] = useState();
	const router = useRouter();

	useEffect(() => {
		fetchFeedback();
	}, []);

	const fetchFeedback = async () => {
		const result = await db
			.select()
			.from(UserAnswer)
			.where(eq(UserAnswer.mockIdRef, params.interviewId))
			.orderBy(UserAnswer.id);

		setFeedbackList(result);

		const totalRating = result.reduce(
			(sum, item) => sum + Number(item.rating),
			0
		);
		setAvgRating(Math.round(totalRating / result?.length));
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-200 to-blue-300 p-8">
			<div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-10 relative z-10">
				{feedbackList.length === 0 ? (
					<h2 className="text-center font-semibold text-xl text-gray-600">
						No Interview Feedback Record Found
					</h2>
				) : (
					<>
						<h2 className="text-4xl font-bold text-green-600 mb-2 text-center">
							Congratulations!
						</h2>
						<p className="text-xl font-semibold text-gray-800 mb-6 text-center">
							Here is your interview feedback
						</p>

						<div className="w-full bg-gray-200 rounded-full h-6 mb-6">
							<div
								className={`h-6 rounded-full ${
									avgRating < 6
										? "bg-red-500"
										: "bg-green-500"
								}`}
								style={{ width: `${(avgRating / 10) * 100}%` }}
							></div>
						</div>
						<p className="text-center text-gray-700 text-lg mb-4">
							Overall Rating:{" "}
							<strong
								className={
									avgRating < 6
										? "text-red-600"
										: "text-green-600"
								}
							>
								{avgRating}/10
							</strong>
						</p>

						<p className="text-sm text-gray-500 mb-8 text-center">
							Below are the interview questions, your answers, and
							feedback for improvement.
						</p>

						{feedbackList.map((item, index) => (
							<Collapsible key={index} className="my-4">
								<CollapsibleTrigger className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200">
									<span className="font-medium text-gray-900">
										{item.question}
									</span>
									<ChevronsUpDownIcon className="h-5 w-5 text-gray-600" />
								</CollapsibleTrigger>
								<CollapsibleContent className="transition-all duration-300 ease-in-out mt-2">
									<div className="space-y-3 p-4 bg-gray-50 rounded-md border border-gray-200">
										<p className="text-sm text-gray-700">
											<strong className="text-red-500">
												Rating:
											</strong>{" "}
											{item.rating}
										</p>
										<p className="text-sm text-gray-700">
											<strong className="text-red-500">
												Your Answer:
											</strong>{" "}
											{item.userAns}
										</p>
										<p className="text-sm text-gray-700">
											<strong className="text-green-500">
												Correct Answer:
											</strong>{" "}
											{item.correctAns}
										</p>
										<p className="text-sm text-gray-700">
											<strong className="text-blue-500">
												Feedback:
											</strong>{" "}
											{item.feedback}
										</p>
									</div>
								</CollapsibleContent>
							</Collapsible>
						))}
					</>
				)}
				<Button
					className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all"
					onClick={() => router.replace("/dashboard")}
				>
					Go Home
				</Button>
			</div>

			{/* Decorative Background Overlays */}
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-white to-transparent opacity-50"></div>
			<div className="absolute -top-10 right-10 bg-blue-100 h-40 w-40 rounded-full filter blur-2xl opacity-50"></div>
			<div className="absolute -bottom-10 left-10 bg-green-100 h-40 w-40 rounded-full filter blur-2xl opacity-50"></div>
		</div>
	);
}

export default Feedback;
