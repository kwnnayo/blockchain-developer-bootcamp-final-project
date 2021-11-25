import React, { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Web3Context } from '../pages';
import { toEther, toWei } from '../functions/web3Funcs';
import { updateVision } from '../functions/updateVision';
import { getReasonMessage } from '../functions/getReasonMessage';
import useAlert from '../hooks/useAlert';
import useVisionContract from '../hooks/useVisionContract';

const RequestModal = ({ vision, setVision }) => {
  const { web3 } = useContext(Web3Context);
  const { account } = useWeb3React();
  const { addAlert } = useAlert();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const { withdrawAmount } = data;
    const { withdrawReason } = data;
    const visionContract = useVisionContract(vision.visionAddress, web3);

    await visionContract.methods.createWithdrawRequest(toWei(withdrawAmount), withdrawReason).send({ from: account }).then((resp) => {
      addAlert('Withdraw request submitted successfully!', 'success');
      updateVision(vision, setVision, visionContract);
    }).catch((error) => {
      let reasonMessage = getReasonMessage(error);
      reasonMessage = reasonMessage !== null ? reasonMessage.toString() : 'An error occurred during the request' +
        'creation';
      addAlert(reasonMessage, 'error');
    });

    setOpen(false);
    reset();
  };

  const canRequestWithdraw = () => {
    return vision._owner === account && vision._currentState === '1' && vision._currentAmount > 0;
  };


  return (
    <>
      <Button onClick={handleOpen} disabled={!canRequestWithdraw()}>Request Withdraw</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Insert amount to withdraw</DialogTitle>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidation
          autoComplete='off'
        >
          <DialogContent>
            <TextField
              {...register('withdrawAmount')}
              id='standard-number'
              label='Withdraw Amount'
              type='number'
              name='withdrawAmount'
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 13,
                step: '0.001',
                max: toEther(vision._currentAmount),
              }}
              variant='standard'
            />
            <TextField
              {...register('withdrawReason')}
              id='standard-number'
              label='Withdraw Reason'
              type='text'
              name='withdrawReason'
              required
              InputLabelProps={{
                shrink: true,
              }}
              variant='standard'
            />

          </DialogContent>
          <DialogActions>
            <Button size='small' type='submit'>Request</Button>
            <Button size='small' color='secondary' onClick={handleClose}>Close</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>

  );
};
RequestModal.propTypes = {
  vision: PropTypes.oneOfType([PropTypes.object]),
  setVision: PropTypes.func,
};
export default RequestModal;