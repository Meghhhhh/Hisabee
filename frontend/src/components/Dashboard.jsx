import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
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
  Mail,
  ArrowLeft,
  Check,
  AlertCircle,
  Trash2, // Add Trash2 icon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHisabs,
  updateHisab,
  deleteHisab,
} from '../../store/slice/hisabSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EnhancedHisabComponent() {
  // State and logic from your original
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [spentMap, setSpentMap] = useState({});
  const hisabsPerPage = 5;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    paid_by: '',
    category: '',
  });
  const [selectedHisabId, setSelectedHisabId] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch hisabs
  useEffect(() => {
    setLoading(true);
    const fetchHisabs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/hisabs`,
          { withCredentials: true },
        );
        dispatch(setHisabs(res.data));
      } catch (error) {
        setError('Failed to fetch hisabs. Please try again.');
        console.error('Error fetching hisabs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHisabs();
  }, [dispatch]);

  // Calculate spent for each hisab
  const hisabs = useSelector(state => state.hisabs.hisabs);
  useEffect(() => {
    const newSpentMap = {};
    hisabs.forEach(hisab => {
      newSpentMap[hisab.id] = (hisab.transactions || []).reduce(
        (sum, txn) => sum + (parseFloat(txn.amount) || 0),
        0,
      );
    });
    setSpentMap(newSpentMap);
  }, [hisabs]);

  // Contributors for selected modal
  const contributors = selectedHisabId
    ? hisabs.find(h => h.id === selectedHisabId)?.contributors || []
    : [];

  // Toggle expanded state
  const toggleHisab = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Progress bar calculation
  const calculateProgress = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100);
  };

  // Pagination logic
  const totalPages = Math.ceil(hisabs.length / hisabsPerPage);
  const indexOfLastHisab = currentPage * hisabsPerPage;
  const indexOfFirstHisab = indexOfLastHisab - hisabsPerPage;
  const currentHisabs = hisabs.slice(indexOfFirstHisab, indexOfLastHisab);

  const paginate = pageNumber => {
    setExpandedId(null);
    setCurrentPage(pageNumber);
  };

  // Format date with Indian locale
  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Category color mapping
  const getCategoryColor = category => {
    const colors = {
      Accommodation: 'bg-purple-500',
      Transportation: 'bg-blue-400',
      Food: 'bg-yellow-400',
      Utilities: 'bg-red-400',
      Miscellaneous: 'bg-gray-400',
      Venue: 'bg-pink-400',
    };
    return colors[category] || 'bg-gray-400';
  };

  // Responsive grid columns
  const gridCols =
    expandedId !== null
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl inline-block">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40 flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-white/60 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text">
              Loading your hisabs...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Delete hisab handler
  const handleDeleteHisab = async id => {
    setError('');
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_URL}/hisabs/${id}`,
        { withCredentials: true },
      );
      dispatch(deleteHisab(id));
      toast.success('Hisab deleted successfully');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to delete hisab. Please try again.',
      );
      setTimeout(() => setError(''), 4000);
    }
  };

  // Main component
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Dynamic animated background (Like ForgetPassword) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pb-8 px-4 sm:px-6 md:px-8 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mt-6 sm:mt-8 mb-8 flex flex-col sm:flex-row  items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Your Hisabs
            </h1>
            <p className="text-gray-300">
              Track and manage your shared expenses
            </p>
          </div>
          <Link
            to="/newhisab"
            className="px-3 py-3 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus size={18} />
            <span>New Hisab</span>
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="backdrop-blur-sm bg-red-500/10 border border-red-400/30 rounded-2xl p-3 mb-6 flex items-center gap-2 text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Hisab Cards */}
        <div className={`${gridCols} gap-4 mb-8`}>
          {currentHisabs.map(hisab => {
            const progress = calculateProgress(
              spentMap[hisab.id] || 0,
              hisab.total_budget,
            );
            const progressColor =
              progress > 90
                ? 'bg-red-400'
                : progress > 75
                ? 'bg-yellow-400'
                : 'bg-green-400';
            const remaining = hisab.total_budget - (spentMap[hisab.id] || 0);

            return (
              <div
                key={hisab.id}
                className="backdrop-blur-sm bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
              >
                <div
                  onClick={() => toggleHisab(hisab.id)}
                  className="cursor-pointer hover:bg-white/5 transition p-5 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {hisab.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-300 gap-2 sm:gap-4">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{hisab.contributors?.length} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(hisab.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-base sm:text-lg font-medium text-white">
                        ₹{(spentMap[hisab.id] || 0).toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-300">
                        / ₹{hisab.total_budget?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              'Are you sure you want to delete this hisab?',
                            )
                          ) {
                            handleDeleteHisab(hisab.id);
                          }
                        }}
                        className="p-2 rounded-full hover:bg-red-500/20 transition"
                        title="Delete Hisab"
                      >
                        <Trash2 className="text-red-400" size={20} />
                      </button>
                      {expandedId === hisab.id ? (
                        <ChevronUp className="text-gray-300" />
                      ) : (
                        <ChevronDown className="text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-400/10 rounded-full h-2">
                    <div
                      className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                {/* Expanded content */}
                {expandedId === hisab.id && (
                  <div className="border-t border-white/10 px-5 py-4 bg-gray-400/5 backdrop-blur-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-indigo-400/10">
                        <div className="text-xs sm:text-sm font-medium text-gray-300 mb-1">
                          Created By
                        </div>
                        <div className="font-medium text-white">
                          {hisab.created_by}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-2xl border border-blue-400/10">
                        <div className="text-xs sm:text-sm font-medium text-gray-300 mb-1">
                          Remaining Budget
                        </div>
                        <div className="font-medium text-cyan-400">
                          ₹{remaining < 0 ? 0 : remaining.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-300 mb-2 text-sm sm:text-base">
                        Contributors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hisab.contributors.map(contributor => (
                          <div
                            key={contributor.user_id}
                            className="px-2 py-1 bg-indigo-500/20 text-indigo-200 rounded-full text-xs sm:text-sm"
                          >
                            {contributor.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
                        <h4 className="font-medium text-gray-300 text-sm sm:text-base">
                          Transactions
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedHisabId(hisab.id);
                              setShowModal(true);
                              setTransactionForm({
                                amount: '',
                                description: '',
                                paid_by: 'CONTRIBUTION',
                                category: '',
                              });
                            }}
                            className="flex items-center gap-1 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-400/40 to-purple-400/40 border border-indigo-300/30 rounded-xl text-white hover:from-indigo-400/60 hover:to-purple-400/60 transition-all duration-300 transform hover:scale-105"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Add Tx</span>
                          </button>
                          <button
                            onClick={() => navigate(`/summary/${hisab.id}`)}
                            className="flex items-center gap-1 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 bg-gradient-to-r from-green-400/40 to-emerald-400/40 border border-green-300/30 rounded-xl text-white hover:from-green-400/60 hover:to-emerald-400/60 transition-all duration-300 transform hover:scale-105"
                          >
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Summary</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {(() => {
                        const txns = hisab.transactions || [];
                        const showAll = showAllTransactions[hisab.id];
                        const visibleTxns = showAll ? txns : txns.slice(0, 3);
                        return (
                          <>
                            {visibleTxns.length > 0 ? (
                              visibleTxns.map((txn, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div
                                      className={`${getCategoryColor(
                                        txn.category,
                                      )} w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white`}
                                    >
                                      {txn.category === 'Food' && (
                                        <DollarSign size={14} />
                                      )}
                                      {txn.category === 'Transportation' && (
                                        <TrendingUp size={14} />
                                      )}
                                      {txn.category === 'Accommodation' && (
                                        <Wallet size={14} />
                                      )}
                                      {txn.category === 'Utilities' && (
                                        <Wallet size={14} />
                                      )}
                                      {txn.category === 'Venue' && (
                                        <Users size={14} />
                                      )}
                                      {txn.category === 'Miscellaneous' && (
                                        <DollarSign size={14} />
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm sm:text-base text-white">
                                        {txn.description}
                                      </div>
                                      <div className="text-xs sm:text-sm text-gray-300 flex flex-wrap items-center gap-1 sm:gap-2">
                                        <span>{formatDate(txn.date)}</span>
                                        <span>•</span>
                                        <span>Paid by {txn.paid_by}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="font-semibold text-sm sm:text-base text-green-400">
                                    ₹{txn.amount?.toLocaleString()}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                  <DollarSign className="w-4 h-4 text-white" />
                                </div>
                                <div className="font-medium text-sm sm:text-base text-gray-300">
                                  No transactions yet
                                </div>
                              </div>
                            )}
                            {txns.length > 3 && (
                              <button
                                onClick={() =>
                                  setShowAllTransactions(prev => ({
                                    ...prev,
                                    [hisab.id]: !prev[hisab.id],
                                  }))
                                }
                                className="mt-2 text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
                              >
                                {showAll ? 'Show Less' : 'Show All'}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-center items-center gap-1 sm:gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 1
                    ? 'border-gray-600/30 text-gray-500 cursor-not-allowed'
                    : 'border-gray-400/20 text-white hover:bg-white/10'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                      currentPage === index + 1
                        ? 'border-indigo-400 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 text-white'
                        : 'border-gray-400/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  currentPage === totalPages
                    ? 'border-gray-600/30 text-gray-500 cursor-not-allowed'
                    : 'border-gray-400/20 text-white hover:bg-white/10'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modern Glass Card Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/50">
          <div
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-6 md:p-7 w-full max-w-xs sm:max-w-sm md:max-w-md mx-4 transition-all duration-300 transform animate-pop-in"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-5 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Add Transaction
            </h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setError('');
                try {
                  const amount = parseFloat(transactionForm.amount);
                  if (!amount) throw new Error('Amount must be a number.');
                  const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_API_URL}/transactions`,
                    {
                      hisab_id: selectedHisabId,
                      paid_by:
                        transactionForm.paid_by === 'CONTRIBUTION'
                          ? null
                          : transactionForm.paid_by,
                      amount: amount,
                      description: transactionForm.description,
                      category: transactionForm.category,
                      paid_through_contribution:
                        transactionForm.paid_by === 'CONTRIBUTION'
                          ? true
                          : false,
                    },
                    { withCredentials: true },
                  );
                  dispatch(
                    updateHisab({
                      id: selectedHisabId,
                      transactions: res.data,
                    }),
                  );
                  setSpentMap(prev => ({
                    ...prev,
                    [selectedHisabId]: (prev[selectedHisabId] || 0) + amount,
                  }));
                  setShowModal(false);
                  setTransactionForm({
                    amount: '',
                    description: '',
                    paid_by: 'CONTRIBUTION',
                    category: '',
                  });
                } catch (err) {
                  setError(
                    err.message ||
                      'Failed to add transaction. Please try again.',
                  );
                  setTimeout(() => setError(''), 4000);
                }
              }}
            >
              {error && (
                <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                  <AlertCircle size={18} />
                  <span className="text-xs sm:text-sm">{error}</span>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-transparent transition-all"
                  placeholder="₹0.00"
                  value={transactionForm.amount}
                  onChange={e =>
                    setTransactionForm({
                      ...transactionForm,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-transparent transition-all"
                  placeholder="Short description"
                  value={transactionForm.description}
                  onChange={e =>
                    setTransactionForm({
                      ...transactionForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-transparent transition-all"
                  value={transactionForm.category}
                  onChange={e =>
                    setTransactionForm({
                      ...transactionForm,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled className="bg-white/5 text-white">
                    Select a category
                  </option>
                  <option
                    value="Accommodation"
                    className="bg-white/5 text-white"
                  >
                    Accommodation
                  </option>
                  <option
                    value="Transportation"
                    className="bg-white/5 text-white"
                  >
                    Transportation
                  </option>
                  <option value="Food" className="bg-white/5 text-white">
                    Food
                  </option>
                  <option value="Utilities" className="bg-white/5 text-white">
                    Utilities
                  </option>
                  <option value="Venue" className="bg-white/5 text-white">
                    Venue
                  </option>
                  <option
                    value="Miscellaneous"
                    className="bg-white/5 text-white"
                  >
                    Miscellaneous
                  </option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Paid By
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-transparent transition-all"
                  value={transactionForm.paid_by}
                  onChange={e =>
                    setTransactionForm({
                      ...transactionForm,
                      paid_by: e.target.value,
                    })
                  }
                  required
                >
                  <option
                    value="CONTRIBUTION"
                    className="bg-white/5 text-white"
                  >
                    From Contribution (Initial Pool)
                  </option>
                  {contributors.map(contributor => (
                    <option
                      key={contributor.user_id}
                      value={contributor.user_id}
                      className="bg-white/5 text-white"
                    >
                      {contributor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-400/20 rounded-xl text-white hover:from-gray-600/20 hover:to-gray-700/20 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
