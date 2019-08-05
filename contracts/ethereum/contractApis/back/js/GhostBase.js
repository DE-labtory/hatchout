const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'GhostBase.json'), {'encoding': 'utf8'});

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
      ghostIndexToOwner: function(input1, ) {
        return contract.methods.ghostIndexToOwner(input1, ).call();
      },
      ghostIndexToApproved: function(input1, ) {
        return contract.methods.ghostIndexToApproved(input1, ).call();
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
    }
  }
};

function loadPrivateKey() {
  return Config.get().from;
}
