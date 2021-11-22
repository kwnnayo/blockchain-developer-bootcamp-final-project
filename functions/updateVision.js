import useVisionContract from '../hooks/useVisionContract';

export const updateVision = (web3, vision, setVision) => {
    const visionContract = useVisionContract(vision.visionAddress, web3);

    visionContract.methods.getVision().call().then((visionData) => {
        visionData.visionAddress = vision.visionAddress;
        setVision(visionData);
    });
};