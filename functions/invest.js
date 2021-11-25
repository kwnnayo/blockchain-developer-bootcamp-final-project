import { toWei } from './web3Funcs';
import { updateVision } from './updateVision';
import { getReasonMessage } from './getReasonMessage';

export const invest = async (vision, account, investAmount, setVision, addAlert, visionContract) => {

  visionContract.methods.invest().send({
    from: account,
    value: toWei(investAmount),
  }).then((resp) => {
    addAlert('Thank you for your invest!', 'success');
    updateVision(vision, setVision, visionContract);
  }).catch((error) => {
    let reasonMessage = getReasonMessage(error);
    reasonMessage = reasonMessage !== null ? reasonMessage.toString() : 'An error occurred during the invest';
    addAlert(reasonMessage, 'error');
  });
};