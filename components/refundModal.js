import * as React from "react";
import {useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import {useWeb3React} from "@web3-react/core";
import {useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {Web3Context} from "../pages";
import {updateVision} from "../functions/updateVision";
import {toEther} from "../functions/web3Funcs";
import {getReasonMessage} from "../functions/getReasonMessage";
import useAlert from "../hooks/useAlert";
import useVisionContract from "../hooks/useVisionContract";

const RefundModal = ({vision, setVision}) => {
    const {web3} = useContext(Web3Context);
    const {account} = useWeb3React();
    const [open, setOpen] = React.useState(false);
    const {addAlert} = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {
        handleSubmit,
        reset
    } = useForm();

    const [refundAmount, setRefundAmount] = useState('0');
    const visionContract = useVisionContract(vision.visionAddress, web3);

    useEffect(()=>{
        visionContract.methods.getInvestorAmount(account).call().then((amount) => {
            setRefundAmount(amount);
        })
    }, [account]);

    const onSubmit = async (data) => {
        visionContract.methods.withdrawInvestedAmount().send({from: account}).then((resp) => {
            console.log("Refund Success!!!", resp);
            updateVision(web3, vision, setVision);
            setRefundAmount('0');
            addAlert("You have been successfully refunded!", 'success');
        }).catch((error) => {
            let reasonMessage = getReasonMessage(error);
            console.log("ERROR in refund :(", reasonMessage);
            addAlert(reasonMessage.toString(), 'error');
        })
        setOpen(false);
        reset();
    };

    return (
        <>
            <Button onClick={handleOpen} disabled={vision._owner === account}>Withdraw Invested Amount</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Invested amount available for refund</DialogTitle>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        '& .MuiTextField-root': {m: 1, width: '25ch'},
                    }}
                    noValidation
                    autoComplete="off"
                >
                    <DialogContent>
                        <TextField
                            id="standard-number"
                            label="Refund Amount"
                            type="number"
                            name="amountToRefund"
                            required
                            value={toEther(refundAmount)}
                            disabled={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                maxLength: 13,
                                step: "0.001"
                            }}
                            variant="standard"
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button size="small" type="submit">Refund</Button>
                        <Button size="small" color="secondary" onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>

    )
}
RefundModal.propTypes = {
    vision: PropTypes.oneOfType([PropTypes.object]),
    setVision: PropTypes.func
}
export default RefundModal;