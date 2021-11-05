import Vision from "../../build/contracts/Vision.json";
import getWeb3 from "../getWeb3";

export const getVisions = async (web3, contract, setVisions) => {
    console.log("mpika me", contract);
    setVisions([]);
    const response = await contract.methods.getAllVisions().call();
    console.log("res", response);
    response.forEach((visionAddr) => {
        const vision = new web3.eth.Contract(
            Vision.abi,
            visionAddr,
        );
        vision.methods.getVision().call().then((visionData) => {
            console.log(visionData);
            visionData.visionAddress = visionAddr;
            setVisions(v => [...v, visionData])
        });
    })

}