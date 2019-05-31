const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const MockSpecialAuction = artifacts.require('mocks/MockSpecialAuction');
const MockGhostOwnership = artifacts.require('mocks/MockGhostOwnership');
const MockAuctionCreator = artifacts.require('mocks/MockAuctionCreator');

contract('MockSpecialAuction', accounts => {
  const [ceo, bidder, winner] = accounts;

  let SpecialAuction;
  let GhostOwnership;
  let AuctionCreator;

  let geneOfGhost;
  let ghostID;
  let auctionDuration;

  beforeEach(async () => {
    GhostOwnership = await MockGhostOwnership.new(ceo, {from: ceo});
    SpecialAuction = await MockSpecialAuction.new(GhostOwnership.address);
    AuctionCreator = await MockAuctionCreator.new(SpecialAuction.address, constants.ZERO_ADDRESS, {from: ceo});
    SpecialAuction = await MockSpecialAuction.new(AuctionCreator.address);

    await AuctionCreator.setSpecialAuctionAddress(SpecialAuction.address, {from: ceo});

    geneOfGhost = new BN(1);
    ghostID = new BN(0);
    auctionDuration = new BN(2);

    await AuctionCreator.createEgg(geneOfGhost, ceo);
  });

  describe('#createAuction()', () => {

    it('reverts when try to create already created auction', async () => {
      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);

      await shouldFail.reverting(AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration));
    });

    it('reverts when duration is too large', async () => {
      let bigDuration = new BN(constants.MAX_INT256);

      await shouldFail.reverting(AuctionCreator.createSpecialAuction(ghostID, ceo, bigDuration));
    });

    it('reverts when duration is too small', async () => {
      let smallDuration = new BN(1);

      await shouldFail.reverting(AuctionCreator.createSpecialAuction(ghostID, ceo, smallDuration));
    });

    it('reverts when not nonFungibleContract try to create auction', async () => {
      await shouldFail.reverting(SpecialAuction.createAuction(ghostID, ceo, auctionDuration, {from: ceo}));
    });

    it('successfully creates auction', async () => {
      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);

      expect(await SpecialAuction.isOnAuction(ghostID)).to.be.equal(true);
    });
  });

  describe('#bid()', () => {
    let bidAmount;

    beforeEach(async () => {
      bidAmount = new BN(1000);

      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);
    });

    it('reverts when bid amount is too large', async () => {
      let bigBidAmount = new BN(constants.MAX_INT256);

      await shouldFail.reverting(SpecialAuction.bid(ghostID, bigBidAmount, {from: bidder}));
    });

    it('reverts when bid amount is zero', async () => {
      let zeroBidAmount = new BN(constants.MAX_INT256);

      await shouldFail.reverting(SpecialAuction.bid(ghostID, zeroBidAmount, {from: bidder}));
    });

    it('reverts when owner tries to bid', async () => {
      await shouldFail.reverting(SpecialAuction.bid(ghostID, bidAmount, {from: ceo}));
    });

    it('successfully bids to auction', async () => {
      await SpecialAuction.bid(ghostID, bidAmount, {from: bidder});

      expect(await SpecialAuction.getAmount(ghostID, {from: bidder})).to.be.bignumber.equal(bidAmount);
    });
  });

  describe('#cancelAuction()', () => {
    let bidAmount;
    let newGhostID;

    beforeEach(async () => {
      bidAmount = new BN(1000);
      newGhostID = new BN(1);

      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);
    });

    it('reverts when try to cancel auction that is not created yet', async () => {
      await shouldFail.reverting(SpecialAuction.cancelAuction(newGhostID, {from: ceo}));
    });

    it('reverts when one who is not seller tries to cancel auction', async () => {
      await shouldFail.reverting(SpecialAuction.cancelAuction(ghostID, {from: bidder}));
    });

    it('successfully cancels auction', async () => {
      await SpecialAuction.cancelAuction(ghostID, {from: ceo});

      expect(await SpecialAuction.isOnAuction(ghostID)).to.be.equal(false);
    });
  });

  describe('#getAuction()', () => {
    let newGhostID;

    beforeEach(async () => {
      newGhostID = new BN(1);

      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);
    });

    it('reverts when try to get auction that is not created yet', async () => {
      await shouldFail.reverting(SpecialAuction.getAuction(newGhostID));
    });

    it('successfully get auction', async () => {
      let seller;
      let infoAuction;

      infoAuction = await SpecialAuction.getAuction(ghostID);
      seller = new BN(infoAuction[0]);
      expect(seller).to.be.bignumber.equal(ceo);
    });
  });

  describe('#getAmount()', () => {
    let newGhostID;
    let bidAmount;

    beforeEach(async () => {
      newGhostID = new BN(1);
      bidAmount = new BN(1000);

      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);
      await SpecialAuction.bid(ghostID, bidAmount, {from: bidder});
    });

    it('reverts when try to get bidder\'s amount of auction that is not created yet', async () => {
      await shouldFail.reverting(SpecialAuction.getAmount(newGhostID, {from: bidder}));
    });

    it('reverts when try to get amount of bidder who is not bid', async () => {
      await shouldFail.reverting(SpecialAuction.getAmount(ghostID, {from: winner}));
    });

    it('successfully gets bidder\'s amount', async () => {
      expect(new BN(await SpecialAuction.getAmount(ghostID, {from: bidder}))).to.be.bignumber.equal(bidAmount);
    });
  });

  describe('#getNumBidders()', () => {
    let newGhostID;
    let bidAmount;
    let newBidAmount;

    beforeEach(async () => {
      newGhostID = new BN(1);
      bidAmount = new BN(1000);
      newBidAmount = new BN(10000);

      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);
      await SpecialAuction.bid(ghostID, bidAmount, {from: bidder});
      await SpecialAuction.bid(ghostID, newBidAmount, {from: winner});
    });

    it('reverts when try to get the number of bidders of auction that is not created yet', async () => {
      await shouldFail.reverting(SpecialAuction.getNumBidders(newGhostID));
    });

    it('successfully gets the number of bidders of auction', async () => {
      expect(await SpecialAuction.getNumBidders(ghostID)).to.be.bignumber.equal(new BN(2));
    });
  });

  describe('#endAuction()', () => {
    let newGhostID;
    let bidAmount;

    beforeEach(async () => {
      newGhostID = new BN(1);
      bidAmount = new BN(1000);

      await AuctionCreator.createSpecialAuction(ghostID, ceo, auctionDuration);
      await SpecialAuction.bid(ghostID, bidAmount, {from: bidder});

      let then, now;
      then = new Date().getTime();
      now = then;
      while((now - then) < 5000){
        now = new Date().getTime();
      }
    });

    it('reverts when try to end auction that is not created yet', async () => {
      await shouldFail.reverting(SpecialAuction.endAuction(newGhostID));
    });

    it('successfully ends auction', async () => {
      await SpecialAuction.endAuction(ghostID);

      expect(await SpecialAuction.isOnAuction(ghostID)).to.be.equal(false);
    });
  });
});
