# blockchain-developer-bootcamp-final-project

ConsenSys Academy Final Project

## EtherPreneur

### Ether donate or not

<p>An Ethereum based platform where a user (let's call him a Visioner) can post his idea/vision/project for something and define the amount of capital he needs to achieve it.
Other users can invest.</p>

<ul>
  <li>A Visioner can upload his vision and check its status and the capital amount collected.</li>
  <li>Users can invest to one or more ideas and browse through a list to available ones.</li>
  <li>Once the requested capital is achieved, no more investments are being accepted.</li>
  <li>If the requested amount is not completed, the funds are returned.
</ul>

### Available Actions

#### Every user
<ul>
    <li>Create a Vision</li>
    <li>Invest to a Vision, as long as he's not the creator of it.</li>
    <li>View all available Visions.</li>
</ul>

#### Vision Owner

<ul>
  <li>After the amount goal is reached:</li>
    <ul>
        <li>Create a withdraw request.</li>
        <li>Withdraw the requested amount if the appropriate amount of votes is collected.</li>
    </ul>
</ul>

#### Vision Investors
<ul>
    <li>Vote for a Withdrawal Request, if and only if they have invested to its Vision.</li>
    <li>Withdraw their invest amount if the Vision is expired and the amount goal was not met.</li>
</ul>
<hr/>

###### Created for the purposes of blockchain developer bootcamp.
