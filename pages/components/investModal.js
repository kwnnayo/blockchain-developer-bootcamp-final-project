import * as React from "react";
import {useContext} from "react";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import {useWeb3React} from "@web3-react/core";
import {useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {useStyles} from "../../styles/useStyles";
import {invest} from "../functions/invest";
import {Web3Context} from "../index";

const InvestModal = ({vision}) => {
    const {web3} = useContext(Web3Context);
    const {account} = useWeb3React();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {
        register,
        handleSubmit,
        reset
    } = useForm();
    const onSubmit = async (data) => {
        const {investAmount} = data;
        await invest(web3, vision, account, web3.utils.toBN(investAmount))
        reset();
    };

    return (
        <>
            <Button onClick={handleOpen}>Invest</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Insert amount to invest</DialogTitle>
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
                            {...register("investAmount")}
                            id="standard-number"
                            label="Invest Amount"
                            type="number"
                            name="investAmount"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button size="small" type="submit">Invest</Button>
                        <Button size="small" color="secondary" onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>

    )
}
InvestModal.propTypes = {
    vision: PropTypes.oneOfType([PropTypes.object])
}
export default InvestModal;