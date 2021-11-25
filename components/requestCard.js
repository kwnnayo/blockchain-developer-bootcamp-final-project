import { CardActions, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { toEther } from '../functions/web3Funcs';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { updateVision } from '../functions/updateVision';
import { getReasonMessage } from '../functions/getReasonMessage';
import useVisionContract from '../hooks/useVisionContract';
import { useWeb3React } from '@web3-react/core';
import useAlert from '../hooks/useAlert';
import { Web3Context } from '../pages';
import PropTypes from 'prop-types';

const RequestCard = ({ req, idx, vision, setVision, isInvestor }) => {
  const { web3 } = useContext(Web3Context);
  const visionContract = useVisionContract(vision.visionAddress, web3);
  const { account } = useWeb3React();
  const { addAlert } = useAlert();
  const [userHasVoted, setUserHasVoted] = useState(false);

  useEffect(async () => {
    let hasUserAlreadyVoted = await visionContract.methods.hasUserVoted(idx, account).call();
    setUserHasVoted(hasUserAlreadyVoted);
  }, []);

  const vote = async (idx) => {
    visionContract.methods.vote(idx).send({ from: account }).then((resp) => {
      addAlert('Voted successfully!', 'success');
      updateVision(vision, setVision, visionContract);
      setUserHasVoted(true);
    }).catch((error) => {
      let reasonMessage = getReasonMessage(error);
      reasonMessage = reasonMessage !== null ? reasonMessage.toString() : 'An error occured during voting';
      addAlert(reasonMessage, 'error');
    });
  };

  const withdraw = async (idx) => {
    await visionContract.methods.withdraw(idx).send({ from: account }).then((resp) => {
      addAlert('Amount successfully withdrawn!', 'success');
      updateVision(vision, setVision, visionContract);
    }).catch((error) => {
      let reasonMessage = getReasonMessage(error);
      reasonMessage = reasonMessage !== null ? reasonMessage.toString() : 'An error occured during withdrawal';
      addAlert(reasonMessage, 'error');
    });
  };

  const canWithdraw = (req) => req.votes >= vision._sumOfInvestors / 2 && !(req.votes !== 1 && vision._sumOfInvestors === 1);

  return (
    <CardContent>
      <Typography variant='body2'>
        Withdraw Amount: {toEther(req.withdrawAmount)} Withdraw
        Reason: {req.withdrawalReason}
      </Typography>
      <Typography variant='body2'>
        Num of Votes: {req.votes} Total
        Investor:{vision._sumOfInvestors} Status: {req.isDone ? 'Completed' : 'Pending'}
      </Typography>
      <CardActions>
        <Button size='small'
                disabled={req.isDone || vision._owner === account || !isInvestor || userHasVoted}
                onClick={() => {
                  vote(idx);
                }}>{userHasVoted ? 'Already Voted' : 'Vote'}</Button>
        <Button size='small'
                disabled={req.isDone || vision._owner !== account || !canWithdraw(req)}
                onClick={() => {
                  withdraw(idx);
                }}>Withdraw</Button>
      </CardActions>
    </CardContent>
  );
};

RequestCard.propTypes = {
  vision: PropTypes.oneOfType([PropTypes.object]),
  setVision: PropTypes.func,
  req: PropTypes.oneOfType([PropTypes.object]),
  idx: PropTypes.number,
  isInvestor: PropTypes.bool,
};

export default RequestCard;