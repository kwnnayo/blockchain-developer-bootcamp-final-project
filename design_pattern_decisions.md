## Design pattern decisions

<p>Below are the design patterns used in this project.</p>

### Factory Design Pattern

<p>The factory pattern, in simple words, is having a contract, which is the factory one, that creates other contracts.
The <b>Etherpreneur contract</b> is such a case. Etherpreneur contract is used for the creation of <b>multiple 
Vision contracts</b> 
as well as for retrieving all the created ones.
</p>


### Checks-Effects-Interaction Pattern

<p>Consists the general guideline when coding any smart contract as it describes how to build up a function.
Every function first validates all the arguments and throws and emits appropriate errors and events when the input
is not the expected one.</p>
<p>For example:</p>

    function withdrawInvestedAmount() public hasInvestorRole hasExpired payable nonReentrant returns (bool){
        uint amount = investors[msg.sender];
        //1.CHECKS
        require(amount != 0);

        //2.EFFECTS
        investors[msg.sender] = 0;

        //3.INTERACTS
        (bool success,) = msg.sender.call{value : amount}("");
        if (success) {
            currentAmount = currentAmount.sub(amount);
        } else {
            investors[msg.sender] = amount;
        }
        return success;
    }

### Access Control Design Pattern

<p>Each function in the contract has restricted access depending on who calls it. Similar restrictions are applied to
multiple functions. To make this possible, OpenZeppelin's AccessControl along with the corresponding modifiers were used.
</p>
<p>For example:</p>

    modifier hasInvestorRole(){

        //hasRole function used inherited from AccesControl.sol
        require(hasRole(INVESTOR_ROLE, msg.sender), "Does not have investor role");
        _;
    }

    //This function can only be called from accounts that have the INVESTOR role!
    function vote(uint idx) public hasEnded hasInvestorRole {
        WithdrawReq storage withdrawReq = requests[idx];
        require(withdrawReq.isDone == false, "Withdrawal already done!");
        require(withdrawReq.votedInvestors[msg.sender] == false, "User already voted");
        withdrawReq.votedInvestors[msg.sender] = true;
        withdrawReq.votes++;
    }            

### Inheritance and Interfaces

<p> The contract inherits functionality of the following contracts:</p>
<ul>
<li>SafeMath.sol</li>
<li>AccessControl.sol</li>
<li>ReentrancyGuard.sol</li>
</ul>
<p>For example:</p>

    // hasInvestorRole modifier uses hasRole function inherited from AccessControl.sol
    // nonReentrant is inherited from ReentrancyGuard.sol
    function withdrawInvestedAmount() public hasInvestorRole hasExpired payable nonReentrant returns (bool){
        {...}
        if (success) {

            //Using sub from SafeMath.sol
            currentAmount = currentAmount.sub(amount);

        } else {
            investors[msg.sender] = amount;
        }
        return success;
    }

### Pull Over Push Pattern

<p>The Pull over Push pattern shifts the risk associated with the ether transfer to the user, by letting him 
withdraw (pull) a certain amount, which would otherwise have to be sent to him (push).
In the contract implemented, the above rule applies to the following code:</p>

A mapping which keeps track of the amount invested per investor is used. So, instead of having the contract responsible
to perform an ether transfer, the below function is called.

    function allowForPull(address receiver, uint amount) private {
        investors[receiver] = investors[receiver].add(amount);
    }

This transfers the responsibility to the user. So in the case where a Vision has expired, the user is responsible to
withdraw his invested funds calling the withdrawInvestedAmount() function, which in turn uses the
Checks-Effects-Interaction Pattern as seen above.

    function withdrawInvestedAmount() public hasInvestorRole hasExpired payable nonReentrant returns (bool){
        uint amount = investors[msg.sender];
        //1.CHECKS
        require(amount != 0);

        //2.EFFECTS
        investors[msg.sender] = 0;

        //3.INTERACTS
        (bool success,) = msg.sender.call{value : amount}("");
        if (success) {
            currentAmount = currentAmount.sub(amount);
        } else {
            investors[msg.sender] = amount;
        }
        return success;
    }

<hr/>

#### References:

<ul>
<li><b>Blockchain Developer Bootcamp 2021 courses 💙</b></li>
<li><a>https://fravoll.github.io/solidity-patterns/</a></li>
<li><a>https://www.sitepoint.com/smart-contract-safety-best-practices-design-patterns/</a></li>
</ul>