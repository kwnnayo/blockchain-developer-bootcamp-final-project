import Vision from "../build/contracts/Vision.json";

export const updateVision = (web3, vision, setVision) => {
    const visionContract = new web3.eth.Contract(
        Vision.abi,
        vision.visionAddress,
    );
    visionContract.methods.getVision().call().then((visionData) => {
        // console.log(visionData);
        visionData.visionAddress = vision.visionAddress;
        setVision(visionData)
    });
}