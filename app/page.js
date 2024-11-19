import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "./dashboard/_components/Header";
import Link from "next/link";

export default function Home() {
	return (
		<div className="main-container relative w-full h-screen overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Professional Workspace"
					layout="fill"
					objectFit="cover"
					className="z-[-1]"
				/>
			</div>

			{/* Start Landing Page */}
			<div className="landing-page flex flex-col min-h-screen  relative z-10">
				<Header />

				{/* Main Content */}
				<div className="content flex items-center justify-center min-h-[calc(100vh-80px)] px-4 container mx-auto md:flex-row flex-col gap-10 md:gap-16">
					{/* Text Section */}
					<div className="info text-center md:text-left mb-4 md:mb-0 max-w-lg">
						<h1 className="text-5xl font-bold text-white leading-snug mb-4">
							Prepare for Your Next Job Interview with AI-Powered
							Mockups
						</h1>
						<p className="text-lg text-slate-300 mb-6 leading-relaxed">
							Practice with simulated AI interviews tailored to
							your job role, tech stack, and years of experience.
							Get real-time feedback to improve!
						</p>
						<p className="text-md text-teal-400 mb-6 leading-relaxed">
							Record your answers, get a detailed analysis, and
							track your progress with each interview session.
						</p>
						<Link href="/dashboard">
							<Button className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all shadow-lg">
								Get Started
							</Button>
						</Link>
					</div>

					{/* Image Section */}
					<div className="image mt-8 md:mt-0 w-full max-w-md mx-auto">
						{/* <Image
							src="https://images.unsplash.com/photo-1521790361543-f645cf042ec4?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							width={600}
							height={400}
							alt="Professional Interview Setup"
							className="w-full h-auto object-contain animate-zoom-in"
						/> */}
					</div>
				</div>
			</div>
			{/* End Landing Page */}
		</div>
	);
}
