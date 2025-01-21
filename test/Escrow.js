const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;

  beforeEach(async () => {
    // Setup accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners()

    // Deploy Real Estate
    const RealEstate = await ethers.getContractFactory('RealEstate')
    realEstate = await RealEstate.deploy()

    // Mint 
    let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
    await transaction.wait()

    // Deploy Escrow
    const Escrow = await ethers.getContractFactory('Escrow')
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    )
    
    // Approve Property
    transaction = await realEstate.connect(seller).approve(escrow.address, 1)
    await transaction.wait()
  
    // List property
    transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5));
    await transaction.wait()
  })

describe('Deployment', () => {
    it('Returns NFT address', async () => {
      const result = await escrow.nftAddress()
      expect(result).to.be.equal(realEstate.address)
    })

    it('Returns seller', async () => {
      const result = await escrow.seller()
      expect(result).to.be.equal(seller.address)
    })

    it('Returns inspector', async () => {
      const result = await escrow.inspector()
      expect(result).to.be.equal(inspector.address)
    })

    it('Returns lender', async () => {
      const result = await escrow.lender()
      expect(result).to.be.equal(lender.address)
    })
  })

  describe('Listing', () => {
    it('Updates as listed', async () => {
      const result = await escrow.isListed(1);
      expect(result).to.be.equal(true)
    })

    it('Updates ownership', async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
    })

    it('Returns buyer', async () => {
      const result = await escrow.buyer(1);
      expect(result).to.be.equal(buyer.address)
    })

    it('Returns puchase price', async () => {
      const result = await escrow.purchasePrice(1);
      expect(result).to.be.equal(tokens(10))
    })

    it('Returns escrow amount', async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.be.equal(tokens(5))
    })

    it('should throw an error is listing is attempted by non-seller', async () => {
      await expect(escrow.connect(buyer).list(1, buyer.address, tokens(10), tokens(5))).to.be.revertedWith('Only seller can call this method');
    })
  })

  describe('Deposits', () => {
    it('Updates contract balance', async () => {
      const transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) });
      await transaction.wait();
      const result = await escrow.getBalance()
      expect(result).to.be.equal(tokens(5))
    })
  })

  describe('Inspection ', () => {
    it('Updates inspection status', async () => {
      // Pre-condition checks
      expect(await escrow.inspectionPassed(1)).to.be.equal(false)
      // None-existing property
      expect(await escrow.inspectionPassed(2)).to.be.equal(false)

      const transaction = await escrow.connect(inspector).updateInspectionStatus(1, true);
      await transaction.wait();
      const result = await escrow.inspectionPassed(1);
      expect(result).to.be.equal(true);
    })

    it('should throw an error if updating inspection status is attempted by non-inspector', async () => {
      await expect(escrow.connect(seller).updateInspectionStatus(1, true)).to.be.revertedWith('Only inspector can call this method');
    })
  })

  describe('Approval ', () => {
    it('Updates approval status', async () => {
      // Block for the buyer to approve
      let transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();
      // We're explicitly testing the 3 addresses after every step to ensure the approval status is updated correctly
      expect(await escrow.approval(1, buyer.address)).to.be.equal(true);
      expect(await escrow.approval(1, seller.address)).to.be.equal(false);
      expect(await escrow.approval(1, lender.address)).to.be.equal(false);
      
      // Block for the seller to approve
      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();
      expect(await escrow.approval(1, buyer.address)).to.be.equal(true); // Should remain unchanged from previous step
      expect(await escrow.approval(1, seller.address)).to.be.equal(true);
      expect(await escrow.approval(1, lender.address)).to.be.equal(false);
      
      // Block for the lender to approve
      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();
      expect(await escrow.approval(1, buyer.address)).to.be.equal(true); // Should remain unchanged from previous step
      expect(await escrow.approval(1, seller.address)).to.be.equal(true); // Should remain unchanged from previous step
      expect(await escrow.approval(1, lender.address)).to.be.equal(true);
    })
  })

  describe('Sale ', async () => {
    beforeEach(async () => {
      let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) });
      await transaction.wait();

      transaction = await escrow.connect(inspector).updateInspectionStatus(1, true);
      await transaction.wait();

      transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      await lender.sendTransaction({ to: escrow.address, value: tokens(5) });    
      
      transaction = await escrow.connect(lender).finalizeSale(1);
      await transaction.wait();
    })

    it('Updates ownership', async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address);
    })

    it('Updates balance', async () => {
      expect(await escrow.getBalance()).to.be.equal(0);
    })
  })
})
