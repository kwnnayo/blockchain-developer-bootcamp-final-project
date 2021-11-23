import useAlert from '../hooks/useAlert';
import { Alert, Fade } from '@mui/material';
import Box from '@mui/material/Box';

const AlertComponent = () => {
  const { alert } = useAlert();

  return (
    <Box sx={{ display: 'flex' }}>
      {alert && alert.message && (
        <Fade in={true}>
          <Alert sx={{ width: 'fit-content', zIndex: '99999', position: 'absolute', bottom: 0 }}
                 variant='filled' severity={alert.status}>{alert.message}</Alert>
        </Fade>)
      }
    </Box>

  );
};

export default AlertComponent;