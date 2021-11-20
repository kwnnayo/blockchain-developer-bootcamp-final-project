import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import {useWeb3React} from "@web3-react/core";
import {CardHeader, Chip} from "@material-ui/core";
import {getState} from "../functions/getState";
import InvestModal from "./investModal";
import {toEther} from "../functions/web3Funcs";
import RefundModal from "./refundModal";
import RequestModal from "./requestModal";
import VoteModal from "./voteModal";


const VisionCard = ({data}) => {
    const [vision, setVision] = useState(data);
    const {account} = useWeb3React()

    return (
        <Grid
            item
            key={data._type}
            xs={12}
            sm={12}
            md={4}
        >
            <Card sx={{minWidth: 275}}>
                <CardContent>
                    <CardHeader
                        title={vision._type}
                        titleTypographyProps={{align: 'center'}}
                        action={vision._owner === account ? <Chip label="Owned"/> : null}
                    />
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
                    {vision._currentState === '3' ? <RefundModal vision={vision} setVision={setVision}/> :
                        <>
                            <InvestModal vision={vision} setVision={setVision}/>
                            <RequestModal vision={vision} setVision={setVision}/>
                            <VoteModal vision={vision} setVision={setVision}/>
                        </>
                    }
                </CardActions>
            </Card>
        </Grid>
    )
}
VisionCard.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object])
}
export default VisionCard;