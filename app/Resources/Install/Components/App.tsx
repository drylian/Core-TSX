import React, { useEffect, useState } from "react";
import Loading from "./Loading";

function App() {
	return (
		<>
			<React.Suspense fallback={<Loading />}>
				<i className="bx bx-menu p-5" style={{ fontSize: "100px" }} />
                Eu sou uma batatas
			</React.Suspense>
		</>
	);
}

export default App;
