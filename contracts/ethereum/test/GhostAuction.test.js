const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const MockGhostAuction = artifacts.require('mocks/MockGhostAuction');
const MockGhostOwnership = artifacts.require('mocks/MockGhostOwnership');
const MockSpecialAuction = artifacts.require('mocks/MockSpecialAuction');
const MockSaleAuction = artifacts.require('mocks/MockSaleAuction');

contract('MockGhostAuction', accounts => {
  const [ceo, owner, buyer] = accounts;

  let GhostAuction;
  let GhostOwnership;
  let SpecialAuction;
  let SaleAuction;

  let newGhostOwnership;
  let newSpecialAuction;
  let newSaleAuction;

  let geneOfGhost;
  let ghostID;

  beforeEach(async () => {
    GhostOwnership = await MockGhostOwnership.new(ceo, {from: ceo});
    SpecialAuction = await MockSpecialAuction.new(GhostOwnership.address, {from: ceo});
    SaleAuction = await MockSaleAuction.new(GhostOwnership.address);
    GhostAuction = await MockGhostAuction.new(SpecialAuction.address, SaleAuction.address, {from: ceo});
    SpecialAuction = await MockSpecialAuction.new(GhostAuction.address, {from: ceo});
    SaleAuction = await MockSaleAuction.new(GhostAuction.address);

    GhostAuction.setSpecialAuctionAddress(SpecialAuction.address, {from: ceo});
    GhostAuction.setSaleAuctionAddress(SaleAuction.address, {from: ceo});

    newGhostOwnership = await MockGhostOwnership.new(ceo, {from: ceo});
    newSpecialAuction = await MockSpecialAuction.new(newGhostOwnership.address, {from: ceo});
    newSaleAuction = await MockSaleAuction.new(newGhostOwnership.address);

    geneOfGhost = new BN(1);
    ghostID = new BN(0);

    await GhostAuction.createEgg(geneOfGhost, ceo);
  });

  describe('#setSpecialAuctionAddress()', () => {
    it('reverts when one who is not ceo tries to set special auction address', async () => {
      await shouldFail.reverting(GhostAuction.setSpecialAuctionAddress(newSpecialAuction.address, {from: owner}));
    });

    it('successfully sets special auction address', async () => {
      await GhostAuction.setSpecialAuctionAddress(newSpecialAuction.address, {from: ceo});

      expect(new BN(await GhostAuction.getSpecialAuctionAddress())).to.be.bignumber.equal(newSpecialAuction.address);
    });
  });

  describe('#createSpecialAuction()', () => {

    it('reverts when one who creates auction is not ghost\'s owner', async () => {
      await shouldFail.reverting(GhostAuction.createSpecialAuction(ghostID, {from: buyer}));
    });

    it('successfully creates special auction', async () => {
      await GhostAuction.createSpecialAuction(ghostID, {from: ceo});

      expect(await GhostAuction.isSpecialAuction(ghostID)).to.be.equal(true);
    });
  });

  describe('#setSaleAuctionAddress()', () => {
    it('reverts when one who is not ceo tries to set sale auction address', async () => {
      await shouldFail.reverting(GhostAuction.setSaleAuctionAddress(newSaleAuction.address, {from: owner}));
    });

    it('successfully sets sale auction address', async () => {
      await GhostAuction.setSaleAuctionAddress(newSaleAuction.address, {from: ceo});

      expect(new BN(await GhostAuction.getSaleAuctionAddress())).to.be.bignumber.equal(newSaleAuction.address);
    });
  });

  describe('#createSaleAuction()', () => {
    let bidAmount;

    beforeEach(async () => {
      bidAmount = new BN(1000);
    });

    it('reverts when buyer is zero address', async () => {
      let zeroAddress = constants.ZERO_ADDRESS;

      await shouldFail.reverting(GhostAuction.createSaleAuction(ghostID, zeroAddress, bidAmount, {from: ceo}));
    });

    it('reverts when bid amount is zero', async () => {
      let zeroAmount = new BN(0);

      await shouldFail.reverting(GhostAuction.createSaleAuction(ghostID, buyer, zeroAmount, {from: ceo}));
    });

    it('reverts when one who is not owner tries to create sale auction', async () => {
      await shouldFail.reverting(GhostAuction.createSaleAuction(ghostID, buyer, bidAmount, {from: owner}));
    });

    it('successfully creates sale auction', async () => {
      await GhostAuction.createSaleAuction(ghostID, buyer, bidAmount, {from: ceo});

      expect(await GhostAuction.isSaleAuction(ghostID)).to.be.equal(true);
    });
  });
});