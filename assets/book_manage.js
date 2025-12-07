// CRUD buku admin, mock backup, dan manage members.
// Menggunakan Firestore untuk operasi.

import { db, auth } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Role guard: Pastikan admin
onAuthStateChanged(auth, (user) => {
  if (!user || user.role !== 'admin') window.location.href = '../dashboard.html';
});

// CRUD Buku
async function loadBooks() {
  const snapshot = await getDocs(collection(db, 'books'));
  const booksList = document.getElementById('booksList');
  booksList.innerHTML = '';
  snapshot.forEach(doc => {
    const book = doc.data();
    booksList.innerHTML += `<div class="bg-white p-4 rounded shadow"><h3>${book.title}</h3><button onclick="editBook('${doc.id}')">Edit</button><button onclick="deleteBook('${doc.id}')">Hapus</button></div>`;
  });
}

window.editBook = async (id) => {
  const docSnap = await getDoc(doc(db, 'books', id));
  const book = docSnap.data();
  // Populate form
  document.getElementById('title').value = book.title;
  document.getElementById('bookForm').classList.remove('hidden');
};

window.deleteBook = async (id) => {
  await deleteDoc(doc(db, 'books', id));
  loadBooks();
};

document.getElementById('addBookBtn')?.addEventListener('click', () => {
  document.getElementById('bookForm').classList.remove('hidden');
});

document.getElementById('bookFormEl')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    isbn: document.getElementById('isbn').value,
    category: document.getElementById('category').value,
    stock: parseInt(document.getElementById('stock').value),
    availableStock: parseInt(document.getElementById('stock').value),
    coverUrl: document.getElementById('coverUrl').value,
    description: document.getElementById('description').value
  };
  await addDoc(collection(db, 'books'), data);
  document.getElementById('bookForm').classList.add('hidden');
  loadBooks();
});

document.getElementById('cancelBtn')?.addEventListener('click', () => {
  document.getElementById('bookForm').classList.add('hidden');
});

// Mock Backup
document.getElementById('mockBackupBtn')?.addEventListener('click', async () => {
  const snapshot = await getDocs(collection(db, 'books'));
  const data = snapshot.docs.map(doc => doc.data());
  console.log('Mock Backup Data:', data);
  alert('Backup simulated! Check console.');
});

// Manage Members
async function loadMembers() {
  const snapshot = await getDocs(collection(db, 'users'));
  const membersList = document.getElementById('membersList');
  membersList.innerHTML = '';
  snapshot.forEach(doc => {
    const user = doc.data();
    membersList.innerHTML += `<div class="bg-white p-4 rounded shadow"><p>${user.displayName} (${user.email}) - ${user.active ? 'Aktif' : 'Nonaktif'}</p><button onclick="toggleActive('${doc.id}', ${!user.active})">${user.active ? 'Nonaktifkan' : 'Aktifkan'}</button></div>`;
  });
}

window.toggleActive = async (id, active) => {
  await updateDoc(doc(db, 'users', id), { active });
  loadMembers();
};

if (window.location.pathname.includes('members.html')) loadMembers();
if (window.location.pathname.includes('books.html')) loadBooks();