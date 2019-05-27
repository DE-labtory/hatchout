const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const MockGhostOwnership = artifacts.require('mocks/MockGhostOwnership');

contract('MockGhostOwnership', accounts => {
  const [ceo, owner, receiver, approver] = accounts;

  let GhostOwnership;

  let ghostID;
  let geneOfGhost;

  beforeEach(async () => {
    GhostOwnership = await MockGhostOwnership.new(ceo, {from: ceo});
    ghostID = new BN(0);

    geneOfGhost = new BN(2);
    await GhostOwnership.createEgg(geneOfGhost, owner);
  });

  describe('supportsInterface()', () => {
    let interfaceSignature;

    beforeEach(async () => {
      interfaceSignature = '0x9f40b779';
    });

    it('return false when not same as the contract\'s signature', async () => {
      expect(await GhostOwnership.supportsInterface('0x0')).to.be.equal(false);
    });

    it('return true when same as the contract\'s signature', async () => {
      expect(await GhostOwnership.supportsInterface(interfaceSignature)).to.be.equal(true);
    });
  });

  describe('#owns()', () => {
    it('return false when given address does not have ghost ID', async () => {
      expect(await GhostOwnership.owns(receiver, ghostID)).to.be.equal(false);
    });

    it('return true when given address has ghost ID', async () => {
      expect(await GhostOwnership.owns(owner, ghostID)).to.be.equal(true);
    });
  });

  describe('#balanceOf()', () => {
    it('updates ghost count which owner has on successful creation', async () => {
      expect(await GhostOwnership.balanceOf(owner)).to.be.bignumber.equal(new BN(1));
    });
  });

  describe('#transfer()', () => {
    it('reverts when transferring ghost to the zero address', async () => {
      await shouldFail.reverting(GhostOwnership.transfer(constants.ZERO_ADDRESS, ghostID, {from: owner}));
    });

    it('reverts when transferring ghost to the ghost\'s owner address', async () => {
      await shouldFail.reverting(GhostOwnership.transfer(owner, ghostID, {from: owner}));
    });

    it('reverts when transferring ghost from address does not own this ghost', async () => {
      await shouldFail.reverting(GhostOwnership.transfer(receiver, ghostID, {from: approver}));
    });

    it('updates owner on successful transfer', async () => {
      await GhostOwnership.transfer(receiver, ghostID, {from: owner});

      expect(await GhostOwnership.owns(receiver, ghostID)).to.be.equal(true);
    });
  });

  describe('#approve()', () => {
    it('reverts when approving ghost to the zero address', async () => {
      await shouldFail.reverting(GhostOwnership.approve(constants.ZERO_ADDRESS, ghostID, {from: owner}));
    });

    it('reverts when approving ghost from address does not own this ghost', async () => {
      await shouldFail.reverting(GhostOwnership.approve(approver, ghostID, {from: approver}));
    });

    it('emit Approval event on successful approval', async () => {
      const { logs } = await GhostOwnership.approve(approver, ghostID, {from: owner});

      await expectEvent.inLogs(logs, 'Approval', {from: owner, to: approver, tokenId: ghostID});
    });

    it('updates approval on successful approval', async () => {
      await GhostOwnership.approve(approver, ghostID, {from:owner});

      expect(await GhostOwnership.approvedFor(approver, ghostID)).to.be.equal(true);
    });
  });

  describe('#transferFrom()', async () => {
    beforeEach(async () => {
      await GhostOwnership.approve(approver, ghostID, {from:owner});
    });

    it('reverts when transferring ghost from the zero address', async () => {
      await shouldFail.reverting(GhostOwnership.transferFrom(constants.ZERO_ADDRESS, receiver, ghostID, {from: approver}));
    });

    it('reverts when transferring ghost to the zero address', async () => {
      await shouldFail.reverting(GhostOwnership.transferFrom(owner, constants.ZERO_ADDRESS, ghostID, {from: approver}));
    });

    it('reverts when transferring ghost from address does not own this ghost', async () => {
      await shouldFail.reverting(GhostOwnership.transferFrom(approver, receiver, ghostID, {from: approver}));
    });

    it('reverts when transferred by someone who is not approver', async () => {
      await shouldFail.reverting(GhostOwnership.transferFrom(owner, receiver, ghostID, {from: receiver}));
    });

    it('updates owner on successful transfer', async () => {
      await GhostOwnership.transferFrom(owner, receiver, ghostID, {from: approver});

      expect(await GhostOwnership.owns(receiver, ghostID)).to.be.equal(true);
    });
  });

  describe('#ownerOf()', async () => {
    it('reverts when checking owner of unowned ghost', async () => {
      const newGhostID = new BN(1);

      await shouldFail.reverting(GhostOwnership.ownerOf(newGhostID));
    });

    it('successfully checks owner', async () => {
      expect(await GhostOwnership.ownerOf(ghostID)).to.be.equal(owner);
    });
  });
});
