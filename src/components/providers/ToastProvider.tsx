import { Toaster } from 'react-hot-toast';
import styles from './ToastProvider.module.scss';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: styles.toast,
        success: {
          className: styles.success,
          duration: 3000,
        },
        error: {
          className: styles.error,
          duration: 4000,
        },
        loading: {
          className: styles.loading,
        },
      }}
    />
  );
};
