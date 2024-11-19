// import { Lightbulb, Volume2 } from 'lucide-react'
// import React from 'react'

// function QuestionsSections({activeQuestionIndex,mockInterViewQuestion}) {
    
//    const textToSpeach=(text)=>{
//     if('speechSynthesis' in window){
//       const speech= new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(speech)
//     }else{
//       alert('Sorry, Your browser does not support text to speech (recommended browser Chrome)')
//     }

//    }
//   return mockInterViewQuestion&&(
//     <div className='p-5 border rounded-lg my-10'>
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center'>
//             {mockInterViewQuestion&&mockInterViewQuestion?.map((question,index)=>(
//                  <h2 key={index+1} className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index&&'!bg-primary text-white'}`}>Question #{index+1}</h2>
//             ))}
//         </div>
//         <h2 className='my-5 text-sm md:text-lg'>
//           <strong>Q.</strong>  {mockInterViewQuestion[activeQuestionIndex]?.question}
//         </h2>
//         <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterViewQuestion[activeQuestionIndex]?.question)} />
//         <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
//             <h2 className='flex gap-2 items-center text-blue-700'>
//                 <Lightbulb/>
//                 <strong>Note:</strong>
//             </h2>
//             <h2 className='my-2 text-sm text-blue-700'>
//                 {process.env.NEXT_PUBLIC_QUESTION_NOTE}
//             </h2>
//         </div>
//     </div>
//   )
// }

// export default QuestionsSections

import React from "react";
import { Lightbulb, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const QuestionsSections = ({ activeQuestionIndex, mockInterViewQuestion }) => {
	const textToSpeech = (text) => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel(); // Cancel any ongoing speech
			const speech = new SpeechSynthesisUtterance(text);
			window.speechSynthesis.speak(speech);
		} else {
			alert(
				"Text-to-speech is not supported in your browser. Please use Chrome for the best experience."
			);
		}
	};

	if (!mockInterViewQuestion) return null;

	const currentQuestion = mockInterViewQuestion[activeQuestionIndex];

	return (
		<Card className="w-full my-8 shadow-md">
			<CardContent className="p-6">
				{/* Question Navigation */}
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
					{mockInterViewQuestion.map((_, index) => (
						<Button
							key={index}
							variant={
								activeQuestionIndex === index
									? "default"
									: "secondary"
							}
							className={`
                rounded-full text-xs md:text-sm transition-all
                ${
					activeQuestionIndex === index
						? "shadow-lg scale-105"
						: "hover:scale-105"
				}
              `}
							aria-label={`Question ${index + 1}`}
							aria-current={
								activeQuestionIndex === index ? "true" : "false"
							}
						>
							Q{index + 1}
						</Button>
					))}
				</div>

				{/* Current Question */}
				<div className="space-y-4 mb-8">
					<div className="flex items-start justify-between gap-4">
						<h2 className="text-lg md:text-xl font-semibold leading-relaxed">
							<span className="text-primary">Q.</span>{" "}
							{currentQuestion?.question}
						</h2>
						<Button
							variant="ghost"
							size="icon"
							className="flex-shrink-0 hover:bg-secondary/80 transition-colors"
							onClick={() =>
								textToSpeech(currentQuestion?.question)
							}
							aria-label="Listen to question"
							title="Listen to question"
						>
							<Volume2 className="h-5 w-5" />
						</Button>
					</div>
				</div>

				{/* Note Section */}
				<Alert className="mt-8 bg-blue-50 border-blue-200">
					<div className="flex items-center gap-2 text-blue-700 mb-2">
						<Lightbulb className="h-5 w-5" />
						<h3 className="font-semibold">Note</h3>
					</div>
					<AlertDescription className="text-blue-700/90 text-sm">
						{process.env.NEXT_PUBLIC_QUESTION_NOTE}
					</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
};

export default QuestionsSections;