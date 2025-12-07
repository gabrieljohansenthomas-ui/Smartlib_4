// Handle reviews & rating: Submit review, tampilkan avg rating (client-side), daftar ulasan.
// Sanitasi dengan DOMPurify.

import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.0.3/dist/purify.es.mjs";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  // Load book detail
  const bookDoc = await getDoc(doc(db, 'books', bookId));
  const book = bookDoc.data();
  document.getElementById('bookDetail').innerHTML = `<img src="${book.coverUrl}" alt="Cover"><h2>${book.title}</h2><p>${book.description}</p>`;

  // Load reviews & calculate avg
  const q = query(collection(db, 'reviews'), where('bookId', '==', bookId));
  const snapshot = await getDocs(q);
  let totalRating = 0;
  let count = 0;
  const reviewsList = document.getElementById('reviewsList');
  reviewsList.innerHTML = '';
  snapshot.forEach(doc => {
    const review = doc.data();
    totalRating += review.rating;
    count++;
    reviewsList.innerHTML += `<div><p>Rating: ${review.rating}</p><p>${DOMPurify.sanitize(review.review)}</p></div>`;
  });
  document.getElementById('avgRating').textContent = count > 0 ? (totalRating / count).toFixed(1) : '0';

  // Submit review
  document.getElementById('reviewForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rating = parseInt(document.getElementById('rating').value);
    const reviewText = DOMPurify.sanitize(document.getElementById('reviewText').value);
    await addDoc(collection(db, 'reviews'), {
      userId: user.uid,
      bookId,
      rating,
      review: reviewText,
      createdAt: new Date()
    });
    alert('Review submitted!');
    location.reload(); // Reload to update avg
  });
});
