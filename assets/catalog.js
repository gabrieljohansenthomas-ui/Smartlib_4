// Fetch, filter, search buku dengan pagination (infinite scroll simulasi).
// Menggunakan Firestore queries dengan indexing (pastikan index di Firestore untuk search).

import { db } from './firebase-config.js';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

let lastDoc = null;
let currentQuery = null;

async function loadBooks(search = '', category = '', status = '', loadMore = false) {
  const booksRef = collection(db, 'books');
  let q = query(booksRef, orderBy('title'), limit(10));
  if (search) q = query(booksRef, where('title', '>=', search), where('title', '<=', search + '\uf8ff'), orderBy('title'), limit(10));
  if (category) q = query(q, where('category', '==', category));
  if (status === 'available') q = query(q, where('availableStock', '>', 0));
  if (status === 'borrowed') q = query(q, where('availableStock', '==', 0));
  if (loadMore && lastDoc) q = query(q, startAfter(lastDoc));

  const snapshot = await getDocs(q);
  const booksList = document.getElementById('booksList');
  if (!loadMore) booksList.innerHTML = '';
  snapshot.forEach(doc => {
    const book = doc.data();
    booksList.innerHTML += `<div class="bg-white p-4 rounded shadow"><img src="${book.coverUrl}" alt="Cover" class="w-20"><h3>${book.title}</h3><p>${book.author}</p><a href="book_detail.html?id=${doc.id}" class="text-blue-500">Detail</a></div>`;
  });
  lastDoc = snapshot.docs[snapshot.docs.length - 1];
}

document.getElementById('searchBtn')?.addEventListener('click', () => {
  const search = document.getElementById('search').value;
  const category = document.getElementById('category').value;
  const status = document.getElementById('status').value;
  loadBooks(search, category, status);
});

document.getElementById('loadMore')?.addEventListener('click', () => loadBooks('', '', '', true));

// Load initial
loadBooks();