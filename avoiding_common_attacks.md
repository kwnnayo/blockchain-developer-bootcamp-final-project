## Avoiding common attacks

<p>Below follows a list with attack vectors and security measures taken into account.</p>

### <a href='https://swcregistry.io/docs/SWC-101'>Integer Overflow and Underflow</a>

<p>Overflow and underflow attacks are minimized by the use of the OpenZeppelin's SafeMath library.<a href='https://swcregistry.io/docs/SWC-101'> [SWC-101]</a></p>

### <a href='https://swcregistry.io/docs/SWC-107'>Reentrancy</a>

<p> Best practices to avoid Reentrancy weaknesses are used. <a href='https://swcregistry.io/docs/SWC-107'>[SWC-107]</a></p>
<ul>
<li>All internal state changes are performed before the call is executed,  using the Checks-Effects-Interactions 
pattern. </li>
<li>Using OpenZeppelin's ReentrancyGuard</li>
</ul>

### <a href='https://swcregistry.io/docs/SWC-115'>msg.sender over tx.origin</a>

<p>Each function uses msg.sender instead of the tx.origin one. <a href='https://swcregistry.io/docs/SWC-115'>[SWC-115]</a> </p>

### <a href='https://swcregistry.io/docs/SWC-107'>Checks-Effects-Interactions</a>

<p> As seen in the design pattern decisions section, every function uses the Checks-Effects-Interactions pattern.<a href='https://swcregistry.io/docs/SWC-107'>[SWC-107]</a></p>

### <a href='https://swcregistry.io/docs/SWC-103'>Using Specific Compiler Pragma</a>

<p>A specific version of compiler is being used. (version: "0.8.0")<a href='https://swcregistry.io/docs/SWC-103'> [SWC-103]</a></p>

### <a href='https://swcregistry.io/docs/SWC-110'>Use Modifiers Only for Validation</a>

<p>Several modifiers have been mindfully used in order to determine either the role of the caller, or the state of the Vision. 
<a href='https://swcregistry.io/docs/SWC-110'>[SWC-110]</a></p>

### <a href='https://swcregistry.io/docs/SWC-104'>Unchecked Call return value</a>

<p>The return values of low-level call methods are all checked for success. <a href='https://swcregistry.io/docs/SWC-104'>[SWC-104]</a></p>

<hr/>

#### References:

<ul>
<li><b>Blockchain Developer Bootcamp 2021 courses 💙</b></li>
<li><a>https://swcregistry.io/</a></li>
<li><a>https://fravoll.github.io/solidity-patterns/</a></li>
</ul>
