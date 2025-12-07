// Handle login, register, logout, role guard, dan cek active status.
// Menggunakan Firebase Auth dan Firestore untuk role dan active check.

import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Register: Tulis doc users/{uid} dengan role "member", active true.
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const displayName = document.getElementById('displayName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      displayName,
      email,
      role: 'member',
      active: true,
      joinedAt: new Date()
    });
    alert('Registrasi berhasil!');
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});

// Login: Cek active status.
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.data().active) {
      await signOut(auth);
      alert('Akun dinonaktifkan!');
      return;
    }
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// Auth state listener: Update UI, role guard.
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    if (!userData.active) {
      await signOut(auth);
      alert('Akun dinonaktifkan!');
      return;
    }
    document.getElementById('userInfo')?.innerHTML = `<p>Selamat datang, ${userData.displayName} (${userData.role})</p>`;
    if (userData.role === 'admin') {
      document.getElementById('adminNav')?.classList.remove('hidden');
    }
  } else {
    if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('admin')) {
      window.location.href = 'login.html';
    }
  }
});