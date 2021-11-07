import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import {useState} from "react";
import {getState} from "../functions/getState";
import InvestModal from "./investModal";
import {toEther} from "../functions/web3Funcs";


const VisionCard = ({data}) => {
    const [vision, setVision] = useState(data);
    return(
        <Grid item md={3}>
            <Card sx={{minWidth: 275}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {vision._type}
                    </Typography>
                    <Typography sx={{mb: 1.5}} color="text.secondary">
                        {vision._description}
                    </Typography>
                    <Typography variant="body2">
                        Goal: {toEther(vision._goal)} Current Amount: {toEther(vision._currentAmount)}
                    </Typography>
                    <Typography variant="body2">
                        Current state: {getState(vision._currentState)}
                    </Typography>
                    <Typography variant="body2">
                        Active until: {moment.unix(vision._deadline).toString()}
                    </Typography>
                </CardContent>
                <CardActions>
                    <InvestModal vision={vision} setVision={setVision}/>
                </CardActions>
            </Card>
        </Grid>
    )}
VisionCard.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object])
}
export default VisionCard;