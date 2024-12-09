import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupStart, signupSuccess, signupFailure } from "../features/user/userSlice";

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const { loading, error } = useSelector((state) => state.user);
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        dispatch(signupStart());

        const { firstName, lastName, email, password } = formData;

        if (!firstName || !lastName || !email || !password) {
            dispatch(signupFailure("Please fill the form completely."));
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/auth/register-freelancer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.status !== 200) {
                const error = await response.json();
                dispatch(signupFailure(error.message));
                return;
            }

            const data = await response.json();
            dispatch(signupSuccess(data.user));
            toast.success(`Welcome ${data.user.firstName}! Your account has been created.`, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
                transition: Slide,
            });
            navigate("/login");
        } catch (err) {
            dispatch(signupFailure("Server error occurred. Please try again later."));
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-[#0B1724] shadow rounded sm:w-full md:w-full max-w-[500px] p-8 flex-shrink-0">
                <p className="text-2xl font-medium text-center text-[#cae962]">Sign Up for an account</p>
                <p className="text-sm mt-4 text-center text-white">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-300 hover:underline">
                        Log In
                    </Link>
                </p>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="text-sm font-medium text-[#cae962]">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            onChange={handleChange}
                            className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm font-medium text-[#cae962]">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            onChange={handleChange}
                            className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm font-medium text-[#cae962]">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-sm font-medium text-[#cae962]">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
                        />
                    </div>
                    {error && <p className="text-center text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#cae962] text-[#0B1724] font-semibold rounded hover:bg-white transition"
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </section>
    );
}
