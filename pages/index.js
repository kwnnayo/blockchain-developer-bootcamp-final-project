import React, {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import Etherpreneur from "../build/contracts/Etherpreneur.json";
import Vision from "../build/contracts/Vision.json";
import getWeb3 from "./getWeb3";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const Index = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    useEffect(async () => {
        try {
            console.log("edw");
            // Get network provider and web3 instance.
            const web3 = await getWeb3(true);

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            console.log("exw", accounts);
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            console.log("contr", Etherpreneur.abi);
            const deployedNetwork = Etherpreneur.networks[networkId];
            const instance = new web3.eth.Contract(
                Etherpreneur.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            setWeb3(web3);
            setAccounts(accounts);
            setContract(instance);
            console.log("instanve", instance);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }, []);

    const runExample = async () => {
        // Stores a given value, 5 by default.
        // await contract.methods.set(5).send({ from: accounts[0] });
        const response1 = await contract.methods.createVision('title', 'descr', 11, 1).send({
            from: accounts[0]
        }).then((response) => {

            console.log(response);
        });
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.getAllVisions().call();

        console.log("res", response1);
        console.log("res", response);
        response.forEach((vis) => {
            const vision = new web3.eth.Contract(
                Vision.abi,
                vis,
            );
            vision.methods.getVision().call().then((visionData) => {
                console.log(visionData);

            });
        })
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    } else {
        return (
            <Container maxWidth="sm">
                <h1>Etherpreneur</h1>
                <h3>Ether donate or not...</h3>
                <Box
                    component="form"
                    sx={{

                        '& .MuiTextField-root': {m: 1, width: '25ch'},
                        pt: "50px"
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Required"
                            name="title"
                            placeholder="Title"
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Required"
                            name="description"
                            placeholder="Description"
                        />
                        <TextField
                            id="standard-number"
                            label="Funding Amount"
                            type="number"
                            name={"amount"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                        />
                        <TextField
                            id="standard-number"
                            label="Number of days active"
                            type="number"
                            name={"days"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                        />
                    </div>
                </Box>

                <button onClick={runExample}>Create Vision</button>
            </Container>
        );
    }

}

export default Index;
