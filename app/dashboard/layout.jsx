import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

function DashboardLayout({ children }) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			{/* Container for children with responsive margins */}
			<div className="w-full">
				{children}
			</div>
			<Footer />
		</div>
	);
}

export default DashboardLayout;
