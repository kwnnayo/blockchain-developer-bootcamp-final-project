import useVisionContract from "../hooks/useVisionContract";

export const getVisions = async (web3, contract, setVisions) => {
    setVisions([]);
    const response = await contract.methods.getAllVisions().call();
    // console.log("res", response);
    response.forEach((visionAddr) => {
        const vision = useVisionContract(visionAddr, web3);

        vision.methods.getVision().call().then((visionData) => {
            // console.log(visionData);
            visionData.visionAddress = visionAddr;
            setVisions(v => [...v, visionData])
        });
    })

}