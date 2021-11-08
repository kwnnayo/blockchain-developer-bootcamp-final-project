// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
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
contract Vision is ReentrancyGuard {
    using SafeMath for uint;

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

    uint idxReq;
    mapping(address => mapping(uint => WithdrawReq)) public requests; //TODO:REmove public, only for debugging reasons


    modifier onlyOwner(){
        require(msg.sender == owner, "User is not the owner of the Project");
        _;
    }

    modifier canInvest(){
        require(state == State.INVEST && block.timestamp < deadline, "Project is not in Invest State");
        _;
    }

    modifier hasEnded(){
        require(state == State.ENDED, "Project has not ended yet");
        _;
    }

    modifier goalReached(){
        require(currentAmount >= amountGoal, "Goal has not been reached");
        _;
    }

    modifier isInvestor(){
        require(investors[msg.sender] > 0, "No amount was invested");
        _;
    }

    event VisionCreated(address indexed owner, uint amountGoal, string visionType, string visionDescr);
    event InvestorAdded(address indexed investor);
    event AmountReceived(address indexed _from, uint receivedAmount, uint currentAmount);
    event AmountSent(address indexed _from, uint _amount);
    event WithdrawnSuccess(address indexed _from, uint _amount);
    event WithdrawnFailure(address indexed _from, uint _amount);
    event GoalAchieved(address indexed owner, uint currentAmount);


    constructor(address _owner, uint _amountGoal, string memory _type, string memory _descr, uint256 numOfDays) {
        owner = _owner;
        amountGoal = _amountGoal;
        visionType = _type;
        visionDescr = _descr;
        deadline = block.timestamp + (numOfDays * 1 days);
        //TODO: revisit this assignment
        emit VisionCreated(_owner, _amountGoal, _type, _descr);
    }

    /// @notice Invest amount to a Vision
    function invest() external canInvest payable {
        require(msg.sender != owner);
        addInvestor();
        investors[msg.sender] = investors[msg.sender].add(msg.value);
        currentAmount = currentAmount.add(msg.value);
        emit AmountReceived(msg.sender, msg.value, currentAmount);
        if (currentAmount >= amountGoal) {
            state = State.ENDED;
            emit GoalAchieved(owner, currentAmount);
            makePayment(currentAmount);
            //TODO: Change it using votes
        }
    }

    /// @notice Add investor
    /// @dev Before adding checks if already investor exists
    function addInvestor() internal {
        if (investors[msg.sender] == 0) {//TODO:Possible modifier
            sumOfInvestors += 1;
            emit InvestorAdded(msg.sender);
        }
    }

    /// @notice Sends the amount to the owner of the Vision
    /// @param amount the amount to be sent
    function makePayment(uint amount) public payable hasEnded goalReached nonReentrant {
        currentAmount = 0;
        (bool success,) = owner.call{value : amount}("");
        if (success) {
            state = State.PAID;
            emit WithdrawnSuccess(owner, currentAmount);
        } else {
            emit WithdrawnFailure(owner, currentAmount);
        }
    }

    //TODO: Revisit this section and make it work//
    /// @notice Creates a withdraw request
    /// @param _withdrawAmount the amount to be withdrawn, _receiver the address of the receiver, _withdrawalReason the reason of the withdrawal
    function createWithdrawRequest(uint _withdrawAmount, address _receiver, string calldata _withdrawalReason) public onlyOwner {
        require(currentAmount >= _withdrawAmount);
        //TODO:Possible modifier
        WithdrawReq storage req = requests[msg.sender][idxReq];
        req.withdrawAmount = _withdrawAmount;
        req.receiver = _receiver;
        req.withdrawalReason = _withdrawalReason;
        req.votes = 0;
        req.isDone = false;

        idxReq++;

    }

    /// @notice Vote for a withdrawal request
    /// @param idx the index of the request
    function vote(uint idx) public goalReached isInvestor {
        WithdrawReq storage withdrawReq = requests[owner][idx];
        require(withdrawReq.votedInvestors[msg.sender] == false, "User already voted");
        //check if already has voted
        withdrawReq.votedInvestors[msg.sender] = true;
        withdrawReq.votes++;
    }

    /// @notice Send the amount requested to the receiver
    /// @param idx the index of the request
    function withdraw(uint idx) public onlyOwner payable nonReentrant {
        WithdrawReq storage req = requests[msg.sender][idx];
        require(req.isDone == false);
        require(req.votes >= sumOfInvestors / 2);
        (bool success,) = req.receiver.call{value : req.withdrawAmount}("");
        if (success) {
            req.isDone = true;
            emit WithdrawnSuccess(req.receiver, req.withdrawAmount);
        } else {
            emit WithdrawnFailure(req.receiver, req.withdrawAmount);
        }
    }
    //////////////
    function getVision() public view returns
    (
        address _owner,
        string memory _type,
        string memory _description,
        State _currentState,
        uint256 _goal,
        uint256 _currentAmount,
        uint256 _deadline
    ) {
        _owner = owner;
        _type = visionType;
        _currentState = state;
        _description = visionDescr;
        _goal = amountGoal;
        _currentAmount = currentAmount;
        _deadline = deadline;
    }

    //TODO:Revisit
    receive() external payable {
        revert();
    }

    fallback() external payable {
        revert();
    }
}
