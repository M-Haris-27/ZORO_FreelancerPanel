import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RatingsAndFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [response, setResponse] = useState("");
    const apiUrl = import.meta.env.VITE_APP_API_URL; // Update this with your API URL

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/reviews/history`, {
                    method: "GET",
                    credentials: "include", // Include cookies if required
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch feedback");
                }

                const data = await response.json();

                // Transform response structure for the component
                const transformedFeedback = data.map((item) => ({
                    id: item._id,
                    clientName: `${item.clientId.firstName} ${item.clientId.lastName}`,
                    rating: item.rating,
                    feedback: item.feedback, // Map `feedback` directly
                    response: "", // Placeholder for response if it exists
                }));

                setFeedback(transformedFeedback);
                toast.success("Feedback fetched successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            } catch (error) {
                console.error("Error fetching feedback:", error);
                toast.error("Failed to fetch feedback. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        };

        fetchFeedback();
    }, [apiUrl]);

    const handleFeedbackSelect = (feedbackItem) => {
        setSelectedFeedback(feedbackItem);
    };

    const handleResponseSubmit = async () => {
        if (!selectedFeedback) {
            toast.warn("Please select a feedback to respond to!", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }

        try {
            const response = await fetch(
                `${apiUrl}/api/reviews/respond/${selectedFeedback.id}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ response }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit response");
            }

            // Update the local state with the submitted response
            setFeedback((prevFeedback) =>
                prevFeedback.map((item) =>
                    item.id === selectedFeedback.id
                        ? { ...item, response } // Add the response to the selected feedback
                        : item
                )
            );

            setResponse("");
            toast.success("Response submitted successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        } catch (error) {
            console.error("Error submitting response:", error);
            toast.error("Failed to submit response. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Ratings & Feedback</h2>
            </div>

            {/* Feedback List */}
            <div>
                <h3 className="text-lg font-medium mb-4">Feedback</h3>
                <div className="space-y-4">
                    {feedback.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-gray-100 p-4 rounded-md cursor-pointer ${selectedFeedback?.id === item.id ? "bg-gray-200" : ""
                                }`}
                            onClick={() => handleFeedbackSelect(item)}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-medium">
                                    {item.clientName || "Anonymous"}
                                </h4>
                                <div className="text-yellow-500 font-medium">
                                    {item.rating.toFixed(1)}
                                </div>
                            </div>
                            <p className="text-gray-700">
                                {item.feedback || "No feedback provided."}
                            </p>
                            {item.response && (
                                <div className="mt-2 bg-green-100 text-green-800 p-2 rounded-md">
                                    <p className="font-medium">Your Response:</p>
                                    <p>{item.response}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Feedback */}
            {selectedFeedback && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Respond to Feedback</h3>
                    <div>
                        <label
                            htmlFor="feedback-response"
                            className="block font-medium mb-2"
                        >
                            Your Response:
                        </label>
                        <textarea
                            id="feedback-response"
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows="3"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                        ></textarea>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mt-2"
                            onClick={handleResponseSubmit}
                        >
                            Submit Response
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingsAndFeedback;
