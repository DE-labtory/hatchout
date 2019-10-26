const {BN, constants, shouldFail} = require('openzeppelin-test-helpers');

const {expect} = require('chai');
const Web3 = require('web3');

const MockHatchOut = artifacts.require('mocks/MockHatchOut');
const MockSpecialAuction = artifacts.require('mocks/MockSpecialAuction');
const MockSaleAuction = artifacts.require('mocks/MockSaleAuction');

contract('MockHatchOut', accounts => {
  const [ceo, owner, buyer] = accounts;

  let HatchOut;
  let SpecialAuction;
  let SaleAuction;
  let web3;

  let newSpecialAuction;
  let newSaleAuction;

  let geneOfGhost;
  let ghostID;
  let signature;

  beforeEach(async () => {
    web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
    HatchOut = await MockHatchOut.new(ceo, {from: ceo});
    SpecialAuction = await MockSpecialAuction.new(HatchOut.address, {from: ceo});
    SaleAuction = await MockSaleAuction.new(HatchOut.address);
    HatchOut.setSpecialAuctionAddress(SpecialAuction.address, {from: ceo});
    HatchOut.setSaleAuctionAddress(SaleAuction.address, {from: ceo});

    newSpecialAuction = await MockSpecialAuction.new(HatchOut.address, {from: ceo});
    newSaleAuction = await MockSaleAuction.new(HatchOut.address);

    geneOfGhost = new BN(1);
    ghostID = new BN(0);

    hash = await web3.utils.soliditySha3(geneOfGhost);
    signature = await web3.eth.sign(hash, ceo);
    await HatchOut.createEgg(geneOfGhost, signature);
  });

  describe('#setAuctionAddresses()', () => {
    it('reverts when one who is not ceo tries to set special auction address', async () => {
      await shouldFail.reverting(HatchOut.setAuctionAddresses(newSpecialAuction.address, newSaleAuction.address, {from: owner}));
    });

    it('successfully sets special and sale auction address', async () => {
      await HatchOut.setAuctionAddresses(newSpecialAuction.address, newSaleAuction.address, {from: ceo});

      expect(new BN(await HatchOut.getSpecialAuctionAddress())).to.be.bignumber.equal(newSpecialAuction.address);
      expect(new BN(await HatchOut.getSaleAuctionAddress())).to.be.bignumber.equal(newSaleAuction.address);
    });
  });

  describe('#setSpecialAuctionAddress()', () => {
    it('reverts when one who is not ceo tries to set special auction address', async () => {
      await shouldFail.reverting(HatchOut.setSpecialAuctionAddress(newSpecialAuction.address, {from: owner}));
    });

    it('successfully sets special auction address', async () => {
      await HatchOut.setSpecialAuctionAddress(newSpecialAuction.address, {from: ceo});

      expect(new BN(await HatchOut.getSpecialAuctionAddress())).to.be.bignumber.equal(newSpecialAuction.address);
    });
  });

  describe('#createSpecialAuction()', () => {

    it('reverts when one who creates auction is not ghost\'s owner', async () => {
      await shouldFail.reverting(HatchOut.createSpecialAuction(ghostID, {from: buyer}));
    });

    it('successfully creates special auction', async () => {
      await HatchOut.createSpecialAuction(ghostID, {from: ceo});

      expect(await HatchOut.isSpecialAuction(ghostID)).to.be.equal(true);
    });
  });

  describe('#setSaleAuctionAddress()', () => {
    it('reverts when one who is not ceo tries to set sale auction address', async () => {
      await shouldFail.reverting(HatchOut.setSaleAuctionAddress(newSaleAuction.address, {from: owner}));
    });

    it('successfully sets sale auction address', async () => {
      await HatchOut.setSaleAuctionAddress(newSaleAuction.address, {from: ceo});

      expect(new BN(await HatchOut.getSaleAuctionAddress())).to.be.bignumber.equal(newSaleAuction.address);
    });
  });

  describe('#createSaleAuction()', () => {
    let bidAmount;

    beforeEach(async () => {
      bidAmount = new BN(1000);
    });

    it('reverts when buyer is zero address', async () => {
      let zeroAddress = constants.ZERO_ADDRESS;

      await shouldFail.reverting(HatchOut.createSaleAuction(ghostID, zeroAddress, bidAmount, {from: ceo}));
    });

    it('reverts when bid amount is zero', async () => {
      let zeroAmount = new BN(0);

      await shouldFail.reverting(HatchOut.createSaleAuction(ghostID, buyer, zeroAmount, {from: ceo}));
    });

    it('reverts when one who is not owner tries to create sale auction', async () => {
      await shouldFail.reverting(HatchOut.createSaleAuction(ghostID, buyer, bidAmount, {from: owner}));
    });

    it('successfully creates sale auction', async () => {
      await HatchOut.createSaleAuction(ghostID, buyer, bidAmount, {from: ceo});

      expect(await HatchOut.isSaleAuction(ghostID)).to.be.equal(true);
    });
  });
});