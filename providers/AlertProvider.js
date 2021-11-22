import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

export const AlertContext = React.createContext({
    alert: null,
    addAlert: () => {
    },
    removeAlert: () => {
    },
});


export default function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);

    const removeAlert = () => setAlert(null);

    const addAlert = (message, status) => {
        setAlert({ message, status });
        setTimeout(() => {
            removeAlert();
        }, 3000);
    };

    const contextValue = {
        alert,
        addAlert: useCallback((message, status) => addAlert(message, status), []),
        removeAlert: useCallback(() => removeAlert(), []),
    };

    return (
      <AlertContext.Provider value={contextValue}>
          {children}
      </AlertContext.Provider>
    );
}

AlertProvider.propTypes = {
    children: PropTypes.node,
};