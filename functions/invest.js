import { toWei } from './web3Funcs';
import { updateVision } from './updateVision';
import { getReasonMessage } from './getReasonMessage';
import useVisionContract from '../hooks/useVisionContract';

export const invest = async (web3, contract, vision, account, investAmount, setVision, addAlert) => {

    const visionContract = useVisionContract(vision.visionAddress, web3);

    visionContract.methods.invest().send({
        from: account,
        value: toWei(investAmount),
    }).then((resp) => {
        addAlert('Thank you for your invest!', 'success');
        updateVision(web3, vision, setVision);
    }).catch((error) => {
        let reasonMessage = getReasonMessage(error);
        reasonMessage = reasonMessage !== null ? reasonMessage.toString() : 'An error occurred during the invest';
        addAlert(reasonMessage, 'error');
    });
};