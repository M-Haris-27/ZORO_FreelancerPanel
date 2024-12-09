import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaDollarSign, FaBell, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

// Dummy data for initial implementation
const dummyActiveProjects = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    client: 'TechCorp Solutions',
    progress: 65,
    deadline: '2024-02-15',
    earnings: 1200
  },
  {
    id: '2',
    title: 'Mobile App UI/UX Design',
    client: 'StartUp Innovations',
    progress: 40,
    deadline: '2024-03-01',
    earnings: 950
  }
];

const dummyNotifications = [
  {
    id: '1',
    type: 'project',
    message: 'New milestone approved for E-commerce Website project',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'payment',
    message: 'Payment of $1200 received for Mobile App project',
    timestamp: '1 day ago'
  }
];

const FreelancerDashboard = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Placeholder for actual API calls
    // In a real implementation, replace with actual API endpoints
    const fetchDashboardData = async () => {
      try {
        // Simulating API calls with dummy data
        setActiveProjects(dummyActiveProjects);
        setNotifications(dummyNotifications);

        // Calculate total earnings
        const totalEarnings = dummyActiveProjects.reduce((sum, project) => sum + project.earnings, 0);
        setEarnings(totalEarnings);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-8 text-gray-800">
        <div className="text-center text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen p-8 text-gray-800">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Freelancer Dashboard</h1>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Active Projects Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <FaProjectDiagram className="text-blue-500 text-3xl" />
            <span className="text-2xl font-bold">{activeProjects.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Active Projects</h3>
          <p className="text-gray-500">Currently working on</p>
        </div>

        {/* Earnings Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <FaDollarSign className="text-green-500 text-3xl" />
            <span className="text-2xl font-bold">${earnings.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-gray-500">This month</p>
        </div>

        {/* Notifications Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <FaBell className="text-yellow-500 text-3xl" />
            <span className="text-2xl font-bold">{notifications.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-gray-500">Unread updates</p>
        </div>

        {/* Performance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-purple-500 text-3xl" />
            <span className="text-2xl font-bold">85%</span>
          </div>
          <h3 className="text-lg font-semibold">Performance</h3>
          <p className="text-gray-500">Project success rate</p>
        </div>
      </div>

      {/* Active Projects Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeProjects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <span className="text-gray-500">{project.client}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Project Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-gray-500">Deadline</span>
                  <p>{project.deadline}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Earnings</span>
                  <p className="font-bold text-green-600">${project.earnings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Notifications</h2>
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className="bg-white p-4 rounded-lg shadow-md flex items-center"
            >
              <div className="mr-4">
                {notification.type === 'project' ? (
                  <FaProjectDiagram className="text-blue-500" />
                ) : notification.type === 'payment' ? (
                  <FaDollarSign className="text-green-500" />
                ) : (
                  <FaBell className="text-yellow-500" />
                )}
              </div>
              <div className="flex-grow">
                <p>{notification.message}</p>
                <span className="text-gray-500 text-sm">
                  {notification.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;