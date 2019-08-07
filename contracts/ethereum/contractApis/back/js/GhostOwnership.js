const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'GhostOwnership.json'), {'encoding': 'utf8'});

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
      supportsInterface: function(_interfaceID, ) {
        return contract.methods.supportsInterface(_interfaceID, ).call();
      },
      name: function() {
        return contract.methods.name().call();
      },
      ceoAddress: function() {
        return contract.methods.ceoAddress().call();
      },
      getGene: function(_tokenId, ) {
        return contract.methods.getGene(_tokenId, ).call();
      },
      getGhosts: function(indexes, ) {
        return contract.methods.getGhosts(indexes, ).call();
      },
      totalSupply: function() {
        return contract.methods.totalSupply().call();
      },
      ghosts: function(input1, ) {
        return contract.methods.ghosts(input1, ).call();
      },
      ownerOf: function(_tokenId, ) {
        return contract.methods.ownerOf(_tokenId, ).call();
      },
      balanceOf: function(_owner, ) {
        return contract.methods.balanceOf(_owner, ).call();
      },
      tokensOfOwner: function(_owner, ) {
        return contract.methods.tokensOfOwner(_owner, ).call();
      },
      symbol: function() {
        return contract.methods.symbol().call();
      },
      ghostIndexToOwner: function(input1, ) {
        return contract.methods.ghostIndexToOwner(input1, ).call();
      },
      ghostIndexToApproved: function(input1, ) {
        return contract.methods.ghostIndexToApproved(input1, ).call();
      },
      approve: function(_to, _tokenId, options) {
        const txData = contract.methods.approve(_to, _tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      transferFrom: function(_from, _to, _tokenId, options) {
        const txData = contract.methods.transferFrom(_from, _to, _tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
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
      setLevelLimit: function(_levelLimit, options) {
        const txData = contract.methods.setLevelLimit(_levelLimit, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      transfer: function(_to, _tokenId, options) {
        const txData = contract.methods.transfer(_to, _tokenId, ).encodeABI();
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
