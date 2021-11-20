import React, {createContext, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import {useWeb3React} from "@web3-react/core"
import Web3 from 'web3'
import {Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import {injected} from "../functions/Connector"
import VisionForm from "../components/visionForm";
import Etherpreneur from "../build/contracts/Etherpreneur.json";
import VisionCardList from "../components/visionCardList";
import {getVisions} from "../functions/getVisions";
import Box from "@mui/material/Box";
import {env} from "../next.config";


export const Web3Context = createContext(null);
const Index = () => {
    const {active, account, library, connector, activate, deactivate} = useWeb3React()
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [visions, setVisions] = useState([]);


    async function connect() {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
        connector?.getProvider().then(provider => {
            // Instantiate web3.js
            const instance = new Web3(provider)
            setWeb3(instance)
        })
    }, [active, connector])

    useEffect(async () => {
        try {
            if (web3 === null) {
                return
            }
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            // console.log("contr", Etherpreneur.abi);
            // const deployedNetwork = Etherpreneur.networks[networkId];
            // console.log("exwww", deployedNetwork.address,  env.ETHERPRENEUR_ADDR);
            const instance = new web3.eth.Contract(
                Etherpreneur.abi,
                // deployedNetwork && deployedNetwork.address, // Only for localhost
                env.ETHERPRENEUR_ADDR
            );
            setContract(instance);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Please check your account and refresh.`,
            );
        }
    }, [web3]);

    return (
        <>
            <Web3Context.Provider value={{web3, contract}}>
                <Container disableGutters maxWidth="sm" component="main" sx={{pt: 8, pb: 6}}>
                    <Typography
                        align="center"
                        gutterBottom
                    >
                        <img src="/images/logo.png"/>
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        Where you can ether donate or not...
                    </Typography>
                </Container>
                <Container maxWidth="md" >
                    <Button onClick={() => connect()}>Connect to MetaMask</Button>
                    {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
                    <Button onClick={() => disconnect()}>Disconnect</Button>
                    <VisionForm visions={visions} setVisions={setVisions}/>
                </Container>
                <Container maxWidth="md">
                    <Button onClick={async () => {
                        await getVisions(web3, contract, setVisions);
                    }}>Show All Visions
                    </Button>
                </Container>
                <VisionCardList visions={visions}/>
            </Web3Context.Provider>
        </>
    );
}

export default Index;
