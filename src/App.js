import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'
import Ballot from './artifacts/contracts/Ballot.sol/Ballot.json'

const greeterAddress = "0xB755842e3c38E4390Ac686377652ec1d3A500109"
const tokenAddress = "0x9C51EE08F58bEeadb366a43fd6eDe4525dd1C271"
const ballotAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState()
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()
  const [voterAccount, setVoterAccount] = useState()
  const [delegateTargetAccount, setDelegateTargetAccount] = useState()
  const [proposalIndex, setProposalIndex] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function setVoteRight() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transation = await contract.giveRightToVote(voterAccount);
      await transation.wait();
      console.log(`Vote right successfully set to ${voterAccount}`);
    }
  }

  async function delegate() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transation = await contract.delegate(delegateTargetAccount);
      await transation.wait();
      console.log(`Delegated successfully to ${delegateTargetAccount}`);
    }
  }

  async function vote() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transation = await contract.vote(parseInt(proposalIndex));
      await transation.wait();
      console.log(`Voted successfully to proposal of ${proposalIndex}`);
    }
  }

  async function winningProposal() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const winningProposalIndex = await contract.winningProposal();

      alert(`Winning Proposal is: ${winningProposalIndex}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />

        <br />
        <input onChange={e => setVoterAccount(e.target.value)} placeholder="Voter ID" />
        <button onClick={setVoteRight}>Give Right to Vote</button>

        <br />
        <input onChange={e => setDelegateTargetAccount(e.target.value)} placeholder="Delegate Target ID" />
        <button onClick={delegate}>Delegate</button>

        <br />
        <input onChange={e => setProposalIndex(e.target.value)} placeholder="Proposal Index to vote" />
        <button onClick={vote}>Vote</button>

        <br />
        <button onClick={winningProposal}>Winning Proposal</button>
      </header>
    </div>
  );
}

export default App;
