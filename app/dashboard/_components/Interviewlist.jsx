"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

function Interviewlist() {
	const { user } = useUser();
	const [interviewList, setInterviewList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (user) {
			GetInterviewList();
		}
	}, [user]);

	const GetInterviewList = async () => {
		try {
			setLoading(true);
			const result = await db
				.select()
				.from(MockInterview)
				.where(
					eq(
						MockInterview.createdBy,
						user?.primaryEmailAddress?.emailAddress
					)
				)
				.orderBy(desc(MockInterview.id));

			setInterviewList(result);
		} catch (err) {
			setError("Failed to load interviews. Please try again later.");
			console.error("Error fetching interviews:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-teal-600" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (!interviewList?.length) {
		return (
			<div className="text-center py-8">
				<div className="bg-gray-50 rounded-lg p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No interviews yet
					</h3>
					<p className="text-gray-600">
						Start your first mock interview to begin practicing!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{interviewList.map((interview, index) => (
					<InterviewItemCard
						key={interview.id || index}
						interviewInfo={interview}
					/>
				))}
			</div>
		</div>
	);
}

export default Interviewlist;