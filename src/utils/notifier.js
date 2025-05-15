import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useNotifier = () => {
  const notify = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-left',
      autoClose: 1000,
    });
  };

  const confirm = async (title = 'Xác nhận?', text = '', confirmText = 'Đồng ý') => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Hủy',
    });

    return result.isConfirmed;
  };

  return { notify, confirm };
};

// ⚠️ Phải thêm <ToastContainer /> 1 lần duy nhất ở App hoặc Layout
export const NotifierContainer = ToastContainer;