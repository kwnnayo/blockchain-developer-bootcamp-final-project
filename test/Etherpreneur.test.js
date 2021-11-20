const {catchRevert} = require("./exceptionsHelpers.js");

const Etherpreneur = artifacts.require("Etherpreneur");
const Vision = artifacts.require("Vision");

contract("Etherpreneur", (accounts) => {
    const [contractOwner, alice, bob] = accounts;
    beforeEach(async () => {
        instance = await Etherpreneur.new();
        await instance.createVision('title', 'description', 100, 10);
    });

    it("etherpreneur is owned by owner", async () => {
        assert.equal(
            await instance.owner.call(),
            contractOwner,
            "etherpreneur owner is not correct",
        );
    });

    it("should emit NewVisionCreated when creating a new vision", async () => {
        let eventEmitted = false;
        const tx = await instance.createVision('title', 'description', 100, 10);
        if (tx.logs[0].event == "NewVisionCreated") {
            eventEmitted = true;
        }
        assert.equal(
            eventEmitted,
            true,
            "creating a new Vision should emit a NewVisionCreated event",
        );
    });

    it("should have one vision", async () => {
        const visions = await instance.getAllVisions();
        assert.equal(
            visions.length,
            1,
            "should have returned one vision",
        );
    });
});

contract("Vision", (accounts) => {
    const [contractOwner, alice, bob] = accounts;
    beforeEach(async () => {
        visionInstance = await Vision.new(contractOwner, 100, 'title', 'description', 10);
    });


    it("vision is owned by owner", async () => {
        assert.equal(
            await visionInstance.owner.call(),
            contractOwner,
            "vision owner is not correct",
        );
    });

    it("should log an AmountReceived event when an invest is made", async () => {
        const result = await visionInstance.invest({from: alice, value: 10});
        const expected = {_from: alice, receivedAmount: 10, currentAmount: 10}
        const logAccAddr = result.logs[2].args._from;
        const logReceivedAmnt = result.logs[2].args.receivedAmount.toNumber();
        const logCurrAmnt = result.logs[2].args.currentAmount.toNumber();

        assert.equal(
            expected._from,
            logAccAddr,
            "AmountReceived event _from property not emitted, check invest method",
        );
        assert.equal(
            expected.receivedAmount,
            logReceivedAmnt,
            "AmountReceived event receivedAmount property not emitted, check invest method",
        );
        assert.equal(
            expected.currentAmount,
            logCurrAmnt,
            "AmountReceived event currentAmount property not emitted, check invest method",
        );
    });

    it("should log an InvestorAdded event when an invest is made", async () => {
        const result = await visionInstance.invest({from: alice, value: 10});
        const expected = {investor: alice}
        const logInvestor = result.logs[1].args.investor;

        assert.equal(
            expected.investor,
            logInvestor,
            "InvestorAdded event investor property not emitted, check invest method",
        );
    });

    it("should log a GoalAchieved event when an invest goal is reached", async () => {
        const result = await visionInstance.invest({from: alice, value: 100});
        const expected = {owner: contractOwner, currentAmount: 100}
        const logOwner = result.logs[3].args.owner;
        const logCurrentAmount = result.logs[3].args.currentAmount;

        assert.equal(
            expected.owner,
            logOwner,
            "GoalAchieved event owner property not emitted, check invest method",
        );

        assert.equal(
            expected.currentAmount,
            logCurrentAmount,
            "GoalAchieved event owner property not emitted, check invest method",
        );
    });

    it("should revert if the invested amount exceeds the goal amount", async () => {
        await visionInstance.invest({from: alice, value: 10})
        await catchRevert(visionInstance.invest({from: alice, value: 100}));
    });

    it("should revert if the owner tries to invest himself", async () => {
        await catchRevert(visionInstance.invest({from: contractOwner, value: 100}));
    });

    it("should revert if the vision is not in invest state", async () => {
        await visionInstance.invest({from: alice, value: 100})
        await catchRevert(visionInstance.invest({from: alice, value: 100}));
    });

    describe("enum State", () => {
        let enumState;
        before(() => {
            enumState = Vision.enums.State;
            assert(
                enumState,
                "The contract should define an Enum called State"
            );
        });

        it("should define `INVEST`", () => {
            assert(
                enumState.hasOwnProperty('INVEST'),
                "The enum does not have a `INVEST` value"
            );
        });
        it("should define `ENDED`", () => {
            assert(
                enumState.hasOwnProperty('ENDED'),
                "The enum does not have a `ENDED` value"
            );
        });
        it("should define `PAID`", () => {
            assert(
                enumState.hasOwnProperty('PAID'),
                "The enum does not have a `PAID` value"
            );
        });
        it("should define `EXPIRED`", () => {
            assert(
                enumState.hasOwnProperty('EXPIRED'),
                "The enum does not have a `EXPIRED` value"
            );
        });
    });
});