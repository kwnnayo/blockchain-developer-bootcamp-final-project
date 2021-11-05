import PropTypes from "prop-types";
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import {invest} from "../functions/invest";

const VisionComp = ({web3,data, contract}) => (
    <Grid item md={3}>
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {data._type}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data._description}
                </Typography>
                <Typography variant="body2">
                   Goal: {data._goal} Current Amount: {data._currentAmount}
                </Typography>
                <Typography variant="body2">
                   Active until: {data._deadline}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={()=>{invest(web3,data,contract, web3.utils.toBN(1))}}>Invest</Button>
            </CardActions>
        </Card>
    </Grid>
    )

export default VisionComp;