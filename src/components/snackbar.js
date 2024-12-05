import React, { useContext } from 'react';
import { MdCancel } from "react-icons/md";
import { SnackbarContext } from '../context/snackbarContext';

const ShowNotificationSnackbar = () => {
    
    const { isVisible, handleClose, showNotification } = useContext(SnackbarContext);

    return isVisible ? (
        <div
            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 flex justify-between items-center fixed right-5 bottom-0 w-full max-w-[50%]"
            role="alert"
        >
            <div>
                <span className="font-medium">{showNotification?.status}!</span> {showNotification?.message}
            </div>
            <button
                onClick={handleClose}

                aria-label="Close Notification"
            >
                < MdCancel />
            </button>
        </div>
    ) : null;
};

export default ShowNotificationSnackbar;
