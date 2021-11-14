## Avoiding common attacks

<p>Below follows a list with attack vectors and security measures taken into account.</p>

### Integer Overflow and Underflow

<p>Overflow and underflow attacks are minimized by the use of the OpenZeppelin's SafeMath library. [SWC-101]</p>

### Reentrancy

<p> Best practices to avoid Reentrancy weaknesses are used. [SWC-107]</p>
<ul>
<li>All internal state changes are performed before the call is executed,  using the Checks-Effects-Interactions 
pattern. </li>
<li>Using OpenZeppelin's ReentrancyGuard</li>
</ul>

### msg.sender over tx.origin
<p>Each function uses msg.sender instead of the tx.origin one. [SWC-115] </p>

### Checks-Effects-Interactions
<p> As seen in the design pattern decisions section, every function uses the Checks-Effects-Interactions pattern.</p>

### Using Specific Compiler Pragma 
<p>A specific version of compiler is being used. (version: "0.8.0") [SWC-103]</p>

### Use Modifiers Only for Validation
<p>Several modifiers have been mindfully used in order to determine either the role of the caller, or the state of the Vision. 
[SWC-110]</p>

<hr/>

####References:
<ul>
<li><b>Blockchain Developer Bootcamp 2021 courses 💙</b></li>
<li><a>https://swcregistry.io/</a></li>
<li><a>https://fravoll.github.io/solidity-patterns/</a></li>
</ul>