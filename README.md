# Real Estate NFT DApp - Step-by-Step

This repository is forked from [dappuniversity/millow](https://github.com/dappuniversity/millow). Full credit for the original work goes to [Gregory McCubbin](https://www.linkedin.com/in/gregory-mccubbin-48735b37/), the creator of [Dapp University](https://www.youtube.com/@DappUniversity) and [Dapp University's Instagram](https://www.instagram.com/dappuniversity/).

I created the `step_by_step_progress` branch to serve as a _follow-along_ branch for tracking my progress through the tutorial available on [this YouTube video](https://youtu.be/C4blK6X-D_4).

Each commit in this branch corresponds to a specific point in the tutorial, and the commit messages include timestamps to match the YouTube video; [see the commits for the details](https://github.com/couimet/millow/commits/step_by_step_progress/).

> **Note:** The rest of this `README` is identical to the original file, except for the addition of a small note below about using `nvm` before running `npm install`.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:

> 💡 pro-tip: in order to run the same version of `Node.js` as used in https://youtu.be/C4blK6X-D_4, please run "`nvm use || nvm install`" before running "`npm install`".

`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 7. Start frontend
`$ npm run start`

## Running a Full Demo

This demo uses a Hardhat deployment script that initializes 4 predefined accounts:

- **`buyer`**: Account with index 0 in Hardhat  
- **`seller`**: Account with index 1 in Hardhat  
- **`inspector`**: Account with index 2 in Hardhat  
- **`lender`**: Account with index 3 in Hardhat  

### Prerequisites

1. Map the above accounts to your **Metamask wallet**:
   - Import the private keys for these accounts into Metamask if you haven't already.

---

### Steps to Complete a Property Purchase

1. **Open the Demo App**: Navigate to [http://localhost:3000](http://localhost:3000) in your browser.  
1. **Connect Metamask**: Connect your wallet to the app.  
   - The currently active account in Metamask doesn't matter during this step.  
1. **Select a Property**: Click on a property to view its details.  
1. **Perform Actions with the Specified Accounts**:
   - **Inspector**:  
     - Switch to the `inspector` account in Metamask.  
     - Click `Approve Inspection` and confirm the transaction in Metamask.  
   - **Lender**:  
     - Switch to the `lender` account in Metamask.  
     - Click `Approve and Lend` and confirm the transaction in Metamask.  
   - **Buyer**:  
     - Switch to the `buyer` account in Metamask.  
     - Click `Buy` and confirm the transaction in Metamask.  
   - **Seller**:  
     - Switch to the `seller` account in Metamask.  
     - Click `Approve & Sell` and confirm the transaction in Metamask.  

---

### Expected Result

After completing the last step, the property details should display:  
**"Owned by 0xf39F...2266"**  

This indicates that the property is now owned by the `buyer` account (`0xf39F...2266`), which corresponds to index 0 in Hardhat.  

**Note**: Hardhat initializes account addresses in a predictable way when starting up, ensuring consistent behavior during each run. 
 