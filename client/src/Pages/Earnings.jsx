import React, { useState, useEffect } from 'react';
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Earnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(null);

    const apiUrl = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/earnings/view`, {
                method: 'GET',
                credentials: 'include', // Important for sending cookies/authentication
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch earnings');
            }

            const data = await response.json();
            setTotalEarnings(data.totalEarnings);
            setPendingPayments(data.pendingPayments);

            // Convert date strings to Date objects for proper formatting
            const formattedTransactions = data.transactions?.map(tx => ({
                ...tx,
                date: new Date(tx.date.$date.$numberLong)
            })) || [];
            setTransactions(formattedTransactions);
        } catch (err) {
            setError(err.message);
            toast.error(err.message, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
                transition: Slide,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = () => {
        setShowWithdrawModal(true);
    };

    const handleConfirmWithdraw = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/earnings/withdraw`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: withdrawAmount })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Withdrawal failed');
            }

            const data = await response.json();
            toast.success(data.message || 'Withdrawal successful', {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
                transition: Slide,
            });

            // Refresh earnings after successful withdrawal
            fetchEarnings();
            setShowWithdrawModal(false);
            setWithdrawAmount(null);
        } catch (err) {
            toast.error(err.message, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
                transition: Slide,
            });
        }
    };

    if (loading) {
        return <div className="text-center py-6">Loading...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Earnings</h2>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-medium">Total Earnings</h3>
                    <p className="text-3xl font-bold">{totalEarnings.toLocaleString()}</p>
                </div>
                <div>
                    <h3 className="text-lg font-medium">Pending Payments</h3>
                    <p className="text-3xl font-bold">{pendingPayments.toLocaleString()}</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 border text-left">Date</th>
                                <th className="p-2 border text-right">Amount</th>
                                <th className="p-2 border text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.paymentId}>
                                    <td className="p-2 border">{tx.date.toLocaleDateString()}</td>
                                    <td className="p-2 border text-right">{tx.amount.toLocaleString()}</td>
                                    <td className="p-2 border text-right">{tx.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 text-right">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                    onClick={handleWithdraw}
                >
                    Withdraw Funds
                </button>
            </div>

            {showWithdrawModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium pb-2 text-gray-900">Withdraw Funds</h3>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            className="w-full my-3 border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-md"
                                            placeholder="Enter the amount to withdraw"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                                    onClick={handleConfirmWithdraw}
                                >
                                    Withdraw
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => setShowWithdrawModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Earnings;