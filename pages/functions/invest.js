import Vision from "../../build/contracts/Vision.json";
import {toWei} from "./web3Funcs";
import {updateVision} from "./updateVision";

export const invest = async (web3,contract, vision, account, investAmount, setVision) => {

    if (vision._goalAmount - investAmount < 0) return alert('Amounts exceeds goal amount')
    const visionContract = new web3.eth.Contract(
        Vision.abi,
        vision.visionAddress,
    );
    visionContract.methods.invest().send({
        from: account,
        value: toWei(investAmount)
    }).then((resp) => {
        console.log("Invested!!!!", resp);
        updateVision(web3, vision, setVision);
    }).catch((error) => {
        alert(
            `Failed to invest.`,
        );
        console.log("ERROR :(", error);
    })
}