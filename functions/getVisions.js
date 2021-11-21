import useVisionContract from "../hooks/useVisionContract";

export const getVisions = async (web3, contract, setVisions, addAlert) => {
    setVisions([]);
    const response = await contract.methods.getAllVisions().call().catch((error) => {
        addAlert("Error while retrieving visions, " +
            "check if you are connected to the Rinkeby network", "error");
    });
    // console.log("res", response);
    response && response.forEach((visionAddr) => {
        const vision = useVisionContract(visionAddr, web3);

        vision.methods.getVision().call().then((visionData) => {
            // console.log(visionData);
            visionData.visionAddress = visionAddr;
            setVisions(v => [...v, visionData])
        });
    })

}