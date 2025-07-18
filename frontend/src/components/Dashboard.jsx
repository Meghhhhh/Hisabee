import { useState, useEffect } from 'react';
import { Link } from 'react-router';
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
import { useDispatch, useSelector } from 'react-redux';
import { setHisabs } from '../../store/slice/hisabSlice.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EnhancedHisabComponent() {
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [spentMap, setSpentMap] = useState({});
  const hisabsPerPage = 5;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    paid_by: '',
    category: '',
  });
  const [selectedHisabId, setSelectedHisabId] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchHisabs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/hisabs`,
          {
            withCredentials: true,
          },
        );
        dispatch(setHisabs(res.data));
      } catch (error) {
        console.error('Error fetching hisabs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHisabs();
  }, [dispatch]);

  const hisabs = useSelector(state => state.hisabs.hisabs);
  useEffect(() => {
    // Calculate spent for each hisab after hisabs are loaded
    const newSpentMap = {};
    hisabs.forEach(hisab => {
      newSpentMap[hisab.id] = (hisab.transactions || []).reduce(
        (sum, txn) => sum + (parseFloat(txn.amount) || 0),
        0,
      );
    });
    setSpentMap(newSpentMap);
  }, [hisabs]);

  const contributors = selectedHisabId
    ? hisabs.find(h => h.id === selectedHisabId)?.contributors || []
    : [];

  const toggleHisab = id => {
    setExpandedId(expandedId === id ? null : id);
  };

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

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  ) : (
    <>
      <div className="flex justify-center py-12 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your hisabs</h1>
              <p className="text-gray-500 mt-1">
                Track and manage your shared expenses
              </p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <Plus size={18} />
              <Link to={'/newhisab'}>
                <span>New Hisab</span>
              </Link>
            </button>
          </div>

          <div className="space-y-4">
            {currentHisabs.map(hisab => {
              const progressPercentage = calculateProgress(
                spentMap[hisab.id] || 0,
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
                            <span>{hisab.contributors?.length} members</span>
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
                            ₹{(spentMap[hisab.id] || 0).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            / ₹{hisab.total_budget?.toLocaleString()}
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
                            ₹
                            {(
                              hisab.total_budget - (spentMap[hisab.id] || 0)
                            )?.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-3">
                          Contributors
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {hisab.contributors.map(contributor => (
                            <div
                              key={contributor.user_id}
                              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                            >
                              {contributor.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">
                            Transactions
                          </h4>
                          <div className="flex gap-2">
                            <button
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 border border-indigo-600 rounded px-3 py-1 transition"
                              onClick={() => {
                                setSelectedHisabId(hisab.id);
                                setShowModal(true);
                              }}
                            >
                              <Plus size={14} />
                              Add Transaction
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 border border-green-600 rounded px-3 py-1 transition"
                              onClick={async () => {
                                try {
                                  await axios.post(
                                    `${
                                      import.meta.env.VITE_BACKEND_API_URL
                                    }/hisabs/${hisab.id}/summary`,
                                    {},
                                    { withCredentials: true },
                                  );
                                  toast.success(
                                    'Summary generated successfully!',
                                  );
                                } catch {
                                  toast.error('Failed to generate summary');
                                }
                              }}
                            >
                              <TrendingUp size={14} />
                              Generate Summary
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {(() => {
                            const txns = hisab.transactions || [];
                            const showAll = showAllTransactions[hisab.id];
                            const visibleTxns = showAll
                              ? txns
                              : txns.slice(0, 4);
                            return (
                              <>
                                {visibleTxns.length > 0 ? (
                                  visibleTxns.map((txn, idx) => (
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
                                          {txn.category ===
                                            'Transportation' && (
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
                                            <span>
                                              Paid by {txn.paid_by_user}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="font-semibold">
                                        ₹{txn.amount?.toLocaleString()}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gray-200">
                                        <DollarSign size={16} />
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          No transactions yet
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {txns.length > 4 && (
                                  <button
                                    className="mt-2 text-indigo-600 hover:underline text-sm"
                                    onClick={() =>
                                      setShowAllTransactions(prev => ({
                                        ...prev,
                                        [hisab.id]: !prev[hisab.id],
                                      }))
                                    }
                                  >
                                    {showAll ? 'Show Less' : 'Show All'}
                                  </button>
                                )}
                              </>
                            );
                          })()}
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
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
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
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg"
          style={{
            background: 'transparent',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="bg-white bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20 animate-pop-in"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Add Transaction
            </h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                try {
                  const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_API_URL}/transactions`,
                    {
                      hisab_id: selectedHisabId,
                      paid_by: transactionForm.paid_by,
                      amount: parseFloat(transactionForm.amount),
                      description: transactionForm.description,
                      category: transactionForm.category,
                    },
                    { withCredentials: true },
                  );
                  setSpentMap(prev => ({
                    ...prev,
                    [selectedHisabId]:
                      (prev[selectedHisabId] || 0) +
                      parseFloat(transactionForm.amount),
                  }));
                  setTransactions([...transactions, res.data]);
                  setShowModal(false);
                  setTransactionForm({
                    amount: '',
                    description: '',
                    paid_by: '',
                    category: '',
                  });
                } catch {
                  alert('Failed to add transaction');
                }
              }}
            >
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Amount</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 bg-white bg-opacity-60 focus:bg-opacity-90 transition"
                  value={transactionForm.amount}
                  onChange={e =>
                    setTransactionForm(f => ({ ...f, amount: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Description</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-white bg-opacity-60 focus:bg-opacity-90 transition"
                  value={transactionForm.description}
                  onChange={e =>
                    setTransactionForm(f => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Category</label>
                <select
                  className="w-full border rounded px-3 py-2 bg-white bg-opacity-60 focus:bg-opacity-90 transition"
                  value={transactionForm.category}
                  onChange={e =>
                    setTransactionForm(f => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Venue">Venue</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Paid By</label>
                <select
                  className="w-full border rounded px-3 py-2 bg-white bg-opacity-60 focus:bg-opacity-90 transition"
                  value={transactionForm.paid_by}
                  onChange={e =>
                    setTransactionForm(f => ({ ...f, paid_by: e.target.value }))
                  }
                  required
                >
                  <option value="">Select member</option>
                  {contributors.map(contributor => (
                    <option
                      key={contributor.user_id}
                      value={contributor.user_id}
                    >
                      {contributor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
