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
      hash = await web3.utils.soliditySha3(geneOfGhost);
      signature = await web3.eth.sign(hash, ceo);
    });

    it('reverts when creating ghost that gene is zero', async () => {
      await shouldFail.reverting(GhostFactory.createEgg(new BN(0), signature, {from: owner}));
    });

    it('reverts when ghost\'s gene is too big', async () => {
      await shouldFail.reverting(GhostFactory.createEgg(constants.MAX_INT256, signature, {from: owner}));
    });

    it('revert when signature is not same', async () => {
      const wrongSignature = await web3.eth.sign(hash, owner);

      await shouldFail.reverting(GhostFactory.createEgg(geneOfGhost, wrongSignature, {from: owner}));
    });

    it('revert when signature is used twice', async () => {
      await GhostFactory.createEgg(geneOfGhost, signature, {from: owner});

      await shouldFail.reverting(GhostFactory.createEgg(geneOfGhost, signature, {from: owner}));
    });

    it('successfully create egg', async () => {
      await GhostFactory.createEgg(geneOfGhost, signature, {from: owner});

      expect(await GhostFactory.balanceOf(owner)).to.be.bignumber.equal(new BN(1));
    });
  });

  describe('#levelUp()', () => {
    let signature;
    let hash;

    beforeEach(async () => {
      hash = await web3.utils.soliditySha3(geneOfGhost);
      signature = await web3.eth.sign(hash, ceo);
      await GhostFactory.createEgg(geneOfGhost, signature, {from: owner});
      hash = await web3.utils.soliditySha3(ghostID, new BN(0));
      signature = await web3.eth.sign(hash, ceo);
    });

    it('reverts when fee of level up is too low', async () => {
      await shouldFail.reverting(GhostFactory.levelUp(ghostID, signature, {from: owner, value: web3.utils.toWei("0", "szabo")}));
    });

    it('reverts when owner who does not have the ghost', async () => {
      await shouldFail.reverting(GhostFactory.levelUp(ghostID, signature, {from: ceo, value: web3.utils.toWei("1", "szabo")}));
    });

    it('reverts when signature is not same', async () => {
      const wrongSignature = await web3.eth.sign(hash, owner);

      await shouldFail.reverting(GhostFactory.levelUp(ghostID, wrongSignature, {from: owner, value: web3.utils.toWei("1", "szabo")}));
    });

    it('reverts when signature is used twice', async () => {
      await GhostFactory.levelUp(ghostID, signature, {from: owner, value: web3.utils.toWei("1", "szabo")});

      await shouldFail.reverting(GhostFactory.levelUp(ghostID, signature, {from: owner, value: web3.utils.toWei("1", "szabo")}));
    });

    it('successfully the ghost\'s level up', async () => {
      await GhostFactory.levelUp(ghostID, signature, {from: owner, value: web3.utils.toWei("1", "szabo")});

      expect(await GhostFactory.getLevelOfGhost(ghostID)).to.be.bignumber.equal(new BN(1));
    });
  });
});