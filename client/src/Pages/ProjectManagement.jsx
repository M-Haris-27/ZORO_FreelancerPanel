import React, { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [workToSubmit, setWorkToSubmit] = useState("");
    const [submissionLinks, setSubmissionLinks] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActiveProjects();
    }, []);

    const fetchActiveProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/projects/active-projects`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch projects.");
                return;
            }

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError("An error occurred while fetching projects.");
        } finally {
            setLoading(false);
        }
    };

    const handleWorkSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                jobId: selectedProject._id,
                links: submissionLinks.split(",").map((link) => link.trim()),
                notes: workToSubmit,
            };

            const response = await fetch(`${apiUrl}/api/v1/projects/submit`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Failed to submit work.");
                return;
            }

            const data = await response.json();
            console.log("Work submitted successfully:", data);
            fetchActiveProjects(); // Refresh the project list
            setWorkToSubmit("");
            setSubmissionLinks("");
        } catch (err) {
            setError("An error occurred while submitting work.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Project Management</h2>
            </div>

            {/* Active Projects */}
            <div>
                <h3 className="text-lg font-medium mb-4">Active Projects</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className={`bg-gray-100 p-4 rounded-md cursor-pointer ${selectedProject?._id === project._id ? "bg-gray-200" : ""
                                    }`}
                                onClick={() => setSelectedProject(project)}
                            >
                                <h4 className="text-lg font-medium">{project.title}</h4>
                                <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Project */}
            {selectedProject && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">{selectedProject.title}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="work-to-submit" className="block font-medium mb-2">
                                Submit Work Notes:
                            </label>
                            <textarea
                                id="work-to-submit"
                                className="w-full border border-gray-300 rounded-md p-2"
                                rows="3"
                                value={workToSubmit}
                                onChange={(e) => setWorkToSubmit(e.target.value)}
                            ></textarea>
                            <label htmlFor="submission-links" className="block font-medium mt-4 mb-2">
                                Submission Links (comma-separated):
                            </label>
                            <input
                                id="submission-links"
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={submissionLinks}
                                onChange={(e) => setSubmissionLinks(e.target.value)}
                            />
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mt-2"
                                onClick={handleWorkSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Work"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManagement;
