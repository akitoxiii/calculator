import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const color =
    type === 'success' ? 'bg-success text-white' :
    type === 'error' ? 'bg-error text-white' :
    'bg-gray-800 text-white';

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg ${color} animate-fade-in`}
      role="alert">
      {message}
    </div>
  );
}; 