import { ToastType } from '../types';

export function showToast(message: string, type: ToastType = 'info') {
  const toast = document.createElement('div');
  const baseClasses = 'alert animate-in fade-in slide-in-from-top-full shadow-lg';
  const typeClasses = {
    success: 'alert-success text-success-content bg-success/90',
    error: 'alert-error text-error-content bg-error/90',
    info: 'alert-info text-info-content bg-info/90',
    warning: 'alert-warning text-warning-content bg-warning/90'
  };
  
  toast.className = `${baseClasses} ${typeClasses[type]}`;
  toast.innerHTML = message;

  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out', 'slide-out-to-top-full');
      setTimeout(() => toast.remove(), 6000);
    }, 6000);
  }
}

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
  warning: (message: string) => showToast(message, 'warning'),
}
