import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx"; // Import the Signup page
import Error from "./Components/Error.jsx";
import DefaultLayout from "./Components/DefaultLayout.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store.js";
import ProtectedRoute from "./Auth_Components/ProtectedRoute.jsx";
import LoginDisabled from "./Components/LoginDisabled.jsx";
import { CssBaseline } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import AdminDashboard from "./Pages/Dashboard.jsx";
import JobManagementPage from "./Pages/JobManagement.jsx";
import ProfileManagement from "./Pages/ProfileManagement.jsx";
import Earnings from "./Pages/Earnings.jsx";
import ProjectManagement from "./Pages/ProjectManagement.jsx";
import RatingsAndFeedback from "./Pages/Feedback.jsx";
import HomePage from "./Pages/Home.jsx";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    path: "/",
    errorElement: <Error />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        path: "/",
        children: [
          {
            element: <AdminDashboard />,
            path: "/dashboard",
          },
          {
            element: <ProfileManagement />,
            path: "/profile-management",
          },
          {
            element: <JobManagementPage />,
            path: "/job-search",
          },
          {
            element: <Earnings />,
            path: "/earnings",
          },
          {
            element: <ProjectManagement />,
            path: "/projects",
          },
          {
            element: <RatingsAndFeedback />,
            path: "/ratings",
          },
        ],
      },
      {
        element: <LoginDisabled />,
        children: [
          {
            element: <Login />,
            path: "/login",
          },
        ],
      },
      {
        path: "/signup",
        element: <Signup />, // Add the Signup component here
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </HelmetProvider>
    </PersistGate>
  </Provider>
);




// // Submit job proposal
// const submitProposal = async (jobId) => {
//   try {
//     const proposalData = {
//       jobId: jobId,
//       coverLetter: proposalModal.coverLetter,
//       expectedBudget: proposalModal.expectedBudget
//     };

//     const response = await axios.post(
//       `http://localhost:4000/api/v1/jobs/proposals`,
//       proposalData
//     );

//     alert('Proposal submitted successfully!');
//     setProposalModal(null);
//   } catch (err) {
//     alert('Failed to submit proposal');
//     console.error('Error submitting proposal:', err);
//   }
// };