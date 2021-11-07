import React, {createContext, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import {useWeb3React} from "@web3-react/core"
import Web3 from 'web3'
import {Button} from "@mui/material";
import {injected} from "./components/Connector"
import VisionForm from "./components/visionForm";
import Etherpreneur from "../build/contracts/Etherpreneur.json";
import VisionCardList from "./components/visionCardList";

export const Web3Context = createContext(null);
const Index = () => {
    const {active, account, library, connector, activate, deactivate} = useWeb3React()
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);


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
            console.log("contr", Etherpreneur.abi);
            const deployedNetwork = Etherpreneur.networks[networkId];
            const instance = new web3.eth.Contract(
                Etherpreneur.abi,
                deployedNetwork && deployedNetwork.address,
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
                <Container maxWidth="md">
                    <h1>Etherpreneur</h1>
                    <h3>Ether donate or not...</h3>
                    <Button onClick={() => connect()}>Connect to MetaMask</Button>
                    {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
                    <Button onClick={() => disconnect()}>Disconnect</Button>
                    <VisionForm/>
                </Container>
                <VisionCardList/>
            </Web3Context.Provider>
        </>
    );
}

export default Index;
