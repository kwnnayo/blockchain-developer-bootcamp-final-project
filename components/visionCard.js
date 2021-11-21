import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import moment, {now} from "moment";
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

    const hasExpired = () => {
        return moment.unix(vision._deadline) <= now() && vision._currentState !== '1';
    }

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
                        <b>Goal:</b> {toEther(vision._goal)} Ξ

                    </Typography>
                    <Typography variant="body2">
                        <b>Current Amount:</b> {toEther(vision._currentAmount)} Ξ
                    </Typography>
                    <Typography variant="body2">
                        <b>Current state:</b> {hasExpired() ? "Expired" : getState(vision._currentState)}
                    </Typography>
                    <Typography variant="body2">
                        <b>Active until:</b> {moment.unix(vision._deadline).toString()}
                    </Typography>
                </CardContent>
                <CardActions>
                    {hasExpired() ? <RefundModal vision={vision} setVision={setVision}/> :
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