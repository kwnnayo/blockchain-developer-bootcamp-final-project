import React, {useContext} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {useWeb3React} from "@web3-react/core";
import {Button} from "@mui/material";
import {useForm} from "react-hook-form";
import {Web3Context} from "../index";
import {createVision} from "../functions/createVision";

const VisionForm = () => {
    const {contract} = useContext(Web3Context);
    const {account} = useWeb3React()

    const {
        register,
        handleSubmit,
        reset
    } = useForm();
    const onSubmit = async (data) => {
        const {title, description, amount, days} = data;
        await createVision(contract, account, title, description, amount, days)
        reset();
    };
    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ '& .MuiTextField-root': {m: 1, width: '25ch'},
                    pt: "50px"
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
                    Create Vision
                </Button>
            </Box>

        </>
    )
}

export default VisionForm;