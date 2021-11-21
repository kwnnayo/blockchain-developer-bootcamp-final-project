import Vision from "../build/contracts/Vision.json";

function useVisionContract (address, web3)  {
    return  new web3.eth.Contract(
        Vision.abi,
        address,
    );
}

export default useVisionContract;