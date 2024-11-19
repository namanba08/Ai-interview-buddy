// import { UserButton } from "@clerk/nextjs";
// import React from "react";
// import AddNewInterview from "./_components/AddNewInterview";
// import Interviewlist from "./_components/Interviewlist";

// function Dashboard() {
// 	return (
// 		<div className=" min-h-screen bg-gradient-to-r from-teal-50 via-white to-teal-50 p-8 relative">
// 			{/* Main Container with Full Width */}
// 			<div className="w-full p-6 bg-white shadow-lg rounded-lg relative z-10">
// 				{/* Header */}
// 				<div className="flex items-center justify-between mb-8">
// 					<div>
// 						<h2 className="text-4xl font-bold text-teal-600">
// 							Dashboard
// 						</h2>
// 						<p className="text-gray-600">
// 							Create and Start AI Mockup Interview
// 						</p>
// 					</div>
// 					<UserButton className="rounded-full bg-gray-100 shadow-sm hover:shadow-md transition-all" />
// 				</div>

// 				{/* Add New Interview Section */}
// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// 					<div className="col-span-1">
// 						<div className="p-6 bg-teal-100 rounded-lg shadow hover:shadow-lg transition-shadow">
// 							<AddNewInterview />
// 						</div>
// 					</div>
// 				</div>

// 				{/* Previous Interview List */}
// 				<div className="p-6 bg-gray-50 rounded-lg shadow-md">
// 					<h3 className="text-2xl font-semibold text-gray-800 mb-4">
// 						Your Previous Interviews
// 					</h3>
// 					<Interviewlist />
// 				</div>
// 			</div>

// 			{/* Decorative Background Overlays */}
// 			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-white to-transparent opacity-50"></div>
// 			<div className="absolute -top-10 right-10 bg-teal-200 h-40 w-40 rounded-full filter blur-2xl opacity-50"></div>
// 			<div className="absolute -bottom-10 left-10 bg-pink-200 h-40 w-40 rounded-full filter blur-2xl opacity-50"></div>
// 		</div>
// 	);
// }

// export default Dashboard;
"use client";

import { db } from "@/utils/db";
import { MockInterview,UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, gte, lt, and } from "drizzle-orm";

import { React, useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Calendar,
	Clock,
	Briefcase,
	Star,
	Trophy,
	FileText,
	TrendingUp,
	History,
	BookOpen,
} from "lucide-react";
import AddNewInterview from "./_components/AddNewInterview";
import Interviewlist from "./_components/Interviewlist";
import { set } from "date-fns";
import moment from "moment";

