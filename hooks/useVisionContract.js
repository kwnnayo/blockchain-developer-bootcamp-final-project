import Vision from '../build/contracts/Vision.json';
import { useContext } from 'react';
import { Web3Context } from '../pages';

const useVisionContract = (address) => {
  const { web3 } = useContext(Web3Context);
  return new web3.eth.Contract(
    Vision.abi,
    address,
  );

};

export default useVisionContract;