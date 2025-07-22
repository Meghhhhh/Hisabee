import React from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

const currency = amount => `₹${parseFloat(amount).toLocaleString()}`;

const calculateBalances = hisab => {
  const { contributors = [], transactions = [] } = hisab;

  // Initialize each user's balance (amount they are owed)
  const userMap = {};
  contributors.forEach(c => {
    userMap[c.user_id] = {
      name: c.name,
      paid: 0,
      owes: 0,
    };
  });

  // Process each transaction
  for (const tx of transactions) {
    if (tx.paid_through_contribution) {
      // Paid from common pool: nothing owed
      continue;
    }

    const payerId = contributors.find(c => c.name === tx.paid_by)?.user_id;
    if (!payerId) continue;

    const splitAmount = tx.amount / contributors.length;
    contributors.forEach(c => {
      if (c.user_id === payerId) {
        userMap[c.user_id].paid += tx.amount - splitAmount;
      } else {
        userMap[c.user_id].owes += splitAmount;
      }
    });
  }

  // Calculate settlements
  // const balances = [];
  const creditors = [];
  const debtors = [];

  for (const id in userMap) {
    const net = userMap[id].paid - userMap[id].owes;
    if (net > 0) {
      creditors.push({ id, ...userMap[id], balance: net });
    } else if (net < 0) {
      debtors.push({ id, ...userMap[id], balance: -net });
    }
  }

  // Simple greedy settlement
  let settlements = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.balance, creditor.balance);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: parseFloat(amount.toFixed(2)),
    });

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return settlements;
};

const Summary = () => {
  const { hisabId } = useParams();
  const hisab = useSelector(state =>
    state.hisabs.hisabs.find(h => h.id === hisabId),
  );
  const settlements = calculateBalances(hisab);
  if (!hisab)
    return <div className="text-center mt-10">Failed to load summary.</div>;

  const { contributors = [], transactions = [] } = hisab;

  // Remove balances, perPerson, settlements
  // Only use contributors and transactions for display

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Hisab Summary: ${hisab.title}`, 10, 10);
    const total = transactions.reduce(
      (sum, t) => sum + (parseFloat(t.amount) || 0),
      0,
    );
    doc.text(`Total Spent: ${currency(total)}`, 10, 20);
    doc.autoTable({
      startY: 30,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Summary for {hisab.title}
        </h1>
        <div className="mb-6">
          <div className="text-lg font-semibold">
            Total Spent:{' '}
            <span className="text-indigo-600">
              {currency(
                transactions.reduce(
                  (sum, t) => sum + (parseFloat(t.amount) || 0),
                  0,
                ),
              )}
            </span>
          </div>
        </div>
        <div className="mb-4 text-gray-700 text-center">
          <span className="font-semibold">Total Transactions:</span>{' '}
          <span className="text-indigo-600 font-bold">
            {transactions.length}
          </span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Spending by Category
          </h2>
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-indigo-50">
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                transactions.reduce((acc, t) => {
                  acc[t.category] =
                    (acc[t.category] || 0) + parseFloat(t.amount || 0);
                  return acc;
                }, {}),
              ).map(([cat, amt], idx) => (
                <tr
                  key={idx}
                  className={`text-center ${
                    idx % 2 === 0 ? 'bg-gray-50' : ''
                  } hover:bg-indigo-50`}
                >
                  <td className="py-2 px-4">{cat}</td>
                  <td className="py-2 px-4">{currency(amt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2 text-indigo-700">
            Most Generous Contributor
          </h2>
          <div className="text-lg">
            {(() => {
              const paidMap = {};
              hisab.contributors.forEach(c => (paidMap[c.name] = 0));
              transactions.forEach(t => {
                paidMap[t.paid_by] =
                  (paidMap[t.paid_by] || 0) + parseFloat(t.amount || 0);
              });
              const max = Object.entries(paidMap).reduce((a, b) =>
                b[1] > a[1] ? b : a,
              );
              return (
                <span>
                  {max[0]} paid the most:{' '}
                  <span className="text-indigo-600">{currency(max[1])}</span>
                </span>
              );
            })()}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            All Transactions
          </h2>
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-indigo-50">
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Paid By</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr
                  key={idx}
                  className={`text-center ${
                    idx % 2 === 0 ? 'bg-gray-50' : ''
                  } hover:bg-indigo-50`}
                >
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
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Settlements
          </h2>
          {settlements.length === 0 ? (
            <div className="text-gray-500">No settlements needed.</div>
          ) : (
            <table className="w-full border rounded overflow-hidden">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="py-2 px-4">From</th>
                  <th className="py-2 px-4">To</th>
                  <th className="py-2 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((s, idx) => (
                  <tr
                    key={idx}
                    className={`text-center ${
                      idx % 2 === 0 ? 'bg-gray-50' : ''
                    } hover:bg-indigo-50`}
                  >
                    <td className="py-2 px-4">{s.from}</td>
                    <td className="py-2 px-4">{s.to}</td>
                    <td className="py-2 px-4 font-bold text-indigo-600">
                      {currency(s.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Per Person Summary
          </h2>
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-indigo-50">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Paid</th>
                <th className="py-2 px-4">Owes</th>
                <th className="py-2 px-4">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {hisab.contributors.map((c, idx) => {
                const user = (() => {
                  // Recalculate per person paid/owes
                  const { contributors = [], transactions = [] } = hisab;
                  let paid = 0,
                    owes = 0;
                  for (const tx of transactions) {
                    if (tx.paid_through_contribution) continue;
                    const payerId = contributors.find(
                      cc => cc.name === tx.paid_by,
                    )?.user_id;
                    const splitAmount = tx.amount / contributors.length;
                    if (c.user_id === payerId) {
                      paid += tx.amount - splitAmount;
                    } else {
                      owes += splitAmount;
                    }
                  }
                  return { paid, owes, net: paid - owes };
                })();
                return (
                  <tr
                    key={idx}
                    className={`text-center ${
                      idx % 2 === 0 ? 'bg-gray-50' : ''
                    } hover:bg-indigo-50`}
                  >
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4">{currency(user.paid)}</td>
                    <td className="py-2 px-4">{currency(user.owes)}</td>
                    <td
                      className={`py-2 px-4 font-bold ${
                        user.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {currency(user.net)}
                    </td>
                  </tr>
                );
              })}
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
    </div>
  );
};

export default Summary;
