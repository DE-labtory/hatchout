const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'MockGhostBase.json'), {'encoding': 'utf8'});

  const platform = Config.get().platform;
  const Contract = getContractFactory({ platform: platform });
  const contract = new Contract(JSON.parse(abi));
  contract.options.address = _contractAddr;
  return {
    at: function(_addr) {
      contract.options.address = _addr;
    },
    getAddress: function() {
      return contract.options.address;
    },
    methods: {
      ceoAddress: function() {
        return contract.methods.ceoAddress().call();
      },
      ghosts: function(input1, ) {
        return contract.methods.ghosts(input1, ).call();
      },
      owns: function(_owner, _tokenId, ) {
        return contract.methods.owns(_owner, _tokenId, ).call();
      },
      ghostIndexToOwner: function(input1, ) {
        return contract.methods.ghostIndexToOwner(input1, ).call();
      },
      ghostIndexToApproved: function(input1, ) {
        return contract.methods.ghostIndexToApproved(input1, ).call();
      },
      getLevelOfGhost: function(_tokenId, ) {
        return contract.methods.getLevelOfGhost(_tokenId, ).call();
      },
      getLevelLimit: function() {
        return contract.methods.getLevelLimit().call();
      },
      setCEO: function(_newCEO, options) {
        const txData = contract.methods.setCEO(_newCEO, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      createEgg: function(_gene, _owner, options) {
        const txData = contract.methods.createEgg(_gene, _owner, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      levelUp: function(_owner, _tokenId, options) {
        const txData = contract.methods.levelUp(_owner, _tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      setLevelLimit: function(_levelLimit, options) {
        const txData = contract.methods.setLevelLimit(_levelLimit, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      transfer: function(_from, _to, _tokenId, options) {
        const txData = contract.methods.transfer(_from, _to, _tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
    }
  }
};

function loadPrivateKey() {
  return Config.get().from;
}
