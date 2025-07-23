import React from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

const currency = amount => `₹${parseFloat(amount).toLocaleString()}`;

const calculateBalances = hisab => {
  const { contributors = [], transactions = [] } = hisab;

  if (contributors.length === 0) {
    return { settlements: [], perPerson: [], userMap: {} };
  }

  const userMap = {};

  // Step 1: Initialize user map with initial budget contributions
  contributors.forEach(c => {
    const initialContribution = parseFloat(c.budget_contribution || 0);
    userMap[c.user_id] = {
      name: c.name,
      paid: initialContribution, // Start with initial budget contribution
      owes: 0,
    };
  });

  // Step 2: Add additional out-of-pocket payments (ignore "Contribution" transactions)
  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount || 0);
    
    // Skip transactions paid by "Contribution" - these are from the budget pool
    if (tx.paid_by === 'Contribution' || tx.paid_by === 'contribution') {
      return;
    }
    
    // Find the payer and add to their paid amount
    const payer = contributors.find(c => c.name === tx.paid_by || c.user_id === tx.paid_by);
    if (payer && userMap[payer.user_id]) {
      userMap[payer.user_id].paid += amount;
    }
  });

  // Step 3: Calculate total expenses - sum of ALL transactions
  const totalExpenses = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    
    // If "Contribution" means it was spent from the initial budget pool

  // Step 4: Calculate equal share per person
  const equalShare = totalExpenses / contributors.length;

  // Step 5: Set what each person owes (their equal share)
  contributors.forEach(c => {
    userMap[c.user_id].owes = equalShare;
  });

  // Step 5: Calculate net balances and create settlements
  const creditors = [];
  const debtors = [];

  for (const id in userMap) {
    const user = userMap[id];
    const netBalance = user.paid - user.owes;
    user.netBalance = netBalance;
    
    if (netBalance > 0.01) {
      creditors.push({ id, ...user, balance: netBalance });
    } else if (netBalance < -0.01) {
      debtors.push({ id, ...user, balance: Math.abs(netBalance) });
    }
  }

  // Step 6: Generate settlements using greedy algorithm
  const settlements = [];
  let i = 0, j = 0;

  // Sort for better settlement optimization
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settlementAmount = Math.min(debtor.balance, creditor.balance);

    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: parseFloat(settlementAmount.toFixed(2)),
      });
    }

    debtor.balance -= settlementAmount;
    creditor.balance -= settlementAmount;

    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  // Step 7: Create per person summary
  const perPerson = contributors.map(c => ({
    name: c.name,
    paid: userMap[c.user_id].paid,
    owes: userMap[c.user_id].owes,
    netBalance: userMap[c.user_id].netBalance,
  }));

  return { settlements, perPerson, userMap };
};

const Summary = () => {
  const { hisabId } = useParams();
  const hisab = useSelector(state =>
    state.hisabs.hisabs.find(h => h.id === hisabId),
  );
  
  if (!hisab)
    return <div className="text-center mt-10">Failed to load summary.</div>;

  const { contributors = [], transactions = [] } = hisab;
  const { settlements, perPerson } = calculateBalances(hisab);

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
        contributors.find(c => c.user_id === t.paid_by || c.name === t.paid_by)?.name || t.paid_by,
        new Date(t.date).toLocaleDateString(),
      ]),
    });
    doc.save(`hisab-summary-${hisab.title}.pdf`);
  };

  // Calculate total spent
  const totalSpent = transactions.reduce(
    (sum, t) => sum + (parseFloat(t.amount) || 0),
    0,
  );

  // Calculate spending by category
  const categorySpending = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount || 0);
    return acc;
  }, {});

  // Find most generous contributor
  const paidMap = {};
  contributors.forEach(c => (paidMap[c.name] = 0));
  transactions.forEach(t => {
    const payerName = contributors.find(c => c.user_id === t.paid_by || c.name === t.paid_by)?.name || t.paid_by;
    paidMap[payerName] = (paidMap[payerName] || 0) + parseFloat(t.amount || 0);
  });
  const mostGenerous = Object.entries(paidMap).reduce((a, b) => b[1] > a[1] ? b : a);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Summary for {hisab.title}
        </h1>

        <div className="mb-6">
          <div className="text-lg font-semibold">
            Total Budget:{' '}
            <span className="text-indigo-600">
              {currency(contributors.reduce((sum, c) => sum + parseFloat(c.budget_contribution || 0), 0))}
            </span>
          </div>
          <div className="text-lg font-semibold">
            Additional Expenses:{' '}
            <span className="text-indigo-600">
              {currency(transactions.reduce((sum, t) => {
                if (t.paid_by === 'Contribution' || t.paid_by === 'contribution') return sum;
                return sum + parseFloat(t.amount || 0);
              }, 0))}
            </span>
          </div>
          <div className="text-lg font-semibold">
            Total Spent:{' '}
            <span className="text-indigo-600">
              {currency(totalSpent)}
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
              {Object.entries(categorySpending).map(([cat, amt], idx) => (
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
            <span>
              {mostGenerous[0]} paid the most:{' '}
              <span className="text-indigo-600">{currency(mostGenerous[1])}</span>
            </span>
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
                    {contributors.find(c => c.user_id === t.paid_by || c.name === t.paid_by)?.name || t.paid_by}
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
            Per Person Summary
          </h2>
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-indigo-50">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Initial Budget</th>
                <th className="py-2 px-4">Additional Paid</th>
                <th className="py-2 px-4">Total Paid</th>
                <th className="py-2 px-4">Fair Share</th>
                <th className="py-2 px-4">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {perPerson.map((person, idx) => {
                const initialBudget = parseFloat(contributors.find(c => c.name === person.name)?.budget_contribution || 0);
                const additionalPaid = person.paid - initialBudget;
                return (
                  <tr
                    key={idx}
                    className={`text-center ${
                      idx % 2 === 0 ? 'bg-gray-50' : ''
                    } hover:bg-indigo-50`}
                  >
                    <td className="py-2 px-4">{person.name}</td>
                    <td className="py-2 px-4">{currency(initialBudget)}</td>
                    <td className="py-2 px-4">{currency(additionalPaid)}</td>
                    <td className="py-2 px-4">{currency(person.paid)}</td>
                    <td className="py-2 px-4">{currency(person.owes)}</td>
                    <td
                      className={`py-2 px-4 font-bold ${
                        person.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {person.netBalance >= 0 ? '+' : ''}{currency(person.netBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Settlements
          </h2>
          {settlements.length === 0 ? (
            <div className="text-gray-500 text-center">All settled! No payments needed.</div>
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