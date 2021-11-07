import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import {getState} from "../functions/getState";
import InvestModal from "./investModal";


const VisionCard = ({data}) => (
        <Grid item md={3}>
            <Card sx={{minWidth: 275}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {data._type}
                    </Typography>
                    <Typography sx={{mb: 1.5}} color="text.secondary">
                        {data._description}
                    </Typography>
                    <Typography variant="body2">
                        Goal: {data._goal} Current Amount: {data._currentAmount}
                    </Typography>
                    <Typography variant="body2">
                        Current state: {getState(data._currentState)}
                    </Typography>
                    <Typography variant="body2">
                        Active until: {moment.unix(data._deadline).toString()}
                    </Typography>
                </CardContent>
                <CardActions>
                    <InvestModal vision={data}/>
                </CardActions>
            </Card>
        </Grid>
    )
VisionCard.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object])
}
export default VisionCard;