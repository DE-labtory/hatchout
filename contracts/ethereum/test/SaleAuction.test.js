const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const MockSaleAuction = artifacts.require('mocks/MockSaleAuction');
const MockGhostOwnership = artifacts.require('mocks/MockGhostOwnership');
const MockAuctionCreator = artifacts.require('mocks/MockAuctionCreator');

contract('MockSaleAuction', accounts => {
  const [ceo, owner, buyer, other] = accounts;

  let SaleAuction;
  let GhostOwnership;
  let AuctionCreator;

  let GhostOfGene;
  let ghostID;
  let bidAmount;

  beforeEach(async () => {
    GhostOwnership = await MockGhostOwnership.new(ceo, {from: ceo});
    SaleAuction = await MockSaleAuction.new(GhostOwnership.address);
    AuctionCreator = await MockAuctionCreator.new(constants.ZERO_ADDRESS, SaleAuction.address, {from: ceo});
    SaleAuction = await MockSaleAuction.new(AuctionCreator.address);

    await AuctionCreator.setSaleAuctionAddress(SaleAuction.address, {from: ceo});

    GhostOfGene = new BN(1);
    ghostID = new BN(0);
    bidAmount = new BN(1000);

    await AuctionCreator.createEgg(GhostOfGene, owner);
  });

  describe('#createAuction()', () => {
    it('reverts when try to create already created auction', async () => {
      await AuctionCreator.createSaleAuction(ghostID, owner, buyer, bidAmount);

      await shouldFail.reverting(AuctionCreator.createSaleAuction(ghostID, owner, buyer, bidAmount));
    });

    it('reverts when not nonFungibleContract try to create auction', async () => {
      await shouldFail.reverting(SaleAuction.createAuction(ghostID, owner, buyer, bidAmount, {from: owner}));
    });

    it('successfully creates auction', async () => {
      await AuctionCreator.createSaleAuction(ghostID, owner, buyer, bidAmount);

      expect(await SaleAuction.isOnAuction(ghostID)).to.be.equal(true);
    });
  });

  describe('#bid()', () => {
    beforeEach(async () => {
      await AuctionCreator.createSaleAuction(ghostID, owner, buyer, bidAmount);
    });

    it('reverts when one who is not buyer tries to bid', async () => {
      await shouldFail.reverting(SaleAuction.bid(ghostID, {from: owner}));
    });

    it('successfully buyer bids', async () => {
      await SaleAuction.bid(ghostID, {from: buyer});

      expect(await SaleAuction.owns(buyer, ghostID)).to.be.equal(true);
    });
  });

  describe('#cancelAuction()', () => {
    let newGhostID;

    beforeEach(async () => {
      newGhostID = new BN(1);

      await AuctionCreator.createSaleAuction(ghostID, owner, buyer, bidAmount);
    });

    it('reverts when try to cancel auction that is not created yet', async () => {
      await shouldFail.reverting(SaleAuction.cancelAuction(newGhostID, {from: owner}));
    });

    it('reverts when one who is not seller tries to cancel auction', async () => {
      await shouldFail.reverting(SaleAuction.cancelAuction(ghostID, {from: other}));
    });

    it('successfully cancels auction', async () => {
      await SaleAuction.cancelAuction(ghostID, {from: owner});

      expect(await SaleAuction.isOnAuction(ghostID)).to.be.equal(false);
    });

  });

  describe('#getAuction()', () => {
    let newGhostID;

    beforeEach(async () => {
      newGhostID = new BN(1);

      await AuctionCreator.createSaleAuction(ghostID, owner, buyer, bidAmount);
    });

    it('reverts when try to get auction that is not created yet', async () => {
      await shouldFail.reverting(SaleAuction.getAuction(newGhostID));
    });

    it('successfully get auction', async () => {
      let seller;
      let infoAuction;

      infoAuction = await SaleAuction.getAuction(ghostID);
      seller = new BN(infoAuction[0]);
      expect(seller).to.be.bignumber.equal(owner);
    });
  });
});
