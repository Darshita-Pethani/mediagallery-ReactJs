import React, { createContext, useState } from 'react';

// Rename `SnackbarPageContext` to avoid confusion
export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    const [showNotification, setShowNotification] = useState({
        status: '',
        message: ''
    });

    const handleClose = () => {
        setIsVisible(false);
        setShowNotification({
            status: '',
            message: ''
        });
    };

    return (
        <SnackbarContext.Provider value={{
            isVisible, setIsVisible,
            handleClose,
            showNotification, setShowNotification
        }}>
            {children}
        </SnackbarContext.Provider>
    );
};
