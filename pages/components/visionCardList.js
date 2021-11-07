import React, {useContext, useState} from "react";
import Container from "@mui/material/Container";
import {Button, Grid} from "@mui/material";
import {getVisions} from "../functions/getVisions";
import {Web3Context} from "../index";
import VisionCard from "./visionCard";

const VisionCardList = () => {
    const {web3, contract} = useContext(Web3Context);
    const [visions, setVisions] = useState([]);
    return (
        <>
            <Container maxWidth="md">
                <Button onClick={async () => {
                    await getVisions(web3, contract, setVisions);
                }}>Show All Visions
                </Button>
            </Container>
            <Container>
                <Grid container spacing={24}>
                    {visions &&

                    visions.map((vision, idx) => (
                        <VisionCard key={`${idx}vis`} data={vision}/>)) // TODO:Update visions in order to rerender
                    }
                </Grid>
            </Container>
        </>
    )
}
export default VisionCardList;