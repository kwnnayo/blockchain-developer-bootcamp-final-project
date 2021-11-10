// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

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

    WithdrawReq[] public requests;
    uint public idxReq = 0;


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
        }
    }

    /// @notice Add investor
    /// @dev Before adding checks if already investor exists
    function addInvestor() private {
        if (investors[msg.sender] == 0) {//TODO:Possible modifier
            sumOfInvestors += 1;
            emit InvestorAdded(msg.sender);
        }
    }

    /// @notice Creates a withdraw request
    /// @param _withdrawAmount the amount to be withdrawn, _receiver the address of the receiver, _withdrawalReason the reason of the withdrawal
    function createWithdrawRequest(uint _withdrawAmount, string calldata _withdrawalReason) public onlyOwner hasEnded {
        require(currentAmount >= _withdrawAmount, 'Requested amount is greater than the available one.');
        //TODO:Possible modifier
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
    function vote(uint idx) public goalReached isInvestor {
        WithdrawReq storage withdrawReq = requests[idx];
        require(withdrawReq.votedInvestors[msg.sender] == false, "User already voted");
        withdrawReq.votedInvestors[msg.sender] = true;
        withdrawReq.votes++;
    }

    /// @notice Send the amount requested to the receiver
    /// @param idx the index of the request
    function withdraw(uint idx) public onlyOwner payable nonReentrant hasEnded {
        WithdrawReq storage req = requests[idx];
        require(req.isDone == false, "Withdrawal already done!");
        require(req.votes >= sumOfInvestors / 2, "Not enough votes!"); //TODO:What happens if 1 investor
        currentAmount = currentAmount.sub(req.withdrawAmount);
        require(currentAmount>=0,"Not enough amount!!!");
        (bool success,) = req.receiver.call{value : req.withdrawAmount}("");
        if (success) {
            req.isDone = true;
            if(currentAmount==0) state = State.PAID;
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
        uint256 _deadline,
        uint _idxReq
    ) {
        _owner = owner;
        _type = visionType;
        _currentState = state;
        _description = visionDescr;
        _goal = amountGoal;
        _currentAmount = currentAmount;
        _deadline = deadline;
        _idxReq = idxReq;
    }

    //TODO:Revisit
    receive() external payable {
        revert();
    }

    fallback() external payable {
        revert();
    }
}
