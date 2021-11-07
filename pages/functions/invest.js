import Vision from "../../build/contracts/Vision.json";

export const invest = (web3, vision, account, investAmount) => {
    if (investAmount - vision._currentAmount < 0) return alert('Amounts exceeds goal amount')
    const visionContract = new web3.eth.Contract(
        Vision.abi,
        vision.visionAddress,
    );
    visionContract.methods.invest().send({
        from: account,
        value: investAmount
    }).then((resp) => {
        console.log("Invested!!!!", resp);
    }).catch((error) => {
        console.log("ERROR :(", error);
    })
}