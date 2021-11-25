import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle } from '@material-ui/core';
import { Card, CardActions, CardContent, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import useVisionContract from '../hooks/useVisionContract';
import RequestCard from './requestCard';

const VoteModal = ({ vision, setVision, isInvestor }) => {
  const [requests, setRequests] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const visionContract = useVisionContract(vision.visionAddress);

  useEffect(async () => {
    const withdrawReqs = await Promise.all(
      Array(parseInt(vision._idxReq)).fill().map((r, idx) => visionContract.methods.requests(idx).call()));
    setRequests(withdrawReqs);

  }, [vision]);

  return (
    <>
      <Button onClick={handleOpen}>See requests & Vote</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Withdraw Requests</DialogTitle>
        <Grid>
          <Card sx={{ minWidth: 275 }}>

            {requests &&
            requests.map((req, idx) => (
              <RequestCard key={`${idx}-req-card`} isInvestor={isInvestor} vision={vision} setVision={setVision}
                           idx={idx} req={req} />
            ))
            }
            {requests === null || requests.length === 0 && <CardContent>No requests to show</CardContent>}
            <CardActions>
              <Button size='small' color='secondary' onClick={handleClose}>Close</Button>
            </CardActions>
          </Card>
        </Grid>
      </Dialog>
    </>

  );

};
VoteModal.propTypes = {
  vision: PropTypes.oneOfType([PropTypes.object]),
  setVision: PropTypes.func,
  isInvestor: PropTypes.bool,
};
export default VoteModal;