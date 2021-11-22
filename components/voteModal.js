import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import Button from "@mui/material/Button";
import {Dialog, DialogTitle} from "@material-ui/core";
import {Card, CardActions, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import {Web3Context} from "../pages";
import {toEther} from "../functions/web3Funcs";
import {updateVision} from "../functions/updateVision";
import useAlert from "../hooks/useAlert";
import {getReasonMessage} from "../functions/getReasonMessage";
import useVisionContract from "../hooks/useVisionContract";

const VoteModal = ({vision, setVision, isInvestor}) => {
    const {web3, contract} = useContext(Web3Context);
    const {account} = useWeb3React();
    const {addAlert} = useAlert();
    const [requests, setRequests] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const visionContract = useVisionContract(vision.visionAddress, web3);

    useEffect(async () => {
        const withdrawReqs = await Promise.all(
            Array(parseInt(vision._idxReq)).fill().map((r, idx) => visionContract.methods.requests(idx).call()));
        setRequests(withdrawReqs);

    }, [vision]);

    const vote = async (idx) => {
        visionContract.methods.vote(idx).send({from: account}).then((resp) => {
            addAlert("Voted successfully!", 'success');
            updateVision(web3, vision, setVision);
        }).catch((error) => {
            let reasonMessage = getReasonMessage(error);
            reasonMessage = reasonMessage !== null ? reasonMessage.toString() : "An error occured during voting"
            addAlert(reasonMessage, 'error');
        })
    };

    const withdraw = async (idx) => {
        await visionContract.methods.withdraw(idx).send({from: account}).then((resp) => {
            addAlert("Amount successfully withdrawn!", 'success');
            updateVision(web3, vision, setVision);
        }).catch((error) => {
            let reasonMessage = getReasonMessage(error);
            reasonMessage = reasonMessage !== null ? reasonMessage.toString() : "An error occured during withdrawal"
            addAlert(reasonMessage, 'error');
        })
    };

    const canWithdraw = (req) => req.votes >= vision._sumOfInvestors / 2 && !(req.votes !== 1 && vision._sumOfInvestors === 1)

    return (
        <>
            <Button onClick={handleOpen}>See requests & Vote</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Withdraw Requests</DialogTitle>
                <Grid>
                    <Card sx={{minWidth: 275}}>

                        {requests &&
                        requests.map((req, idx) => (
                            <CardContent key={`req-${idx}`}>
                                <Typography variant="body2">
                                    Withdraw Amount: {toEther(req.withdrawAmount)} Withdraw
                                    Reason: {req.withdrawalReason}
                                </Typography>
                                <Typography variant="body2">
                                    Num of Votes: {req.votes} Total
                                    Investor:{vision._sumOfInvestors} Status: {req.isDone ? 'Completed' : 'Pending'}
                                </Typography>
                                <CardActions>
                                    <Button size="small"
                                            disabled={req.isDone || vision._owner === account || !isInvestor}
                                            onClick={() => {
                                                vote(idx)
                                            }}>Vote</Button>
                                    <Button size="small"
                                            disabled={req.isDone || vision._owner !== account || !canWithdraw(req)}
                                            onClick={() => {
                                                withdraw(idx)
                                            }}>Withdraw</Button>
                                </CardActions>
                            </CardContent>
                        ))
                        }
                        {requests === null || requests.length === 0 && <CardContent>No requests to show</CardContent>}
                        <CardActions>
                            <Button size="small" color="secondary" onClick={handleClose}>Close</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Dialog>
        </>

    )

}
VoteModal.propTypes = {
    vision: PropTypes.oneOfType([PropTypes.object]),
    setVision: PropTypes.func,
    isInvestor: PropTypes.bool
}
export default VoteModal;