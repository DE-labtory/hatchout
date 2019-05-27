const { BN, constants, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const Web3 = require('web3');

const MockGhostFactory = artifacts.require('mocks/MockGhostFactory');

contract('MockGhostFactory', accounts => {
  const [ceo, owner] = accounts;

  let GhostFactory;
  let web3;

  let geneOfGhost;
  let ghostID;

  beforeEach(async () => {
    GhostFactory = await MockGhostFactory.new(ceo, {from: ceo});
    web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
    geneOfGhost = new BN(1);
    ghostID = new BN(0);
  });

  describe('#createEgg()', () => {
    let signature;
    let hash;

    beforeEach(async () => {
      hash = await web3.utils.soliditySha3(geneOfGhost, owner);
      signature = await web3.eth.sign(hash, owner);
    });

    it('reverts when creating ghost that gene is zero', async () => {
      await shouldFail.reverting(GhostFactory.createEgg(new BN(0), owner, signature));
    });

    it('reverts when ghost\'s owner is the zero address', async () => {
      await shouldFail.reverting(GhostFactory.createEgg(geneOfGhost, constants.ZERO_ADDRESS, signature));
    });

    it('revert when signature is not same', async () => {
      const wrongSignature = await web3.eth.sign(hash, ceo);

      await shouldFail.reverting(GhostFactory.createEgg(geneOfGhost, owner, wrongSignature));
    });

    it('successfully create egg', async () => {
      await GhostFactory.createEgg(geneOfGhost, owner, signature);

      expect(await GhostFactory.balanceOf(owner)).to.be.bignumber.equal(new BN(1));
    });
  });

  describe('#levelUp()', () => {
    let signature;
    let hash;

    beforeEach(async () => {
      hash = await web3.utils.soliditySha3(geneOfGhost, owner);
      signature = await web3.eth.sign(hash, owner);
      await GhostFactory.createEgg(geneOfGhost, owner, signature);
      hash = await web3.utils.soliditySha3(ghostID);
      signature = await web3.eth.sign(hash, owner);
    });

    it('reverts when ghost\'s owner is zero address', async () => {
      await shouldFail.reverting(GhostFactory.levelUp(constants.ZERO_ADDRESS, ghostID, signature, {from: owner}));
    });

    it('reverts when owner who does not have the ghost', async () => {
      await shouldFail.reverting(GhostFactory.levelUp(ceo, ghostID, signature, {from: owner}));
    });

    it('reverts when signature is not same', async () => {
      const wrongSignature = await web3.eth.sign(hash, ceo);

      await shouldFail.reverting(GhostFactory.levelUp(owner, ghostID, wrongSignature, {from: owner}));
    });

    it('successfully the ghost\'s level up', async () => {
      await GhostFactory.levelUp(owner, ghostID, signature, {from: owner});

      expect(await GhostFactory.getLevelOfGhost(ghostID)).to.be.bignumber.equal(new BN(1));
    });
  });
});
