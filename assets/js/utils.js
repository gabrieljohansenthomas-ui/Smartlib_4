// Helper functions: Sanitize, formatDate, escapeHTML.
// Digunakan di seluruh app untuk keamanan.

import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.0.3/dist/purify.es.mjs";

export function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID');
}

export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
