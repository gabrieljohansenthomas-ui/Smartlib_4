// Render charts dengan Chart.js v3+: Popular books, loans per month, active members.
// Aggregation client-side dari Firestore data.

import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";

async function loadStats() {
  // Popular books: Top 5 berdasarkan jumlah loans approved/returned
  const loansSnapshot = await getDocs(collection(db, 'loans'));
  const bookCounts = {};
  loansSnapshot.forEach(doc => {
    const loan = doc.data();
    if (loan.status === 'approved' || loan.status === 'returned') {
      bookCounts[loan.bookId] = (bookCounts[loan.bookId] || 0) + 1;
    }
  });
  const topBooks = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  new Chart(document.getElementById('popularBooksChart'), {
    type: 'bar',
    data: {
      labels: topBooks.map(([id]) => `Book ${id}`),
      datasets: [{ label: 'Jumlah Peminjaman', data: topBooks.map(([, count]) => count) }]
    }
  });

  // Loans per month: 6-12 bulan terakhir
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date.toISOString().slice(0, 7)); // YYYY-MM
  }
  const loansPerMonth = {};
  loansSnapshot.forEach(doc => {
    const loan = doc.data();
    const month = new Date(loan.requestAt.seconds * 1000).toISOString().slice(0, 7);
    loansPerMonth[month] = (loansPerMonth[month] || 0) + 1;
  });
  new Chart(document.getElementById('loansPerMonthChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{ label: 'Peminjaman per Bulan', data: months.map(m => loansPerMonth[m] || 0) }]
    }
  });

  // Active members
  const usersSnapshot = await getDocs(query(collection(db, 'users'), where('active', '==', true)));
  document.getElementById('activeCount').textContent = usersSnapshot.size;
}

loadStats();