function Dashboard() {
	const { user } = useUser();
	const [countOfInterviews, setCountOfInterviews] = useState(0);
	const [avgScore, setAvgScore] = useState(0)
	const [duration, setDuration] = useState(0);
	const [improvement, setImprovement] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (user) {
			GetInterviewList();
		}
	}, [user]);

	const GetInterviewList = async () => {
		
		try {
			// Get all interviews for the user from MockInterview table
			setLoading(true);
			const interviews = await db
				.select()
				.from(MockInterview)
				.where(
					eq(
						MockInterview.createdBy,
						user?.primaryEmailAddress?.emailAddress
					)
				)
				.orderBy(MockInterview.createdAt); 

			setCountOfInterviews(interviews.length);
			
			let rating = 0;
			let d = 0;
			for (let interview of interviews) {
				rating += isNaN(interview.rating) ? 0 : interview.rating;
				// Accumulate total duration (ensure it's valid)
				d += isNaN(interview.duration) ? 0 : interview.duration;
				
				console.log("current duration", d);
			}
			console.log(
				"All createdAt values from interviews:",
				interviews.map((i) => i.createdAt)
			);

				// now to fetch interviews to track month-on-month performance
				const thirtyDaysAgo = moment()
					.subtract(30, "days")
				const interviews2 = await db
					.select()
					.from(MockInterview)
					.where(
						and(
							eq(
								MockInterview.createdBy,
								user?.primaryEmailAddress?.emailAddress
							),
							gte(MockInterview.createdAt, thirtyDaysAgo)
						)
					);
				let ratingInLast30 = 0;
				for (let interview of interviews2) {
					ratingInLast30 += isNaN(interview.rating)
						? 0
						: interview.rating;
				}
				// Calculate the last 30-day interval (not including the current interval)
				const endOfPreviousInterval = moment()
					.subtract(30, "days")
					.endOf("day")

				const startOfPreviousInterval = moment()
					.subtract(60, "days")
					.startOf("day")
					.format("YYYY-MM-DD");

				const interviews3 = await db
					.select()
					.from(MockInterview)
					.where(
						and(
							eq(
								MockInterview.createdBy,
								user?.primaryEmailAddress?.emailAddress
							),
							gte(
								MockInterview.createdAt,
								startOfPreviousInterval
							),
							lt(MockInterview.createdAt, endOfPreviousInterval)
						)
					);
				let ratingInLast60 = 0;
				for (let interview of interviews3) {
					ratingInLast60 += isNaN(interview.rating)
						? 0
						: interview.rating;
				}
				if (ratingInLast60 === 0) {
					if(ratingInLast30 > 0){
						setImprovement(100);
					}
				}
				else{
					setImprovement(
						((ratingInLast30 - ratingInLast60) / ratingInLast60) *
							100
					);
				}
				console.log("interviews",interviews.length)
				console.log("interviews2",interviews2.length)
				console.log("interviews3",interviews3.length)
				console.log("ratingInLast30",ratingInLast30)
				console.log("ratingInLast60",ratingInLast60)
				console.log("improvement",improvement)

			
			setAvgScore((rating/interviews.length));
			setDuration(d)
			console.log("duration",duration)
		} catch (error) {
			console.error(
				"Error fetching interviews or calculating scores:",
				error
			);
		}
		finally{
			setLoading(false);
		}
	};
	const stats = [
		{
			label: "Total Interviews",
			value: countOfInterviews,
			icon: History,
			description: "Completed sessions",
		},
		{
			label: "Avg. Score",
			value: avgScore*10+'%',
			icon: Star,
			description: "Performance rating",
		},
		{
			label: "Practice Time",
			value: duration+' mins',
			icon: Clock,
			description: "Total time invested",
		},
		{
			label: "Progress",
			value: improvement+'%',
			icon: TrendingUp,
			description: "Monthly improvement",
		},
	];

	const quickTips = [
		"Research the company before the interview",
		"Practice STAR method responses",
		"Prepare relevant questions",
		"Review technical concepts",
	];

	return (
		<div className="min-h-screen bg-gradient-to-r from-teal-50 via-white to-teal-50 p-4 md:p-8">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header Section */}
				<div className="bg-white rounded-xl shadow-lg p-6">
					<div className="flex items-center justify-between mb-8">
						<div className="space-y-2">
							<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
								Interview Dashboard
							</h1>
							<p className="text-gray-600 text-lg">
								Welcome back! Ready for your next practice
								session?
							</p>
						</div>
						<UserButton
							afterSignOutUrl="/"
							appearance={{
								elements: {
									avatarBox: "h-12 w-12",
								},
							}}
						/>
					</div>

					{/* Stats Grid */}
					{loading ? (
						<p>Loading interviews...</p>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
								{stats.map((stat, index) => (
									<Card
										key={index}
										className="bg-gradient-to-br from-white to-teal-50 border-none hover:shadow-lg transition-shadow duration-300"
									>
										<CardContent className="p-4">
											<div className="flex items-center space-x-4">
												<div className="p-3 bg-teal-100 rounded-lg">
													<stat.icon className="h-6 w-6 text-teal-700" />
												</div>
												<div>
													<p className="text-2xl font-bold text-teal-700">
														{stat.value}
													</p>
													<p className="text-sm font-medium text-gray-600">
														{stat.label}
													</p>
													<p className="text-xs text-gray-500">
														{stat.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</>
					)}
				</div>

				{/* Main Content Grid */}
				<div className="grid md:grid-cols-3 gap-6">
					<div className="md:col-span-1 space-y-6">
						{/* New Interview Section */}
						<Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white overflow-hidden relative">
							<div className="absolute right-0 top-0 opacity-10">
								<Trophy className="h-32 w-32 -rotate-12" />
							</div>
							<CardHeader>
								<CardTitle className="text-2xl">
									Start New Interview
								</CardTitle>
								<CardDescription className="text-teal-100">
									Practice with AI-powered mock interviews
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AddNewInterview />
							</CardContent>
						</Card>

						{/* Quick Tips Section */}
						<Card>
							<CardHeader>
								<div className="flex items-center space-x-2">
									<BookOpen className="h-5 w-5 text-teal-600" />
									<CardTitle>Quick Tips</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{quickTips.map((tip, index) => (
										<li
											key={index}
											className="flex items-start space-x-2"
										>
											<div className="mt-1.5">
												<div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
											</div>
											<span className="text-gray-600 text-sm">
												{tip}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</div>

					{/* Interview List Section */}
					<Card className="md:col-span-2">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Recent Interviews</CardTitle>
									<CardDescription>
										Review and continue your previous
										sessions
									</CardDescription>
								</div>
								<div className="flex items-center space-x-2 text-sm text-gray-500">
									<Calendar className="h-4 w-4" />
									<span>Last 30 days</span>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Interviewlist />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

// "use client";
// import React, { useState, useEffect } from "react";
// import { UserButton } from "@clerk/nextjs";
// import {
// 	Card,
// 	CardContent,
// 	CardHeader,
// 	CardTitle,
// 	CardDescription,
// } from "@/components/ui/card";
// import {
// 	Calendar,
// 	Clock,
// 	Briefcase,
// 	Star,
// 	Trophy,
// 	FileText,
// 	TrendingUp,
// 	History,
// 	BookOpen,
// } from "lucide-react";
// import AddNewInterview from "./_components/AddNewInterview";
// import Interviewlist from "./_components/Interviewlist";
// import { db } from "@/utils/db"; // Import the db instance
// import { MockInterview, UserAnswer } from "@/utils/schema"; // Import the schema
// import { eq, desc } from "drizzle-orm";

// const Dashboard = () => {
// 	const [loading, setLoading] = useState(false);
// 	const [stats, setStats] = useState([]); // Removed TypeScript type annotations
// 	const [interviewList, setInterviewList] = useState([]); // Removed TypeScript type annotations

// 	const user = { primaryEmailAddress: { emailAddress: "user@example.com" } }; // Get the user email address

// 	useEffect(() => {
// 		const fetchStats = async () => {
// 			setLoading(true);

// 			try {
// 				// Fetch interviews for the logged-in user
// 				const result = await db
// 					.select()
// 					.from(MockInterview)
// 					.where(
// 						eq(
// 							MockInterview.createdBy,
// 							user?.primaryEmailAddress?.emailAddress
// 						)
// 					)
// 					.orderBy(desc(MockInterview.id));

// 				setInterviewList(result);

// 				// Calculate stats based on fetched interview results
// 				let totalInterviews = result.length;
// 				let totalScore = 0;
// 				let totalTime = 0;
// 				let lastMonthScore = 0;
// 				let thisMonthScore = 0;

// 				for (let interview of result) {
// 					// Fetch UserAnswers for each interview
// 					const userAnswers = await db
// 						.select()
// 						.from(UserAnswer)
// 						.where(eq(UserAnswer.mockIdRef, interview.mockId));

// 					const interviewScore = userAnswers.reduce(
// 						(score, answer) => {
// 							if (answer.rating) {
// 								return score + parseInt(answer.rating);
// 							}
// 							return score;
// 						},
// 						0
// 					);

// 					totalScore += interviewScore;

// 					// Assume createdAt is in 'YYYY-MM-DD' format and calculate time
// 					const createdAtDate = new Date(interview.createdAt);
// 					totalTime +=
// 						(new Date().getTime() - createdAtDate.getTime()) /
// 						1000 /
// 						3600; // time in hours

// 					// Calculate score for monthly progress
// 					const currentMonth = new Date().getMonth();
// 					const interviewMonth = new Date(
// 						interview.createdAt
// 					).getMonth();

// 					if (interviewMonth === currentMonth) {
// 						thisMonthScore += interviewScore;
// 					} else if (interviewMonth === currentMonth - 1) {
// 						lastMonthScore += interviewScore;
// 					}
// 				}

// 				// Calculate stats
// 				const avgScore = totalScore / totalInterviews;
// 				const practiceTime = totalTime.toFixed(2);
// 				const progress =
// 					((thisMonthScore - lastMonthScore) / lastMonthScore) * 100;

// 				setStats([
// 					{
// 						label: "Total Interviews",
// 						value: totalInterviews.toString(),
// 						icon: History,
// 						description: "Completed sessions",
// 					},
// 					{
// 						label: "Avg. Score",
// 						value: avgScore.toFixed(1),
// 						icon: Star,
// 						description: "Performance rating",
// 					},
// 					{
// 						label: "Practice Time",
// 						value: `${practiceTime} hrs`,
// 						icon: Clock,
// 						description: "Total time invested",
// 					},
// 					{
// 						label: "Progress",
// 						value: `${progress.toFixed(1)}%`,
// 						icon: TrendingUp,
// 						description: "Monthly improvement",
// 					},
// 				]);
// 			} catch (error) {
// 				console.error("Error fetching stats:", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchStats();
// 	}, [user?.primaryEmailAddress?.emailAddress]);

// 	const quickTips = [
// 		"Research the company before the interview",
// 		"Practice STAR method responses",
// 		"Prepare relevant questions",
// 		"Review technical concepts",
// 	];

// 	return (
// 		<div className="min-h-screen bg-gradient-to-r from-teal-50 via-white to-teal-50 p-4 md:p-8">
// 			<div className="max-w-7xl mx-auto space-y-6">
// 				{/* Header Section */}
// 				<div className="bg-white rounded-xl shadow-lg p-6">
// 					<div className="flex items-center justify-between mb-8">
// 						<div className="space-y-2">
// 							<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
// 								Interview Dashboard
// 							</h1>
// 							<p className="text-gray-600 text-lg">
// 								Welcome back! Ready for your next practice
// 								session?
// 							</p>
// 						</div>
// 						<UserButton
// 							afterSignOutUrl="/"
// 							appearance={{
// 								elements: {
// 									avatarBox: "h-12 w-12",
// 								},
// 							}}
// 						/>
// 					</div>

// 					{/* Stats Grid */}
// 					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
// 						{stats.map((stat, index) => (
// 							<Card
// 								key={index}
// 								className="bg-gradient-to-br from-white to-teal-50 border-none hover:shadow-lg transition-shadow duration-300"
// 							>
// 								<CardContent className="p-4">
// 									<div className="flex items-center space-x-4">
// 										<div className="p-3 bg-teal-100 rounded-lg">
// 											<stat.icon className="h-6 w-6 text-teal-700" />
// 										</div>
// 										<div>
// 											<p className="text-2xl font-bold text-teal-700">
// 												{stat.value}
// 											</p>
// 											<p className="text-sm font-medium text-gray-600">
// 												{stat.label}
// 											</p>
// 											<p className="text-xs text-gray-500">
// 												{stat.description}
// 											</p>
// 										</div>
// 									</div>
// 								</CardContent>
// 							</Card>
// 						))}
// 					</div>
// 				</div>

// 				{/* Main Content Grid */}
// 				<div className="grid md:grid-cols-3 gap-6">
// 					<div className="md:col-span-1 space-y-6">
// 						{/* New Interview Section */}
// 						<Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white overflow-hidden relative">
// 							<div className="absolute right-0 top-0 opacity-10">
// 								<Trophy className="h-32 w-32 -rotate-12" />
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="text-2xl">
// 									Start New Interview
// 								</CardTitle>
// 								<CardDescription className="text-teal-100">
// 									Practice with AI-powered mock interviews
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<AddNewInterview />
// 							</CardContent>
// 						</Card>

// 						{/* Quick Tips Section */}
// 						<Card>
// 							<CardHeader>
// 								<div className="flex items-center space-x-2">
// 									<BookOpen className="h-5 w-5 text-teal-600" />
// 									<CardTitle>Quick Tips</CardTitle>
// 								</div>
// 							</CardHeader>
// 							<CardContent>
// 								<ul className="space-y-2">
// 									{quickTips.map((tip, index) => (
// 										<li
// 											key={index}
// 											className="flex items-start space-x-2"
// 										>
// 											<div className="mt-1.5">
// 												<div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
// 											</div>
// 											<span className="text-gray-600">
// 												{tip}
// 											</span>
// 										</li>
// 									))}
// 								</ul>
// 							</CardContent>
// 						</Card>
// 					</div>

// 					{/* Interview List Section */}
// 					<div className="md:col-span-2 space-y-6">
// 						<Card>
// 							<CardHeader>
// 								<div className="flex items-center space-x-2">
// 									<Briefcase className="h-5 w-5 text-teal-600" />
// 									<CardTitle>Your Interviews</CardTitle>
// 								</div>
// 							</CardHeader>
// 							<CardContent>
// 								{loading ? (
// 									<div>Loading...</div>
// 								) : interviewList.length > 0 ? (
// 									<Interviewlist interviews={interviewList} />
// 								) : (
// 									<div className="text-gray-500">
// 										No interviews yet
// 									</div>
// 								)}
// 							</CardContent>
// 						</Card>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Dashboard;
