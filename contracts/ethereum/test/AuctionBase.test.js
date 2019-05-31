const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const MockAuctionBase = artifacts.require('mocks/MockAuctionBase');
const MockGhostOwnership = artifacts.require('mocks/MockGhostOwnership');

contract('MockAuctionBase', accounts => {
  const [ceo, owner, bidder, winner] = accounts;

  let AuctionBase;
  let GhostOwnership;

  let geneOfGhost;
  let ghostID;

  beforeEach(async () => {
    GhostOwnership = await MockGhostOwnership.new(ceo, {from: ceo});
    AuctionBase = await MockAuctionBase.new(GhostOwnership.address, {from: ceo});

    geneOfGhost = new BN(1);
    ghostID = new BN(0);

    await GhostOwnership.createEgg(geneOfGhost, owner);
  });

  describe('#owns()', () => {
    it('return false when given address does not have ghost ID', async () => {
      expect(await AuctionBase.owns(bidder, ghostID)).to.be.equal(false);
    });

    it('return true when given address has ghost ID', async () => {
      expect(await AuctionBase.owns(owner, ghostID)).to.be.equal(true);
    });
  });

  describe('#escrow()', () => {
    beforeEach(async () => {
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
    });

    it('successfully when escrows given ghost ID', async () => {
      expect(await AuctionBase.owns(AuctionBase.address, ghostID)).to.be.equal(true);
    });
  });

  describe('#transfer()', () => {
    beforeEach(async () => {
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
      await AuctionBase.transfer(owner, ghostID);
    });

    it('successfully transfers given ghost ID to receiver', async () => {
      expect(await AuctionBase.owns(owner, ghostID)).to.be.equal(true);
    });
  });

  describe('#addAuction()', () => {
    let receipt;
    let auctionDuration;

    beforeEach(async () => {
      receipt = await AuctionBase.addAuction(ghostID, {from: owner});
      auctionDuration = new BN(2);
    });

    it('emits AuctionCreated event when auction created', async () => {
      await expectEvent.inLogs(receipt.logs, 'AuctionCreated', { tokenId: ghostID, duration: auctionDuration});
    });

    it('successfully creates and adds auction', async () => {
      expect(await AuctionBase.isOnAuction(ghostID)).to.be.equal(true);
    });
  });

  describe('#removeAuction()', () => {
    beforeEach(async () => {
      await AuctionBase.addAuction(ghostID, {from: owner});
      await AuctionBase.removeAuction(ghostID);
    });

    it('successfully removes auction', async () => {
      expect(await AuctionBase.isOnAuction(ghostID)).to.be.equal(false);
    });
  });

  describe('#cancelAuction()', () => {
    let receipt;

    beforeEach(async () => {
      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
      receipt = await AuctionBase.cancelAuction(ghostID);
    });

    it('emits AuctionCancelled event when successfully cancels auction', async () => {
      await expectEvent.inLogs(receipt.logs, 'AuctionCancelled', {tokenId: ghostID});
    });

    it('successfully cancels auction', async () => {
      expect(await AuctionBase.isOnAuction(ghostID)).to.be.equal(false);
    });

    it('successfully returns ghost to owner', async () => {
      expect(await AuctionBase.owns(owner, ghostID)).to.be.equal(true);
    });
  });

  describe('#isOnAuction()', () => {
    let newGhostID;

    beforeEach(async () => {
      newGhostID = new BN(1);
      await AuctionBase.addAuction(ghostID, {from: owner});
    });

    it('inquires auction that has not been created', async () => {
      expect(await AuctionBase.isOnAuction(newGhostID)).to.be.equal(false);
    });

    it('successfully inquires created auction', async () => {
      expect(await AuctionBase.isOnAuction(ghostID)).to.be.equal(true);
    });
  });

  describe('#addBidder()', () => {
    let bidAmount;
    let receipt;

    beforeEach(async () => {
      bidAmount = new BN(10000);


      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
      receipt = await AuctionBase.addBidder(ghostID, bidder, bidAmount);
    });

    it('reverts when adds already added bidder', async () => {
      await shouldFail.reverting(AuctionBase.addBidder(ghostID, bidder, bidAmount));
    });

    it('reverts when bidder bids smaller than maximum bid amount', async () => {
      await shouldFail.reverting(AuctionBase.addBidder(ghostID, winner, bidAmount));
    });

    it('emits BidderCreated event when adds bidder', async () => {
      await expectEvent.inLogs(receipt.logs, 'BidderCreated', {tokenId: ghostID, bidder: bidder});
    });

    it('successfully adds bidder', async () => {
      expect(await AuctionBase.isAddedBidder(ghostID, bidder)).to.be.equal(true);
    });
  });

  describe('#updateBidAmount()', () => {
    let bidAmount;
    let currentMaxAmount;
    let newBidAmount

    let receipt;

    beforeEach(async () => {
      bidAmount = new BN(10000);
      currentMaxAmount = new BN(100000);
      newBidAmount = new BN(1000000);

      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
      await AuctionBase.addBidder(ghostID, bidder, bidAmount);
      await AuctionBase.addBidder(ghostID, winner, currentMaxAmount);
    });

    it('reverts when updates bidder not added', async () => {
      await shouldFail.reverting(AuctionBase.updateBidAmount(ghostID, owner, newBidAmount));
    });

    it('reverts when bidder bids smaller than maximum bid amount', async () => {
      await shouldFail.reverting(AuctionBase.updateBidAmount(ghostID, bidder, currentMaxAmount));
    });

    it('reverts when current winner bids again', async () => {
      await shouldFail.reverting(AuctionBase.updateBidAmount(ghostID, winner, newBidAmount));
    });

    it('emits BidAmountUpdated event when successfully update bidder\'s amount', async () => {
      receipt = await AuctionBase.updateBidAmount(ghostID, bidder, newBidAmount);

      await expectEvent.inLogs(receipt.logs, 'BidAmountUpdated', {tokenId: ghostID, bidder: bidder, newAmount: newBidAmount});
    });

    it('successfully updates bidder\'s amount', async () => {
      await AuctionBase.updateBidAmount(ghostID, bidder, newBidAmount);

      expect(await AuctionBase.getBidderAmount(ghostID, bidder)).to.be.bignumber.equal(newBidAmount);
    });
  });

  describe('#bid()', () => {
    let zeroAmount;
    let newGhostID;
    let bidAmount;
    let newBidAmount;

    beforeEach(async () => {
      zeroAmount = new BN(0);
      newGhostID = new BN(1);
      bidAmount = new BN(1000);
      newBidAmount = new BN(10000);

      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
    });

    it('reverts when bid at auction that has not been created', async () => {
      await shouldFail.reverting(AuctionBase.bid(newGhostID, bidder, bidAmount));
    });

    it('reverts when bid zero amount', async () => {
      await shouldFail.reverting(AuctionBase.bid(ghostID, bidder, zeroAmount));
    });

    it('successfully adds bidder that did not bid', async () => {
      await AuctionBase.bid(ghostID, bidder, bidAmount);

      expect(await AuctionBase.isAddedBidder(ghostID, bidder)).to.be.equal(true);
    });

    it('successfully updates bid amount of bidder that was bid', async () => {
      await AuctionBase.bid(ghostID, bidder, bidAmount);
      await AuctionBase.bid(ghostID, winner, new BN(bidAmount * 2));
      await AuctionBase.bid(ghostID, bidder, newBidAmount);

      expect(await AuctionBase.getBidderAmount(ghostID, bidder)).to.be.bignumber.equal(newBidAmount);
    });

    it('reverts when finished auction', async () => {
      let then, now;
      then = new Date().getTime();
      now = then;
      while((now - then) < 5000){
        now = new Date().getTime();
      }

      await shouldFail.reverting(AuctionBase.bid(ghostID, winner, new BN(newBidAmount * 2)));
    });
  });

  describe('#isFinished()', () => {
    beforeEach(async () => {
      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
    });

    it('returns false when auction is finished', async () => {
      expect(await AuctionBase.isFinished(ghostID)).to.be.equal(false);
    });

    it('returns true when auction is not finished yet', async () => {
      let then, now;
      then = new Date().getTime();
      now = then;
      while((now - then) < 5000){
        now = new Date().getTime();
      }

      expect(await AuctionBase.isFinished(ghostID)).to.be.equal(true);
    });
  });

  describe('#endAuction()', () => {
    let receipt;
    let bidAmount;

    beforeEach(async () => {
      bidAmount = new BN(1000);

      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
    });

    it('reverts when auction is not finished yet', async () => {
      await shouldFail.reverting(AuctionBase.endAuction(ghostID));
    });

    it('emits AuctionCancelled event when no one bid', async () => {
      let then, now;
      then = new Date().getTime();
      now = then;
      while((now - then) < 5000){
        now = new Date().getTime();
      }

      receipt = await AuctionBase.endAuction(ghostID);

      await expectEvent.inLogs(receipt.logs, 'AuctionCancelled', {tokenId: ghostID});
    });

    it('emits AuctionSuccessful event when successfully finished auction', async () => {
      await AuctionBase.cancelAuction(ghostID);

      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
      await AuctionBase.bid(ghostID, bidder, bidAmount);

      let then, now;
      then = new Date().getTime();
      now = then;
      while((now - then) < 5000){
        now = new Date().getTime();
      }

      receipt = await AuctionBase.endAuction(ghostID);

      await expectEvent.inLogs(receipt.logs, 'AuctionSuccessful', {tokenId: ghostID, maxPrice: bidAmount, winner: bidder});
    });

    it('successfully finished auction', async () => {
      await AuctionBase.cancelAuction(ghostID);

      await AuctionBase.addAuction(ghostID, {from: owner});
      await GhostOwnership.approve(AuctionBase.address, ghostID, {from: owner});
      await AuctionBase.escrow(owner, ghostID);
      await AuctionBase.bid(ghostID, bidder, bidAmount);

      let then, now;
      then = new Date().getTime();
      now = then;
      while((now - then) < 5000){
        now = new Date().getTime();
      }

      await AuctionBase.endAuction(ghostID);

      expect(await AuctionBase.isOnAuction(ghostID)).to.be.equal(false);
    });
  });
});
