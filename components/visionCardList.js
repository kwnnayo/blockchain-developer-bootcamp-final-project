import React from 'react';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import VisionCard from './visionCard';

const VisionCardList = ({ visions }) => (
  <>

    <Container>
      {visions &&
      <Container maxWidth='md' component='main'>
        <Grid container spacing={5} alignItems='flex-end'>
          {visions &&

          visions.map((vision, idx) => (
            <VisionCard key={`${idx}vis`} data={vision} />))
          }

        </Grid>
      </Container>}
    </Container>
  </>
);
VisionCardList.propTypes = {
  visions: PropTypes.oneOfType([PropTypes.array]),
};
export default VisionCardList;