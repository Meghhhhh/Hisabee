import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  Wallet,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function EnhancedHisabComponent() {
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hisabsPerPage = 5;

  // Sample data
  const dummyHisabs = [
    {
      id: 1,
      title: 'Goa Trip',
      total_budget: 25000,
      spent: 18500,
      created_by: 'Rahul Sharma',
      created_at: '2025-04-28',
      contributors: ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Singh'],
      transactions: [
        {
          description: 'Hotel Booking',
          amount: 12000,
          paid_by: 'Rahul Sharma',
          date: '2025-04-28',
          category: 'Accommodation',
        },
        {
          description: 'Travel Tickets',
          amount: 4500,
          paid_by: 'Priya Patel',
          date: '2025-04-29',
          category: 'Transportation',
        },
        {
          description: 'Dinner at Beach Shack',
          amount: 2000,
          paid_by: 'Amit Kumar',
          date: '2025-05-01',
          category: 'Food',
        },
      ],
    },
    {
      id: 2,
      title: 'Monthly Apartment Expenses',
      total_budget: 8000,
      spent: 7250,
      created_by: 'Neha Singh',
      created_at: '2025-05-01',
      contributors: ['Neha Singh', 'Rahul Sharma', 'Priya Patel'],
      transactions: [
        {
          description: 'Electricity Bill',
          amount: 3200,
          paid_by: 'Neha Singh',
          date: '2025-05-01',
          category: 'Utilities',
        },
        {
          description: 'Internet Bill',
          amount: 1500,
          paid_by: 'Rahul Sharma',
          date: '2025-05-02',
          category: 'Utilities',
        },
        {
          description: 'Groceries',
          amount: 2550,
          paid_by: 'Priya Patel',
          date: '2025-05-03',
          category: 'Food',
        },
      ],
    },
    {
      id: 3,
      title: 'Birthday Party',
      total_budget: 10000,
      spent: 8750,
      created_by: 'Priya Patel',
      created_at: '2025-05-05',
      contributors: [
        'Priya Patel',
        'Rahul Sharma',
        'Amit Kumar',
        'Neha Singh',
        'Vijay Mehta',
      ],
      transactions: [
        {
          description: 'Cake & Pastries',
          amount: 2500,
          paid_by: 'Priya Patel',
          date: '2025-05-05',
          category: 'Food',
        },
        {
          description: 'Decorations',
          amount: 1750,
          paid_by: 'Neha Singh',
          date: '2025-05-06',
          category: 'Miscellaneous',
        },
        {
          description: 'Venue Booking',
          amount: 4500,
          paid_by: 'Amit Kumar',
          date: '2025-05-06',
          category: 'Venue',
        },
      ],
    },
    {
      id: 4,
      title: 'Office Team Dinner',
      total_budget: 15000,
      spent: 13200,
      created_by: 'Amit Kumar',
      created_at: '2025-05-07',
      contributors: [
        'Amit Kumar',
        'Neha Singh',
        'Vikram Reddy',
        'Anjali Gupta',
      ],
      transactions: [
        {
          description: 'Restaurant Reservation',
          amount: 10000,
          paid_by: 'Amit Kumar',
          date: '2025-05-07',
          category: 'Food',
        },
        {
          description: 'Transportation',
          amount: 2200,
          paid_by: 'Neha Singh',
          date: '2025-05-08',
          category: 'Transportation',
        },
        {
          description: 'Team Gifts',
          amount: 1000,
          paid_by: 'Anjali Gupta',
          date: '2025-05-08',
          category: 'Miscellaneous',
        },
      ],
    },
    {
      id: 5,
      title: 'Weekend Camping Trip',
      total_budget: 12000,
      spent: 9800,
      created_by: 'Vikram Reddy',
      created_at: '2025-05-09',
      contributors: ['Vikram Reddy', 'Rahul Sharma', 'Anjali Gupta'],
      transactions: [
        {
          description: 'Campsite Booking',
          amount: 4500,
          paid_by: 'Vikram Reddy',
          date: '2025-05-09',
          category: 'Accommodation',
        },
        {
          description: 'Equipment Rental',
          amount: 3300,
          paid_by: 'Rahul Sharma',
          date: '2025-05-09',
          category: 'Miscellaneous',
        },
        {
          description: 'Food & Supplies',
          amount: 2000,
          paid_by: 'Anjali Gupta',
          date: '2025-05-10',
          category: 'Food',
        },
      ],
    },
    {
      id: 6,
      title: 'Home Renovation',
      total_budget: 50000,
      spent: 32000,
      created_by: 'Neha Singh',
      created_at: '2025-05-01',
      contributors: ['Neha Singh', 'Rahul Sharma'],
      transactions: [
        {
          description: 'Paint & Supplies',
          amount: 12000,
          paid_by: 'Neha Singh',
          date: '2025-05-01',
          category: 'Miscellaneous',
        },
        {
          description: 'Furniture',
          amount: 15000,
          paid_by: 'Rahul Sharma',
          date: '2025-05-03',
          category: 'Miscellaneous',
        },
        {
          description: 'Labor',
          amount: 5000,
          paid_by: 'Neha Singh',
          date: '2025-05-05',
          category: 'Miscellaneous',
        },
      ],
    },
    {
      id: 7,
      title: 'Book Club Expenses',
      total_budget: 5000,
      spent: 3200,
      created_by: 'Anjali Gupta',
      created_at: '2025-05-10',
      contributors: [
        'Anjali Gupta',
        'Priya Patel',
        'Vikram Reddy',
        'Neha Singh',
      ],
      transactions: [
        {
          description: 'New Books',
          amount: 2000,
          paid_by: 'Anjali Gupta',
          date: '2025-05-10',
          category: 'Miscellaneous',
        },
        {
          description: 'Refreshments',
          amount: 1200,
          paid_by: 'Priya Patel',
          date: '2025-05-10',
          category: 'Food',
        },
      ],
    },
    {
      id: 8,
      title: 'Tech Conference',
      total_budget: 35000,
      spent: 29000,
      created_by: 'Rahul Sharma',
      created_at: '2025-04-25',
      contributors: ['Rahul Sharma', 'Amit Kumar', 'Vikram Reddy'],
      transactions: [
        {
          description: 'Conference Tickets',
          amount: 18000,
          paid_by: 'Rahul Sharma',
          date: '2025-04-25',
          category: 'Miscellaneous',
        },
        {
          description: 'Hotel Stay',
          amount: 8000,
          paid_by: 'Amit Kumar',
          date: '2025-04-26',
          category: 'Accommodation',
        },
        {
          description: 'Daily Expenses',
          amount: 3000,
          paid_by: 'Vikram Reddy',
          date: '2025-04-27',
          category: 'Food',
        },
      ],
    },
  ];

  const toggleHisab = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const calculateProgress = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100);
  };

  // Pagination logic
  const totalPages = Math.ceil(dummyHisabs.length / hisabsPerPage);
  const indexOfLastHisab = currentPage * hisabsPerPage;
  const indexOfFirstHisab = indexOfLastHisab - hisabsPerPage;
  const currentHisabs = dummyHisabs.slice(indexOfFirstHisab, indexOfLastHisab);

  const paginate = pageNumber => {
    // Close any expanded item when changing pages
    setExpandedId(null);
    setCurrentPage(pageNumber);
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = category => {
    const colors = {
      Accommodation: 'bg-purple-500',
      Transportation: 'bg-blue-500',
      Food: 'bg-yellow-500',
      Utilities: 'bg-red-500',
      Miscellaneous: 'bg-gray-500',
      Venue: 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="flex justify-center py-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Hisabs</h1>
            <p className="text-gray-500 mt-1">
              Track and manage your shared expenses
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Plus size={18} />
            <span>New Hisab</span>
          </button>
        </div>

        <div className="space-y-4">
          {currentHisabs.map(hisab => {
            const progressPercentage = calculateProgress(
              hisab.spent,
              hisab.total_budget,
            );
            const progressColor =
              progressPercentage > 90
                ? 'bg-red-500'
                : progressPercentage > 75
                ? 'bg-yellow-500'
                : 'bg-green-500';

            return (
              <div
                key={hisab.id}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
              >
                <div
                  onClick={() => toggleHisab(hisab.id)}
                  className="cursor-pointer hover:bg-gray-50 transition p-5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {hisab.title}
                      </h3>
                      <div className="flex items-center mt-1 text-gray-500 text-sm gap-4">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{hisab.contributors.length} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(hisab.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-800">
                          ₹{hisab.spent.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          / ₹{hisab.total_budget.toLocaleString()}
                        </span>
                      </div>

                      {expandedId === hisab.id ? (
                        <ChevronUp className="text-gray-500 mt-2" />
                      ) : (
                        <ChevronDown className="text-gray-500 mt-2" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`${progressColor} h-2.5 rounded-full`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {expandedId === hisab.id && (
                  <div className="bg-gray-50 p-5 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Created By
                        </div>
                        <div className="font-medium">{hisab.created_by}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Remaining Budget
                        </div>
                        <div className="font-medium text-indigo-600">
                          ₹{(hisab.total_budget - hisab.spent).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">
                        Contributors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hisab.contributors.map((contributor, idx) => (
                          <div
                            key={idx}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                          >
                            {contributor}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800">
                          Transactions
                        </h4>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                          <Plus size={14} />
                          Add Transaction
                        </button>
                      </div>

                      <div className="space-y-3">
                        {hisab.transactions.map((txn, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`${getCategoryColor(
                                  txn.category,
                                )} w-10 h-10 rounded-lg flex items-center justify-center text-white`}
                              >
                                {txn.category === 'Food' && (
                                  <DollarSign size={16} />
                                )}
                                {txn.category === 'Transportation' && (
                                  <TrendingUp size={16} />
                                )}
                                {txn.category === 'Accommodation' && (
                                  <Wallet size={16} />
                                )}
                                {txn.category === 'Utilities' && (
                                  <Wallet size={16} />
                                )}
                                {txn.category === 'Venue' && (
                                  <Users size={16} />
                                )}
                                {txn.category === 'Miscellaneous' && (
                                  <DollarSign size={16} />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {txn.description}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <span>{formatDate(txn.date)}</span>
                                  <span>•</span>
                                  <span>Paid by {txn.paid_by}</span>
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              ₹{txn.amount.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                  currentPage === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                      currentPage === index + 1
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                  currentPage === totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
