export const createVision = async (contract, accounts, title, descr, amount, deadline) => {
    const response1 = await contract.methods.createVision(title, descr, amount, deadline).send({
        from: accounts[0]
    }).then((response) => {

        console.log(response);
    });
    console.log("Created Vision::", response1);
};

