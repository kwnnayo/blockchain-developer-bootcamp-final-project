import React, {useContext} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {useWeb3React} from "@web3-react/core";
import {Button} from "@mui/material";
import {useForm} from "react-hook-form";
import {Grid} from "@material-ui/core";
import {Web3Context} from "../pages";
import {toWei} from "../functions/web3Funcs";
import Vision from "../build/contracts/Vision.json";
import PropTypes from "prop-types";
import useAlert from "../hooks/useAlert";
import {getReasonMessage} from "../functions/getReasonMessage";

const VisionForm = ({visions, setVisions}) => {
    const {web3, contract} = useContext(Web3Context);
    const {account} = useWeb3React();
    const {addAlert} = useAlert();

    const {
        register,
        handleSubmit,
        reset
    } = useForm();
    const onSubmit = async (data) => {
        const {title, description, amount, days} = data;
        await contract.methods.createVision(title, description, toWei(amount), days).send({
            from: account
        }).then((response) => {
            // console.log(response);
            const visionAddress = response.events.NewVisionCreated.returnValues._visionAddress;
            const visionContract = new web3.eth.Contract(
                Vision.abi,
                visionAddress,
            );
            visionContract.methods.getVision().call().then((visionData) => {
                // console.log(visionData);
                visionData.visionAddress = visionAddress;
                setVisions([...visions, visionData])
            });
            addAlert("Vision created successfully!", 'success');
        }).catch((error) => {
            let reasonMessage = getReasonMessage(error);
            console.log("ERROR during vision creation :(", reasonMessage);
            addAlert(reasonMessage.toString(), 'error');
        })
        reset();
    };
    return (
        <Grid container justify = "center">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '25ch'},
                    pt: "50px",
                }}
                noValidation
                autoComplete="off"
            >
                <div>
                    <TextField
                        {...register("title")}
                        required
                        id="outlined-required"
                        label="Title"
                        name="title"
                        placeholder="Title"
                    />
                    <TextField
                        {...register("description")}
                        required
                        id="outlined-required"
                        label="Description"
                        name="description"
                        placeholder="Description"
                    />
                </div>
                <div>
                    <TextField
                        {...register("amount")}
                        id="standard-number"
                        label="Goal Amount"
                        type="number"
                        name="amount"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            maxLength: 13,
                            step: "0.001",
                            min:"0.001",
                        }}
                        placeholder={'Ξ'}
                        variant="standard"
                    />
                    <TextField
                        {...register("days")}
                        id="standard-number"
                        label="Number of days active"
                        type="number"
                        name="days"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                    />
                </div>
                <Button type="submit">
                    Create a Vision
                </Button>
            </Box>

        </Grid>
    )
}
VisionForm.propTypes = {
    visions: PropTypes.oneOfType([PropTypes.object]),
    setVisions: PropTypes.func
}
export default VisionForm;