"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import React from "react";
import { Calendar, Clock, Briefcase, PlayCircle, FileText } from "lucide-react";

function InterviewItemCard({ interviewInfo }) {
	const router = useRouter();

	const onStart = () => {
		router.push(`/dashboard/interview/${interviewInfo?.mockId}`);
	};

	const onFeedback = () => {
		router.push(`/dashboard/interview/${interviewInfo?.mockId}/feedback`);
	};

	const getStatusColor = () => {
		if (!interviewInfo?.status) return "bg-gray-100 text-gray-800";
		switch (interviewInfo.status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-blue-100 text-blue-800";
		}
	};

	return (
		<Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
			<CardContent className="p-5">
				{/* Header */}
				<div className="flex justify-between items-start mb-4">
					<div className="space-y-1">
						<h3 className="font-semibold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">
							{interviewInfo?.jobPosition}
						</h3>
						<Badge variant="secondary" className={getStatusColor()}>
							{interviewInfo?.status || "New"}
						</Badge>
					</div>
				</div>

				{/* Details */}
				<div className="space-y-3 mb-4">
					<div className="flex items-center space-x-4 text-sm text-gray-600">
						<div className="flex items-center">
							<Briefcase className="h-4 w-4 mr-1.5 text-gray-500" />
							<span>{interviewInfo?.jobExperience} Years</span>
						</div>
						<div className="flex items-center">
							<Clock className="h-4 w-4 mr-1.5 text-gray-500" />
							<span>{interviewInfo?.duration || "30"} mins</span>
						</div>
					</div>

					<div className="flex items-center text-sm text-gray-500">
						<Calendar className="h-4 w-4 mr-1.5" />
						<span>
							{
								interviewInfo.createdAt
									? (() => {
											// Split the date string into day, month, and year
											const [day, month, year] =
												interviewInfo.createdAt.split(
													"-"
												);

											// Handle 2-digit year and prepend '20' to make it a 4-digit year (e.g., '24' becomes '2024')
											const fullYear = `${year}`;

											// Create a Date object using the parsed values (month is 0-indexed, so subtract 1)
											const date = new Date(
												fullYear,
												month - 1,
												day
											);

											// Get the full month name
											const monthName =
												date.toLocaleString("en-IN", {
													month: "long",
												});

											// Format as DD-MonthName-YYYY (e.g., 17-November-2024)
											const formattedDate = `${day.padStart(
												2,
												"0"
											)}-${monthName}-${fullYear}`;

											return formattedDate;
									  })()
									: "N/A" // Fallback if createdAt is null or undefined
							}
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex space-x-3">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 border-teal-600 text-teal-700 hover:bg-teal-50"
						onClick={onFeedback}
					>
						<FileText className="h-4 w-4 mr-2" />
						Feedback
					</Button>
					<Button
						size="sm"
						className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
						onClick={onStart}
					>
						<PlayCircle className="h-4 w-4 mr-2" />
						{interviewInfo?.status === "completed"
							? "Review"
							: "Start"}
					</Button>
				</div>

				{/* Decorative Element */}
				<div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-teal-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full" />
			</CardContent>
		</Card>
	);
}

export default InterviewItemCard;