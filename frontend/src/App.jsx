import React from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Register from "./pages/Register";
import Notifications from "./pages/Notifications";
import OTP from "./pages/OTP";
import useAuthCheck from "./hooks/useAuthCheck";
import EditInfo from "./components/Profile/EditInfo";
import CreateNew from "./components/CreateNew";

import { RouterProvider, createBrowserRouter } from "react-router";
import { Route, createRoutesFromElements } from "react-router";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "../src/components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import About from "./pages/About";
import Summary from "./pages/Summary";
import Forget from "./pages/Forget";
import Support from "./pages/Support";

const App = () => {
	useAuthCheck();

	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/signup" element={<SignUp />} />
				<Route path="/register" element={<Register />} />
				<Route path="/forgetpassword" element={<Forget />} />
				<Route path="/otp" element={<OTP />} />
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/support" element={<Support />} />

				{/* Protected routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/edit" element={<EditInfo />} />
					<Route path="/notifications" element={<Notifications />} />
					<Route path="/newhisab" element={<CreateNew />} />
					<Route path="/summary/:hisabId" element={<Summary />} />
				</Route>
			</>
		)
	);

	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer theme="dark" />
		</>
	);
};

export default App;
