import Vision from '../build/contracts/Vision.json';

export const getVisions = async (web3, contract, setVisions, addAlert) => {
  setVisions([]);
  const response = await contract.methods.getAllVisions().call().catch((error) => {
    addAlert('Error while retrieving visions, ' +
      'check if you are connected to the Rinkeby network', 'error');
  });
  response && response.forEach((visionAddr) => {
    const vision = new web3.eth.Contract(
      Vision.abi,
      visionAddr,
    );

    vision.methods.getVision().call().then((visionData) => {
      visionData.visionAddress = visionAddr;
      setVisions(v => [...v, visionData]);
    });
  });

};