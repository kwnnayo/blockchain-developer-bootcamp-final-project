import * as React from 'react';
import { useContext } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { invest } from '../functions/invest';
import { Web3Context } from '../pages';
import useAlert from '../hooks/useAlert';
import { toEther } from '../functions/web3Funcs';
import useVisionContract from '../hooks/useVisionContract';

const InvestModal = ({ vision, setVision }) => {
  const { web3, contract } = useContext(Web3Context);
  const { account } = useWeb3React();
  const { addAlert } = useAlert();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const visionContract = useVisionContract(vision.visionAddress, web3);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const { investAmount } = data;
    await invest(vision, account, investAmount, setVision, addAlert, visionContract); //TODO: move update outside
    setOpen(false);
    reset();
  };

  const canInvest = () => {
    return vision._owner !== account && vision._currentState === '0';
  };

  return (
    <>
      <Button onClick={handleOpen} disabled={!canInvest()}>Invest</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Insert amount to invest</DialogTitle>
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
              {...register('investAmount')}
              id='standard-number'
              label='Invest Amount'
              type='number'
              name='investAmount'
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 13,
                step: '0.001',
                max: toEther((vision._goal - vision._currentAmount).toString()),
              }}
              placeholder={'Ξ'}
              variant='standard'
            />

          </DialogContent>
          <DialogActions>
            <Button size='small' type='submit'>Invest</Button>
            <Button size='small' color='secondary' onClick={handleClose}>Close</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>

  );
};
InvestModal.propTypes = {
  vision: PropTypes.oneOfType([PropTypes.object]),
  setVision: PropTypes.func,
};
export default InvestModal;