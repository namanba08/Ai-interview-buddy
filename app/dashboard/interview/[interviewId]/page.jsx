"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon, Camera } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Briefcase } from "lucide-react";
import { FileText, Clock} from "lucide-react";
function Interview({ params }) {
	const [interviewData, setInterviewData] = useState();
	const [webCamEnabled, setWebCamEnabled] = useState(false);
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
		console.log(result);
		setInterviewData(result[0]);
	};
	const jobDetails = [
		{ label: "Job Role/Position", value: interviewData?.jobPosition },
		{ label: "Job Description", value: interviewData?.jobDesc },
		{ label: "Years of Experience", value: interviewData?.jobExperience },
	];
	return (
		// <div className="my-10 ">
		// 	<h2 className="font-bold text-2xl">Let's Get Started</h2>
		// 	<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
		// 		<div className="flex flex-col my-5 gap-5">
		// 			<div className="flex flex-col p-5 rounded-lg border gap-5">
		// 				<h2>
		// 					<strong>Job Role/Job Position:</strong>{" "}
		// 					{interviewData?.jobPosition}{" "}
		// 				</h2>
		// 				<h2>
		// 					<strong>Job Description/Job Description:</strong>{" "}
		// 					{interviewData?.jobDesc}{" "}
		// 				</h2>
		// 				<h2>
		// 					<strong>Years of Experince:</strong>{" "}
		// 					{interviewData?.jobExperience}{" "}
		// 				</h2>
		// 			</div>
		// 			<div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100 ">
		// 				<h2 className="flex gap-2 items-center text-yellow-500">
		// 					<Lightbulb /> <strong>Information</strong>{" "}
		// 				</h2>
		// 				<h2 className="mt-3 text-yellow-500">
		// 					{process.env.NEXT_PUBLIC_INFORMATION}
		// 				</h2>
		// 			</div>
		// 		</div>
		// 		<div>
		// 			{webCamEnabled ? (
		// 				<Webcam
		// 					mirrored={true}
		// 					style={{ height: 300, width: 300 }}
		// 					onUserMedia={() => setWebCamEnabled(true)}
		// 					onUserMediaError={() => setWebCamEnabled(false)}
		// 				/>
		// 			) : (
		// 				<>
		// 					<WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
		// 					<Button
		// 						variant="ghost"
		// 						onClick={() => setWebCamEnabled(true)}
		// 					>
		// 						Enable Web Cam and Microphone
		// 					</Button>
		// 				</>
		// 			)}
		// 		</div>
		// 	</div>

		// 	<div className="flex justify-end items-end">
		// 		<Link href={`/dashboard/interview/${params.interviewId}/start`}>
		// 			<Button>Start Interview</Button>
		// 		</Link>
		// 	</div>
		// </div>

		// <div className="max-w-6xl mx-auto py-8 space-y-8">
		// 	<CardHeader className="px-0">
		// 		<CardTitle className="text-3xl font-bold tracking-tight">
		// 			Let's Get Started
		// 		</CardTitle>
		// 	</CardHeader>

		// 	<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
		// 		{/* Left Column - Job Details */}
		// 		<div className="space-y-6">
		// 			<Card className="transition-all hover:shadow-md">
		// 				<CardContent className="p-6">
		// 					<div className="space-y-4">
		// 						{jobDetails.map((detail, index) => (
		// 							<div key={index} className="space-y-2">
		// 								<h3 className="text-sm font-medium text-muted-foreground">
		// 									{detail.label}
		// 								</h3>
		// 								<p className="text-lg font-semibold">
		// 									{detail.value || "Not specified"}
		// 								</p>
		// 								{index !== jobDetails.length - 1 && (
		// 									<Separator className="my-2" />
		// 								)}
		// 							</div>
		// 						))}
		// 					</div>
		// 				</CardContent>
		// 			</Card>

		// 			<Alert
		// 				variant="warning"
		// 				className="bg-yellow-50 border-yellow-200"
		// 			>
		// 				<Lightbulb className="h-5 w-5 text-yellow-600" />
		// 				<AlertTitle className="text-yellow-800 font-semibold">
		// 					Important Information
		// 				</AlertTitle>
		// 				<AlertDescription className="text-yellow-700 mt-2">
		// 					{process.env.NEXT_PUBLIC_INFORMATION}
		// 				</AlertDescription>
		// 			</Alert>
		// 		</div>

		// 		{/* Right Column - Webcam */}
		// 		<div className="space-y-4">
		// 			<Card className="overflow-hidden">
		// 				<CardContent className="p-6">
		// 					{webCamEnabled ? (
		// 						<div className="relative rounded-lg overflow-hidden bg-secondary">
		// 							<Webcam
		// 								mirrored={true}
		// 								className="w-full aspect-video object-cover rounded-lg"
		// 								onUserMedia={() =>
		// 									setWebCamEnabled(true)
		// 								}
		// 								onUserMediaError={() =>
		// 									setWebCamEnabled(false)
		// 								}
		// 							/>
		// 						</div>
		// 					) : (
		// 						<div className="space-y-4">
		// 							<div className="bg-secondary/40 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
		// 								<Camera className="h-20 w-20 text-muted-foreground mb-4" />
		// 								<p className="text-muted-foreground text-center">
		// 									Camera is currently disabled
		// 								</p>
		// 							</div>
		// 							<Button
		// 								variant="outline"
		// 								onClick={() => setWebCamEnabled(true)}
		// 								className="w-full"
		// 							>
		// 								Enable Camera and Microphone
		// 							</Button>
		// 						</div>
		// 					)}
		// 				</CardContent>
		// 			</Card>
		// 		</div>
		// 	</div>

		// 	<div className="flex justify-end pt-6">
		// 		<Link href={`/dashboard/interview/${params.interviewId}/start`}>
		// 			<Button
		// 				size="lg"
		// 				className="transition-all hover:scale-105"
		// 			>
		// 				Start Interview
		// 			</Button>
		// 		</Link>
		// 	</div>
		// </div>

		<div className="max-w-6xl mx-auto py-8 space-y-8">
			{/* Header Section */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
					Let's Get Started
				</h1>
				<p className="text-muted-foreground mt-2">
					Complete your setup and begin your interview journey
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Left Column - Job Details */}
				<div className="space-y-6">
					<Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
						<CardContent className="p-6">
							{/* Job Position */}
							<div className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-sm">
								<div className="p-2 bg-primary/10 rounded-lg">
									<Briefcase className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Job Role
									</p>
									<h3 className="font-semibold text-lg">
										{interviewData?.jobPosition ||
											"Not specified"}
									</h3>
								</div>
							</div>

							{/* Job Description */}
							<div className="flex items-center space-x-4 p-4 mt-4 rounded-lg bg-white shadow-sm">
								<div className="p-2 bg-blue-100 rounded-lg">
									<FileText className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Job Description
									</p>
									<h3 className="font-semibold text-lg">
										{interviewData?.jobDesc ||
											"Not specified"}
									</h3>
								</div>
							</div>

							{/* Experience */}
							<div className="flex items-center space-x-4 p-4 mt-4 rounded-lg bg-white shadow-sm">
								<div className="p-2 bg-green-100 rounded-lg">
									<Clock className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Experience Required
									</p>
									<h3 className="font-semibold text-lg">
										{interviewData?.jobExperience ||
											"Not specified"}
									</h3>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Information Alert */}
					<Alert className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
						<div className="flex items-center gap-2">
							<div className="p-2 bg-yellow-200 rounded-full">
								<Lightbulb className="h-4 w-4 text-yellow-700" />
							</div>
							<AlertTitle className="text-yellow-800 font-semibold">
								Important Information
							</AlertTitle>
						</div>
						<AlertDescription className="text-yellow-700 mt-2 ml-10">
							{process.env.NEXT_PUBLIC_INFORMATION}
						</AlertDescription>
					</Alert>
				</div>

				{/* Right Column - Webcam */}
				<div>
					<Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
						<CardContent className="p-6">
							{webCamEnabled ? (
								<div className="relative rounded-xl overflow-hidden bg-secondary">
									<Webcam
										mirrored={true}
										className="w-full aspect-video object-cover rounded-xl"
										onUserMedia={() =>
											setWebCamEnabled(true)
										}
										onUserMediaError={() =>
											setWebCamEnabled(false)
										}
									/>
									<div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
										<p className="text-sm text-center">
											Your camera is ready for the
											interview
										</p>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div className="bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
										<div className="p-4 bg-white/80 rounded-full mb-4 backdrop-blur-sm">
											<Camera className="h-12 w-12 text-primary" />
										</div>
										<p className="text-muted-foreground text-center font-medium">
											Camera access is required for the
											interview
										</p>
										<p className="text-sm text-muted-foreground text-center mt-2">
											Please enable your camera to
											continue
										</p>
									</div>
									<Button
										variant="outline"
										onClick={() => setWebCamEnabled(true)}
										className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white transition-all duration-300"
									>
										Enable Camera and Microphone
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Start Interview Button */}
			<div className="flex justify-end pt-6">
				<Link href={`/dashboard/interview/${params.interviewId}/start`}>
					<Button
						size="lg"
						className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
					>
						Start Interview →
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default Interview;
