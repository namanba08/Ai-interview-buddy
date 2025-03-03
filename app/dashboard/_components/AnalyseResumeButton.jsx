import React from "react";
import {useRouter} from 'next/navigation'
const ResumeAnalysisButton = () => {
    const router = useRouter();

	return (
		<div className="relative">
			{/* Animated Arrow */}
			<div className=" -right-2 -top-10 animate-bounce">
				<div className="flex items-center">
					<div className="text-blue-500 font-bold mr-2">
						Try this!
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-blue-500 rotate-45"
					>
						<line x1="12" y1="5" x2="12" y2="19"></line>
						<polyline points="19 12 12 19 5 12"></polyline>
					</svg>
				</div>
			</div>

			{/* Button Component */}
			<button
				type="button"
				className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 px-5 font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed"
				onClick={() => router.push("/UploadResume")}
				aria-label="Analyze your resume"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
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
				Analyze Resume
			</button>
		</div>
	);
};

export default ResumeAnalysisButton;
