import React from "react";
import "./Loading.css";
export default function Loading() {
	return (
		<div
			className="flex justify-center center"
			style={{
				backgroundImage: "linear-gradient(0deg, #1B1C1F, #222630)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				width: "100%",
			}}
		>
			<div>
				<div className="flex justify-center">
					<div className="loading fixed top-0 left-0 w-full h-full bg-black z-50 flex justify-center items-center">
						<div className="loading bg-gray-100 dark:bg-black">
							<div className="loading-text">
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">L</span>
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">O</span>
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">A</span>
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">D</span>
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">I</span>
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">N</span>
								<span className="loading-text-words font-bold text-blue-900 dark:text-blue-400">G</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
