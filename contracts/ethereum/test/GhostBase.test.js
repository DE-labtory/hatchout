const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const MockGhostBase = artifacts.require('mocks/MockGhostBase');

contract('MockGhostBase', accounts => {
  const [ceo, owner, receiver] = accounts;

  let GhostBase;

  let geneOfGhost;
  let ghostID;

  beforeEach(async () => {
    GhostBase = await MockGhostBase.new(ceo, {from: ceo});
    geneOfGhost = new BN(1);
    ghostID = new BN(0);
  });

  describe('#createEgg()', () => {
    let receipt;

    beforeEach(async () => {
      receipt = await GhostBase.createEgg(geneOfGhost, owner);
    });

    it('emit Birth event on successful creation egg of ghost', async () => {
      await expectEvent.inLogs(receipt.logs, 'Birth', { owner: owner, tokenId: ghostID, gene: geneOfGhost });
    });

    it('updates ghost\'s owner on successful creation', async () => {
      expect(await GhostBase.owns(owner, ghostID)).to.be.equal(true);
    });
  });

  describe('#levelUp()', () => {
    let beforeLevel;
    let receipt;
    let levelOfGhostID;
    let levelLimit;

    beforeEach(async () => {
      receipt = await GhostBase.createEgg(geneOfGhost, owner);
      beforeLevel = new BN(await GhostBase.getLevelOfGhost(ghostID));
      receipt = await GhostBase.levelUp(owner, ghostID, {from: owner});
      levelOfGhostID = new BN(1);
      levelLimit = new BN(1);
    });

    it('reverts when exceed level limit', async () => {
      await GhostBase.setLevelLimit(levelLimit, {from: ceo});

      await shouldFail.reverting(GhostBase.levelUp(owner, ghostID, {from: owner}));
    });

    it('emit LevelUp event on successful level increment', async () => {
      await expectEvent.inLogs(receipt.logs, 'LevelUp', { owner: owner, tokenId: ghostID, level: levelOfGhostID});
    });

    it('updates ghost\'s level on successful LevelUp event', async () => {
      expect(await GhostBase.getLevelOfGhost(ghostID)).to.be.bignumber.equal(beforeLevel + 1);
    });
  });

  describe('#transfer()', () => {
    it('reverts when transferring ghost to the zero address', async () => {
      await shouldFail.reverting(GhostBase.transfer(owner, constants.ZERO_ADDRESS, ghostID));
    });

    it('emit Transfer event on successful transfer', async () => {
      const { logs } = await GhostBase.transfer(owner, receiver, ghostID);
      await expectEvent.inLogs(logs, 'Transfer', {from: owner, to: receiver, tokenId: ghostID});
    });

    it('updates owner on successful transfer', async () => {
      await GhostBase.transfer(owner, receiver, ghostID);
      assert.equal(await GhostBase.owns(receiver, ghostID), true);
    });
  });

  describe('#setLevelLimit()', () => {
    let levelLimit;

    beforeEach(async () => {
      levelLimit = new BN(1);
    });

    it('reverts when calling this function by not ceo', async () => {
      await shouldFail.reverting(GhostBase.setLevelLimit(levelLimit, {from: owner}));
    });

    it('updates successfully limit of level', async () => {
      await GhostBase.setLevelLimit(levelLimit, {from: ceo});

      expect(await GhostBase.getLevelLimit()).to.be.bignumber.equal(levelLimit);
    });
  });
});
