import React, { useState, useEffect } from 'react';
import { FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import axios from 'axios';
const JobManagement = () => {
  // State variables
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [budgetFilter, setBudgetFilter] = useState([0, 5000]);
  const [durationFilter, setDurationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalModal, setProposalModal] = useState(null);

  // Skill options for multi-select
  const skillOptions = [
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'Figma', label: 'Figma' },
    { value: 'Prototyping', label: 'Prototyping' },
    { value: 'UI Design', label: 'UI Design' },
    { value: 'React', label: 'React' },
    { value: 'React Native', label: 'React Native' }
  ];

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/v1/jobs/browse/');
      setJobs(response.data.jobs);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setLoading(false);
      console.error('Error fetching jobs:', err);
    }
  };

  // Search jobs with filters
  const searchJobs = async () => {
    try {
      setLoading(true);
      // Construct query parameters
      const params = new URLSearchParams();

      if (searchTerm) params.append('keyword', searchTerm);
      if (skillsFilter.length > 0) params.append('skills', skillsFilter.join(','));
      if (budgetFilter[1] < 5000) {
        params.append('budget', budgetFilter[1].toString());
      }
      if (durationFilter) params.append('duration', durationFilter);

      const response = await axios.get(`http://localhost:4000/api/v1/jobs/search?${params.toString()}`);
      setJobs(response.data.jobs);
      setLoading(false);
    } catch (err) {
      setError('Failed to search jobs');
      setLoading(false);
      console.error('Error searching jobs:', err);
    }
  };

  const submitProposal = async (jobId) => {
    try {
      const { coverLetter, expectedBudget } = proposalModal;

      if (!coverLetter || !expectedBudget) {
        alert("Please fill in all fields.");
        return;
      }

      const response = await fetch("http://localhost:4000/api/v1/jobs/proposals", {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          coverLetter,
          expectedBudget,
        }),
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit proposal");
        return;
      }

      // On success, close the modal and give feedback
      setProposalModal(null);
      alert("Proposal submitted successfully!");
      fetchJobs(); // Refresh the job list to reflect any changes if needed
    } catch (err) {
      console.error("Error submitting proposal:", err);
      setError("An error occurred while submitting the proposal. Please try again.");
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle skills filter
  const handleSkillsFilter = (selectedOptions) => {
    setSkillsFilter(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  // Render proposal modal
  const renderProposalModal = (job) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Submit Proposal for {job.title}</h2>
          <textarea
            placeholder="Write your cover letter..."
            className="w-full border p-2 mb-4 rounded"
            rows="4"
            value={proposalModal?.coverLetter || ""}
            onChange={(e) =>
              setProposalModal({
                ...proposalModal,
                coverLetter: e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="Expected Budget"
            className="w-full border p-2 mb-4 rounded"
            value={proposalModal?.expectedBudget || ""}
            onChange={(e) =>
              setProposalModal({
                ...proposalModal,
                expectedBudget: parseInt(e.target.value, 10),
              })
            }
          />
          <div className="flex justify-between">
            <button
              onClick={() => submitProposal(job._id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit Proposal
            </button>
            <button
              onClick={() => setProposalModal(null)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <h1 className="text-2xl font-bold mb-6">Job Management</h1>

      {/* Job Search */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearch}
          className="border-gray-300 text-gray-800 p-2 rounded-md flex-1 mr-2"
        />
        <button
          onClick={searchJobs}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="font-medium">Skills:</label>
            <Select
              isMulti
              options={skillOptions}
              onChange={handleSkillsFilter}
              className="text-gray-800"
            />
          </div>
          <div>
            <label className="font-medium">Budget:</label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="5000"
                value={budgetFilter[1]}
                onChange={(e) => setBudgetFilter([0, parseInt(e.target.value)])}
                className="w-full"
              />
              <span className="ml-2 flex-shrink-0">${budgetFilter[0]} - ${budgetFilter[1]}</span>
            </div>
          </div>
          <div>
            <label className="font-medium">Duration:</label>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="border-gray-300 text-gray-800 p-2 rounded-md w-full"
            >
              <option value="">All</option>
              <option value="short-term">Short-term</option>
              <option value="long-term">Long-term</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-xl">Loading jobs...</div>
      )}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {/* Job Listings */}
      <div>
        <h3 className="text-xl font-bold mb-4">Available Jobs</h3>
        {!loading && jobs.length === 0 && (
          <div className="text-center text-gray-500">No jobs found</div>
        )}
        {jobs.map(job => (
          <div
            key={job._id}
            className="bg-white p-4 mb-4 rounded-md shadow-md"
          >
            <h4 className="text-lg font-bold">{job.title}</h4>
            <p className="mb-2">{job.description}</p>
            <p className="mb-2">
              Skills Required: {job.skillsRequired.join(', ')}
            </p>
            <p className="mb-2">Budget: ${job.budget}</p>
            <p className="mb-2">Duration: {job.duration}</p>
            <p className="mb-2">
              Status:{' '}
              {job.status === 'in-progress' ? (
                <span className="text-yellow-500">
                  <FaSpinner className="inline-block mr-2" />
                  In Progress
                </span>
              ) : job.status === 'open' ? (
                <span className="text-green-500">
                  <FaCheck className="inline-block mr-2" />
                  Open
                </span>
              ) : (
                <span className="text-red-500">
                  <FaTimes className="inline-block mr-2" />
                  Completed
                </span>
              )}{' '}
              | Approval Status: {job.approvalStatus}
            </p>
            <button
              onClick={() => setProposalModal({ jobId: job._id })}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Proposal Modal */}
      {proposalModal && renderProposalModal(
        jobs.find(job => job._id === proposalModal.jobId)
      )}
    </div>
  );
};

export default JobManagement;