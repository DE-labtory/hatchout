const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'ERC721.json'), {'encoding': 'utf8'});

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
      totalSupply: function() {
        return contract.methods.totalSupply().call();
      },
      ownerOf: function(_tokenId, ) {
        return contract.methods.ownerOf(_tokenId, ).call();
      },
      balanceOf: function(_owner, ) {
        return contract.methods.balanceOf(_owner, ).call();
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
