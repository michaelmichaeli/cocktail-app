export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} animate-in fade-in slide-in-from-top-full`;
  toast.innerHTML = message;

  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out', 'slide-out-to-top-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
