import {useContext} from 'react';
import {AlertContext} from "../providers/AlertProvider";

function useAlert() {
    const {alert, addAlert, removeAlert} = useContext(AlertContext);
    return {alert, addAlert, removeAlert};
}

export default useAlert;