// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title A Contract for making Visions
/// @author K. Koliopoulou
/// @notice You can use this contract to construct new Visions
contract Etherpreneur {
    address public owner = msg.sender;
    Vision[] private visions;

    event NewVisionCreated(
        address _visionAddress,
        address _owner,
        string _type,
        string _desciption,
        uint _amountGoal
    );

    function createVision(string calldata visionType, string calldata visionDescr, uint amountGoal, uint deadline) external {

        Vision vision = new Vision(msg.sender, amountGoal, visionType, visionDescr, deadline);

        visions.push(vision);

        emit NewVisionCreated(
            address(vision),
            msg.sender,
            visionType,
            visionDescr,
            amountGoal
        );
    }

    function getAllVisions() external view returns (Vision[] memory) {
        return visions;
    }
}

/// @title A Contract that depicts a Vision with its info and functions for investments, payments, votes etc
contract Vision is ReentrancyGuard, AccessControl {
    using SafeMath for uint;
    bytes32 public constant INVESTOR_ROLE = keccak256("INVESTOR_ROLE");

    enum State {
        INVEST,
        ENDED,
        PAID
    }
    uint public amountGoal;
    uint public currentAmount;
    address public owner;
    string public visionType;
    string public visionDescr;
    mapping(address => uint) public investors;
    State public state = State.INVEST;
    uint public sumOfInvestors;
    uint public deadline;

    struct WithdrawReq {
        uint withdrawAmount;
        address receiver;
        string withdrawalReason;
        uint votes;
        mapping(address => bool) votedInvestors;
        bool isDone;
    }

    WithdrawReq[] public requests;
    uint public idxReq = 0;


    modifier onlyOwner(){
        require(msg.sender == owner, "User is not the owner of the Vision");
        _;
    }

    modifier canInvest(){
        require(state == State.INVEST && block.timestamp < deadline, "Vision is not in Invest State");
        _;
    }

    modifier hasEnded(){
        require(state == State.ENDED, "Vision has not ended yet");
        _;
    }

    modifier hasExpired(){
        require(block.timestamp >= deadline && state != State.ENDED, "Vision has not expired");
        _;
    }

    modifier hasInvestorRole(){
        require(hasRole(INVESTOR_ROLE, msg.sender), "Does not have investor role");
        _;
    }

    event VisionCreated(address indexed owner, uint amountGoal, string visionType, string visionDescr);
    event InvestorAdded(address indexed investor);
    event AmountReceived(address indexed _from, uint receivedAmount, uint currentAmount);
    event AmountSent(address indexed _from, uint _amount);
    event WithdrawnSuccess(address indexed _from, uint _amount);
    event GoalAchieved(address indexed owner, uint currentAmount);

    constructor(address _owner, uint _amountGoal, string memory _type, string memory _descr, uint256 numOfDays) {
        owner = _owner;
        amountGoal = _amountGoal;
        visionType = _type;
        visionDescr = _descr;
        deadline = block.timestamp + (numOfDays * 1 days);
        emit VisionCreated(_owner, _amountGoal, _type, _descr);
    }

    /// @notice Invest amount to a Vision
    function invest() external canInvest payable {
        require(msg.sender != owner);
        addInvestor();
        allowForPull(msg.sender, msg.value);
        currentAmount = currentAmount.add(msg.value);
        require(currentAmount <= amountGoal, "Invested amount exceeds requested goal");
        emit AmountReceived(msg.sender, msg.value, currentAmount);
        checkVisionState();
    }

    /// @notice Checks if Vision's goal is reached
    function checkVisionState() private {
        if (currentAmount >= amountGoal) {
            state = State.ENDED;
            emit GoalAchieved(owner, currentAmount);
        }
    }

    /// @notice Adds available amount per investor, pull over push pattern
    /// @param receiver the investor address
    /// @param amount the amount could be withdrawn
    function allowForPull(address receiver, uint amount) private {
        investors[receiver] = investors[receiver].add(amount);
    }

    /// @notice Investors can withdraw invested amount if the Vision is expired
    function withdrawInvestedAmount() public hasInvestorRole hasExpired payable nonReentrant returns (bool){// TODO: Add
        uint amount = investors[msg.sender];

        require(amount != 0);
        investors[msg.sender] = 0;

        (bool success,) = msg.sender.call{value : amount}("");
        if (success) {
            currentAmount = currentAmount.sub(amount);
        } else {
            investors[msg.sender] = amount;
        }
        return success;
    }

    /// @notice Returns the amount invested from the given address
    /// @param investor the investor's address
    function getInvestorAmount(address investor) public view returns (uint) {
        return investors[investor];
    }

    /// @notice Add investor
    /// @dev Before adding, checks if already investor exists
    function addInvestor() private {
        if (investors[msg.sender] == 0) {//TODO:Possible modifier
            sumOfInvestors += 1;
            _setupRole(INVESTOR_ROLE, msg.sender);
            emit InvestorAdded(msg.sender);
        }
    }

    /// @notice Creates a withdraw request
    /// @param _withdrawAmount the amount to be withdrawn
    /// @param _withdrawalReason the reason of the withdrawal
    /// @dev Before adding the new request checks if there is enough amount to request for
    function createWithdrawRequest(uint _withdrawAmount, string calldata _withdrawalReason) public onlyOwner hasEnded {
        require(currentAmount >= _withdrawAmount, 'Requested amount is greater than the available one.');
        WithdrawReq storage newReq = requests.push();
        newReq.receiver = msg.sender;
        newReq.withdrawAmount = _withdrawAmount;
        newReq.withdrawalReason = _withdrawalReason;
        newReq.votes = 0;
        newReq.isDone = false;
        idxReq++;
    }

    /// @notice Vote for a withdrawal request
    /// @param idx the index of the request
    /// @dev Before adding the vote, checks if the request is already done and if the investor has already voted
    function vote(uint idx) public hasEnded hasInvestorRole {
        WithdrawReq storage withdrawReq = requests[idx];
        require(withdrawReq.isDone == false, "Withdrawal already done!");
        require(withdrawReq.votedInvestors[msg.sender] == false, "User already voted");
        withdrawReq.votedInvestors[msg.sender] = true;
        withdrawReq.votes++;
    }

    /// @notice Send the amount requested to the receiver
    /// @param idx the index of the request
    /// @dev Before transferring the amount checks if the withdrawal is already done, if the votes are enough and if the
    /// current amount is enough. The require given for the votes part, handles also the special case of having only
    /// 1 investor.
    function withdraw(uint idx) public onlyOwner payable nonReentrant hasEnded {
        WithdrawReq storage req = requests[idx];
        require(req.isDone == false, "Withdrawal already done!");
        require(req.votes >= sumOfInvestors / 2 && !(req.votes != 1 && sumOfInvestors == 1), "Not enough votes!");
        currentAmount = currentAmount.sub(req.withdrawAmount);
        require(currentAmount >= 0, "Not enough amount!!!");
        (bool success,) = req.receiver.call{value : req.withdrawAmount}("");
        require(success, "Withdrawn has failed!");
        req.isDone = true;
        if (currentAmount == 0) state = State.PAID;
        emit WithdrawnSuccess(req.receiver, req.withdrawAmount);
    }

    /// @notice Returns if user has already voted
    /// @param idx the index of the request
    /// @dev Created in order to disable Vote button on the FE
    function hasUserVoted(uint idx, address voter) public view returns (bool) {
        WithdrawReq storage req = requests[idx];
        return req.votedInvestors[voter];
    }

    // @notice Get vision data
    function getVision() public view returns
    (
        address _owner,
        string memory _type,
        string memory _description,
        State _currentState,
        uint256 _goal,
        uint256 _currentAmount,
        uint256 _deadline,
        uint _sumOfInvestors,
        uint _idxReq
    ) {
        _owner = owner;
        _type = visionType;
        _currentState = state;
        _description = visionDescr;
        _goal = amountGoal;
        _currentAmount = currentAmount;
        _deadline = deadline;
        _sumOfInvestors = sumOfInvestors;
        _idxReq = idxReq;
    }

    receive() external payable {
        revert();
    }

    fallback() external payable {
        revert();
    }
}
