// Handle peminjaman request, approve/reject (admin), return.
// Client-side simulasi: Cek stok, update Firestore, alert mock email.

import { db, auth } from './firebase-config.js';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (window.location.pathname.includes('borrow.html')) {
    document.getElementById('requestBorrow')?.addEventListener('click', async () => {
      await addDoc(collection(db, 'loans'), {
        userId: user.uid,
        bookId,
        status: 'requested',
        requestAt: new Date()
      });
      alert('Request peminjaman dikirim!');
      window.location.href = 'my_history.html';
    });
  }

  if (window.location.pathname.includes('my_history.html')) {
    const q = query(collection(db, 'loans'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    const historyList = document.getElementById('historyList');
    snapshot.forEach(doc => {
      const loan = doc.data();
      const statusClass = loan.status === 'overdue' ? 'text-red-500' : '';
      historyList.innerHTML += `<div class="bg-white p-4 rounded shadow ${statusClass}"><p>Buku ID: ${loan.bookId} - Status: ${loan.status}</p></div>`;
    });
  }
});

// Admin approve/reject (simulasi di admin pages, tapi untuk demo, asumsikan di books.html atau separate)
window.approveLoan = async (loanId) => {
  const loanDoc = await getDoc(doc(db, 'loans', loanId));
  const loan = loanDoc.data();
  const bookDoc = await getDoc(doc(db, 'books', loan.bookId));
  const book = bookDoc.data();
  if (book.availableStock > 0) {
    await updateDoc(doc(db, 'loans', loanId), { status: 'approved', approvedAt: new Date(), dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) });
    await updateDoc(doc(db, 'books', loan.bookId), { availableStock: book.availableStock - 1 });
    alert('Email reminder simulated.');
  } else {
    alert('Stok habis!');
  }
};

window.rejectLoan = async (loanId) => {
  await updateDoc(doc(db, 'loans', loanId), { status: 'rejected' });
  alert('Rejected.');
};

window.returnBook = async (loanId) => {
  const loanDoc = await getDoc(doc(db, 'loans', loanId));
  const loan = loanDoc.data();
  await updateDoc(doc(db, 'loans', loanId), { status: 'returned', returnedAt: new Date() });
  const bookDoc = await getDoc(doc(db, 'books', loan.bookId));
  const book = bookDoc.data();
  await updateDoc(doc(db, 'books', loan.bookId), { availableStock: book.availableStock + 1 });
  alert('Buku dikembalikan!');
};
