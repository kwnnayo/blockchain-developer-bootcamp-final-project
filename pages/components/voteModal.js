import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import Button from "@mui/material/Button";
import {Dialog, DialogTitle} from "@material-ui/core";
import {Card, CardActions, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Vision from "../../build/contracts/Vision.json";
import {Web3Context} from "../index";
import {toEther} from "../functions/web3Funcs";
import {updateVision} from "../functions/updateVision";

const VoteModal = ({vision, setVision}) => {
    const {web3, contract} = useContext(Web3Context);
    const {account} = useWeb3React();
    const [requests, setRequests] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const visionContract = new web3.eth.Contract(
        Vision.abi,
        vision.visionAddress,
    );
    useEffect(async () => {
        const withdrawReqs = await Promise.all(
            Array(parseInt(vision._idxReq)).fill().map((r, idx) => visionContract.methods.requests(idx).call()));
        setRequests(withdrawReqs);
        console.log("exw", withdrawReqs);
    }, [vision]);

    const vote = async (idx) => {
        console.log("exw ta reqs", requests);
        console.log("preparing for vote for index", idx);
        visionContract.methods.vote(idx).send({from: account}).then((resp) => {
            console.log("Voted!!!!", resp);
            updateVision(web3, vision, setVision);
        }).catch((error) => {
            alert(
                `Failed to vote.`,
            );
            console.log("ERROR :(", error);
        })
    };

    const withdraw = async (idx) => {
        console.log("exw ta reqs", requests);
        console.log("preparing to withdraw for index", idx);
        console.log("efefwfwe", contract, account);
        visionContract.methods.withdraw(idx).send({from: account}).then((resp) => {
            console.log("Withdraw Success!!!!", resp);
            updateVision(web3, vision, setVision);
        }).catch((error) => {
            alert(
                `Failed to withdraw.`,
            );
            console.log("ERROR :(", error);
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
                                    Num of Votes: {req.votes} Total Investor:{vision._sumOfInvestors} Status: {req.isDone ? 'Completed' : 'Pending'}
                                </Typography>
                                <CardActions>
                                    <Button size="small" disabled={req.isDone || vision._owner === account} onClick={() => {
                                        vote(idx)
                                    }}>Vote</Button>
                                    <Button size="small" disabled={req.isDone || vision._owner !== account || !canWithdraw(req)}
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
    setVision: PropTypes.func
}
export default VoteModal;