const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'SaleAuction.json'), {'encoding': 'utf8'});

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
      getAuction: function(_tokenId, ) {
        return contract.methods.getAuction(_tokenId, ).call();
      },
      nonFungibleContract: function() {
        return contract.methods.nonFungibleContract().call();
      },
      tokenIdToAuction: function(input1, ) {
        return contract.methods.tokenIdToAuction(input1, ).call();
      },
      bid: function(_tokenId, options) {
        const txData = contract.methods.bid(_tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      createAuction: function(_tokenId, _seller, _buyer, _amount, options) {
        const txData = contract.methods.createAuction(_tokenId, _seller, _buyer, _amount, ).encodeABI();
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
    }
  }
};

function loadPrivateKey() {
  return Config.get().from;
}
