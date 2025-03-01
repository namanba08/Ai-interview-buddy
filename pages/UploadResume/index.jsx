"use client";
import React, { useState } from "react";
import "tailwindcss/tailwind.css";

export default function UploadResume() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [recommendedJobs, setRecommendedJobs] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [uploadSuccess, setUploadSuccess] = useState(false);

	// ---------- Drag & Drop Handlers ----------
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleNewFile(e.dataTransfer.files[0]);
		}
	};

	// ---------- Input Change (Fallback) ----------
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			handleNewFile(e.target.files[0]);
		}
	};

	// ---------- File Validation ----------
	const handleNewFile = (file) => {
		// Reset states
		setErrorMessage("");
		setUploadSuccess(false);

		// Check file type
		const validTypes = [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/tiff",
			"image/gif",
			"image/bmp",
		];
		if (!validTypes.includes(file.type)) {
			setErrorMessage("Please upload a PDF or image file only.");
			return;
		}

		// Check file size (5MB limit)
		if (file.size > 5 * 1024 * 1024) {
			setErrorMessage("File size exceeds 5MB limit.");
			return;
		}

		setSelectedFile(file);
	};

	// ---------- Upload & Fetch Logic ----------
	const handleUpload = async () => {
		if (!selectedFile) {
			setErrorMessage("Please select a file first.");
			return;
		}

		// Reset states
		setIsLoading(true);
		setErrorMessage("");
		setUploadSuccess(false);
		setRecommendedJobs([]);

		const formData = new FormData();
		formData.append("resume", selectedFile);

		try {
			const response = await fetch("/api/recommend-jobs", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error || `Server error: ${response.status}`
				);
			}

			const data = await response.json();

			// Show success message briefly
			setUploadSuccess(true);

			// Set recommended jobs
			setRecommendedJobs(data.jobs || []);
			console.log(recommendedJobs)
		} catch (error) {
			console.error("Error uploading resume:", error);
			setErrorMessage(
				error.message || "Failed to process resume. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
				<h1 className="text-2xl font-bold mb-4">
					Job Recommendation App
				</h1>
				<p className="mb-4">Upload your resume (PDF or image format)</p>

				{/* Drag & Drop area */}
				<div
					className={`border-dashed border-2 rounded p-6 flex flex-col items-center justify-center mb-6 transition-colors ${
						dragActive
							? "border-blue-500 bg-blue-50"
							: isLoading
							? "border-gray-300 bg-gray-50 opacity-70"
							: "border-gray-300"
					}`}
					onDragOver={handleDragOver}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					{!isLoading ? (
						<>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-gray-400 mb-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<p className="text-gray-500 mb-2">
								Drag and drop file here
							</p>
							<p className="text-gray-500">or</p>
							<button
								type="button"
								onClick={() =>
									document.getElementById("fileInput").click()
								}
								className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors"
								disabled={isLoading}
							>
								Browse files
							</button>
							<input
								id="fileInput"
								type="file"
								accept="application/pdf,image/*"
								onChange={handleFileChange}
								className="hidden"
								disabled={isLoading}
							/>
							{selectedFile && (
								<div className="mt-4 flex items-center p-2 bg-blue-50 rounded">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-blue-500 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<span className="text-gray-600 text-sm">
										{selectedFile.name} (
										{(selectedFile.size / 1024).toFixed(1)}{" "}
										KB)
									</span>
									<button
										onClick={() => setSelectedFile(null)}
										className="ml-2 text-red-500 hover:text-red-700"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							)}
						</>
					) : (
						<div className="flex flex-col items-center py-4">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
							<p className="text-gray-600">
								Processing your resume...
							</p>
							<p className="text-gray-500 text-sm mt-2">
								This may take a moment
							</p>
						</div>
					)}
				</div>

				{/* Error Message */}
				{errorMessage && (
					<div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
						<div className="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{errorMessage}
						</div>
					</div>
				)}

				{/* Success Message */}
				{uploadSuccess && (
					<div className="mb-4 p-3 bg-green-50 text-green-600 rounded border border-green-200">
						<div className="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Resume processed successfully!
						</div>
					</div>
				)}

				{/* Upload Button */}
				<button
					onClick={handleUpload}
					disabled={!selectedFile || isLoading}
					className={`px-4 py-2 rounded transition-colors ${
						!selectedFile || isLoading
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-purple-500 text-white hover:bg-purple-600"
					}`}
				>
					{isLoading ? (
						<span className="flex items-center">
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Processing...
						</span>
					) : (
						"Analyze Resume"
					)}
				</button>

				{/* Recommended Jobs Table */}
				<h2 className="text-xl font-semibold mt-8 mb-4">
					Recommended Jobs:
				</h2>

				{isLoading && recommendedJobs.length === 0 ? (
					<div className="flex justify-center items-center py-8">
						<div className="flex flex-col items-center">
							<div className="animate-pulse flex space-x-4 w-full max-w-lg">
								<div className="flex-1 space-y-4 py-1">
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="space-y-2">
										<div className="h-4 bg-gray-200 rounded"></div>
										<div className="h-4 bg-gray-200 rounded w-5/6"></div>
									</div>
								</div>
							</div>
							<p className="text-gray-500 mt-4">
								Finding the best job matches...
							</p>
						</div>
					</div>
				) : (
					<div className="overflow-x-auto border border-gray-300 rounded-lg">
						<table className="min-w-full">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Job Title
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Company
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Location
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Match Score
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{recommendedJobs.length === 0 && !isLoading ? (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-6 text-center text-gray-500"
										>
											<div className="flex flex-col items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-10 w-10 text-gray-400 mb-2"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
												<p>
													Upload your resume to see
													job recommendations
												</p>
											</div>
										</td>
									</tr>
								) : (
									recommendedJobs.map((job, index) => (
										<tr
											key={index}
											className="hover:bg-gray-50"
										>
											<td className="px-4 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{job.title}
												</div>
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{job.company}
												</div>
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{job.location}
												</div>
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												{job.similarity && (
													<div className="flex items-center">
														<div className="w-16 bg-gray-200 rounded-full h-2.5">
															<div
																className="bg-green-500 h-2.5 rounded-full"
																style={{
																	width: `${Math.min(
																		job.similarity *
																			100,
																		100
																	)}%`,
																}}
															></div>
														</div>
														<span className="ml-2 text-xs text-gray-500">
															{(
																job.similarity *
																100
															).toFixed(0)}
															%
														</span>
													</div>
												)}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* Status Info */}
				{recommendedJobs.length > 0 && (
					<div className="mt-4 text-sm text-gray-500">
						Found {recommendedJobs.length} job match
						{recommendedJobs.length !== 1 ? "es" : ""}
					</div>
				)}
			</div>
		</div>
	);
}