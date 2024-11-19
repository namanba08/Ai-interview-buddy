"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";

function Header() {
	const path = usePathname();
	const router = useRouter();
	const { user } = useUser(); // Fetch user details
	const [greeting, setGreeting] = useState("");

	useEffect(() => {
		const hours = new Date().getHours();
		if (hours < 12) setGreeting("Good Morning");
		else if (hours < 18) setGreeting("Good Afternoon");
		else setGreeting("Good Evening");
	}, []);

	function getRoutLink(path) {
		router.push(path);
	}

	return (
		<div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
			{/* Logo */}
			<Image src={"/logo.svg"} width={160} height={50} alt="logo" />

			{/* Navigation */}
			<ul className="hidden md:flex gap-6">
				<li
					onClick={() => getRoutLink("/dashboard")}
					className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
						path == "/dashboard" && "text-primary font-bold"
					}`}
				>
					Dashboard
				</li>
				<li
					onClick={() => getRoutLink("/dashboard/questions")}
					className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
						path == "/dashboard/questions" &&
						"text-primary font-bold"
					}`}
				>
					Questions
				</li>
				<li
					onClick={() => getRoutLink("/dashboard/upgrade")}
					className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
						path == "/dashboard/upgrade" && "text-primary font-bold"
					}`}
				>
					Upgrade
				</li>
				<li
					onClick={() => getRoutLink("/dashboard/how")}
					className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
						path == "/dashboard/how" && "text-primary font-bold"
					}`}
				>
					How it works?
				</li>
			</ul>

			{/* Greeting and User Button */}
			<div className="flex items-center gap-4">
				{user ? (
					<span className="text-sm text-gray-700">
						{greeting}, <strong>{user.firstName || "User"}!</strong>
					</span>
				) : (
					<span className="text-sm text-gray-500">Loading...</span>
				)}
				<UserButton />
			</div>
		</div>
	);
}

export default Header;
