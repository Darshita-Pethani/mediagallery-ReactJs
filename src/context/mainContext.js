import React from 'react';
import { SnackbarProvider } from './snackbarContext'; // Use the provider component

export const MainProvider = ({ children }) => {
    return (
        <SnackbarProvider>
            {children}
        </SnackbarProvider>
    );
};
