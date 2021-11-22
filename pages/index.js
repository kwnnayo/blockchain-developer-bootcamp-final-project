import React, { createContext, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { injected } from '../functions/Connector';
import VisionForm from '../components/visionForm';
import Etherpreneur from '../build/contracts/Etherpreneur.json';
import VisionCardList from '../components/visionCardList';
import { getVisions } from '../functions/getVisions';
import Box from '@mui/material/Box';
import AlertComponent from '../components/AlertComponent';
import useAlert from '../hooks/useAlert';
import { InfoOutlined } from '@mui/icons-material';
import { env } from '../next.config';


export const Web3Context = createContext(null);
const Index = () => {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const { addAlert } = useAlert();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [visions, setVisions] = useState([]);
  const [toggleLogo, setToggleLogo] = useState(false);
  const [showVisions, setShowVisions] = useState(false);


  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    connector?.getProvider().then(provider => {
      // Instantiate web3.js
      const instance = new Web3(provider);
      setWeb3(instance);
    });
  }, [active, connector]);

  useEffect(async () => {
    try {
      if (web3 === null) {
        return;
      }
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        Etherpreneur.abi,
        env.ETHERPRENEUR_ADDR,
      );
      setContract(instance);

    } catch (error) {
      // Catch any errors for any of the above operations.
      addAlert(`Failed to load web3, accounts, or contract. Please check your Metamask account and refresh.`, 'error');
    }
  }, [web3]);

  useEffect(async () => {
    contract !== null && await getVisions(web3, contract, setVisions, addAlert);
  }, [contract]);

  return (
    <>
      <Web3Context.Provider value={{ web3, contract }}>
        <Container disableGutters maxWidth='sm' component='main' sx={{ pt: 8, pb: 6 }}>
          <Typography
            align='center'
            gutterBottom
          >
            {toggleLogo ? <img src='/images/logo3.png' /> : <img src='/images/logo.png' />}
          </Typography>
          <Typography variant='h5' align='center' color='text.secondary' component='p'>
            Where you can ether donate or not...
          </Typography>
          {toggleLogo && <Typography variant='subtitle1' align='center' color='text.secondary' component='p'>
            Turn your vision into reality or help others to do so.
            Create a vision, or invest to an existing one. Control withdrawals by voting
            for each one of them.
          </Typography>}
        </Container>
        <Container maxWidth='md'>
          <Button onClick={() => connect()}>Connect to MetaMask</Button>
          {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
          <Button onClick={() => disconnect()}>Disconnect</Button>
          <VisionForm visions={visions} setVisions={setVisions} />
        </Container>
        <Container disableGutters maxWidth='md' sx={{ pb: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {!showVisions ? <Box>
                <Button onClick={async () => {
                  await getVisions(web3, contract, setVisions, addAlert);
                  setShowVisions(!showVisions);
                }}>Show All Visions
                </Button>
              </Box> :
              <Box>
                <Button onClick={async () => {
                  setShowVisions(!showVisions);
                }}>Hide Visions
                </Button>
              </Box>
            }
            <Box>
              <Button onClick={() => {
                setToggleLogo(!toggleLogo);
              }}>
                <Box display={'flex'}>
                  <Box>{toggleLogo ? 'Hide me the vision' : 'Show me The Vision'} </Box>
                  <Box sx={{ pl: '3px' }}>
                    <InfoOutlined
                      fontSize={'small'} />
                  </Box>
                </Box>
              </Button>
            </Box>
          </Box>
        </Container>
        {
          showVisions && <VisionCardList visions={visions} />
        }
        <Box sx={{ display: 'flex', position: 'relative', justifyContent: 'flex-start' }}>
          <AlertComponent />
        </Box>;

      </Web3Context.Provider>
    </>
  )
    ;
};

export default Index;
