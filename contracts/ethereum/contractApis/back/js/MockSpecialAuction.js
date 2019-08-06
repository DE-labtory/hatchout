const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'MockSpecialAuction.json'), {'encoding': 'utf8'});

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
      isOnAuction: function(_tokenId, ) {
        return contract.methods.isOnAuction(_tokenId, ).call();
      },
      getNumBidders: function(_tokenId, ) {
        return contract.methods.getNumBidders(_tokenId, ).call();
      },
      getAuction: function(_tokenId, ) {
        return contract.methods.getAuction(_tokenId, ).call();
      },
      getAmount: function(_tokenId, ) {
        return contract.methods.getAmount(_tokenId, ).call();
      },
      nonFungibleContract: function() {
        return contract.methods.nonFungibleContract().call();
      },
      tokenIdToAuction: function(input1, ) {
        return contract.methods.tokenIdToAuction(input1, ).call();
      },
      createAuction: function(_tokenId, _seller, _duration, options) {
        const txData = contract.methods.createAuction(_tokenId, _seller, _duration, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      bid: function(_tokenId, _bidAmount, options) {
        const txData = contract.methods.bid(_tokenId, _bidAmount, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      cancelAuction: function(_tokenId, options) {
        const txData = contract.methods.cancelAuction(_tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      endAuction: function(_tokenId, options) {
        const txData = contract.methods.endAuction(_tokenId, ).encodeABI();
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
