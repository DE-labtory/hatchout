const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'AuctionBase.json'), {'encoding': 'utf8'});

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
      nonFungibleContract: function() {
        return contract.methods.nonFungibleContract().call();
      },
      tokenIdToAuction: function(input1, ) {
        return contract.methods.tokenIdToAuction(input1, ).call();
      },
    }
  }
};

function loadPrivateKey() {
  return Config.get().from;
}
