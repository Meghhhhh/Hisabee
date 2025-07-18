import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const currency = amount => `₹${parseFloat(amount).toLocaleString()}`;

const calculateBalances = (contributors, transactions) => {
  // Calculate how much each user paid
  const paidMap = {};
  contributors.forEach(c => {
    paidMap[c.user_id] = 0;
  });
  transactions.forEach(txn => {
    if (paidMap[txn.paid_by]) {
      paidMap[txn.paid_by] += parseFloat(txn.amount) || 0;
    }
  });
  // Calculate equal share
  const total = transactions.reduce(
    (sum, t) => sum + (parseFloat(t.amount) || 0),
    0,
  );
  const perPerson = total / contributors.length;
  // Calculate net balance for each user
  const balances = contributors.map(c => ({
    user_id: c.user_id,
    name: c.name,
    paid: paidMap[c.user_id],
    owes: perPerson - paidMap[c.user_id],
  }));
  return { balances, total, perPerson };
};

const calculateSettlements = balances => {
  // Simple greedy algorithm for settlements
  const creditors = balances.filter(b => b.owes < 0).map(b => ({ ...b }));
  const debtors = balances.filter(b => b.owes > 0).map(b => ({ ...b }));
  const settlements = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.owes, -creditor.owes);
    if (amount > 0.01) {
      settlements.push({ from: debtor.name, to: creditor.name, amount });
      debtor.owes -= amount;
      creditor.owes += amount;
    }
    if (debtor.owes < 0.01) i++;
    if (creditor.owes > -0.01) j++;
  }
  return settlements;
};

const Summary = () => {
  const { hisabId } = useParams();
  console.log(hisabId);
  const [hisab, setHisab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHisab = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/hisabs/${hisabId}`,
          { withCredentials: true },
        );
        console.log(res.data);

        setHisab(res.data);
      } catch {
        setHisab(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHisab();
  }, [hisabId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!hisab)
    return <div className="text-center mt-10">Failed to load summary.</div>;

  const { contributors = [], transactions = [] } = hisab;
  const { balances, total, perPerson } = calculateBalances(
    contributors,
    transactions,
  );
  const settlements = calculateSettlements(balances);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Hisab Summary: ${hisab.title}`, 10, 10);
    doc.text(`Total Spent: ${currency(total)}`, 10, 20);
    doc.text(`Per Person: ${currency(perPerson)}`, 10, 30);
    doc.autoTable({
      startY: 40,
      head: [['Name', 'Paid', 'Owes (+)/Gets (-)']],
      body: balances.map(b => [b.name, currency(b.paid), currency(b.owes)]),
    });
    doc.text('Settlements:', 10, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['From', 'To', 'Amount']],
      body: settlements.map(s => [s.from, s.to, currency(s.amount)]),
    });
    doc.text('Transactions:', 10, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Description', 'Amount', 'Category', 'Paid By', 'Date']],
      body: transactions.map(t => [
        t.description,
        currency(t.amount),
        t.category,
        contributors.find(c => c.user_id === t.paid_by)?.name || t.paid_by,
        new Date(t.date).toLocaleDateString(),
      ]),
    });
    doc.save(`hisab-summary-${hisab.title}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Summary for {hisab.title}
      </h1>
      <div className="mb-6">
        <div className="text-lg font-semibold">
          Total Spent:{' '}
          <span className="text-indigo-600">{currency(total)}</span>
        </div>
        <div className="text-lg font-semibold">
          Per Person:{' '}
          <span className="text-indigo-600">{currency(perPerson)}</span>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Who Spent What</h2>
        <table className="w-full mb-4 border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Paid</th>
              <th className="py-2 px-4">Owes (+)/Gets (-)</th>
            </tr>
          </thead>
          <tbody>
            {balances.map(b => (
              <tr key={b.user_id} className="text-center">
                <td className="py-2 px-4">{b.name}</td>
                <td className="py-2 px-4">{currency(b.paid)}</td>
                <td className="py-2 px-4">{currency(b.owes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Who Pays Whom</h2>
        {settlements.length === 0 ? (
          <div className="text-gray-500">Everyone is settled up!</div>
        ) : (
          <ul className="list-disc pl-6">
            {settlements.map((s, idx) => (
              <li key={idx} className="mb-1">
                <span className="font-medium text-indigo-700">{s.from}</span>{' '}
                pays <span className="font-medium text-green-700">{s.to}</span>{' '}
                <span className="font-semibold">{currency(s.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Transactions</h2>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Paid By</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx} className="text-center">
                <td className="py-2 px-4">{t.description}</td>
                <td className="py-2 px-4">{currency(t.amount)}</td>
                <td className="py-2 px-4">{t.category}</td>
                <td className="py-2 px-4">
                  {contributors.find(c => c.user_id === t.paid_by)?.name ||
                    t.paid_by}
                </td>
                <td className="py-2 px-4">
                  {new Date(t.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Summary;
