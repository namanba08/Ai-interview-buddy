import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { icons } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Ai-Interview Buddy",
	description: "Generated by create next app",
	icons: {
		icon: "/favicon.ico", // /public path
	},
};

export default function RootLayout({ children }) {
  return (
		<ClerkProvider>
			<html lang="en">
				
				<body className={inter.className}>
					<Toaster />
					{children}
				</body>
			</html>
		</ClerkProvider>
  );
}
