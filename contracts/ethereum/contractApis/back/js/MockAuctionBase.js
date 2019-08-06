const path = require('path');
const { Config, getContractFactory, sendTx } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'MockAuctionBase.json'), {'encoding': 'utf8'});

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
      owns: function(_owner, _tokenId, ) {
        return contract.methods.owns(_owner, _tokenId, ).call();
      },
      getBidderAmount: function(_tokenId, _bidder, ) {
        return contract.methods.getBidderAmount(_tokenId, _bidder, ).call();
      },
      nonFungibleContract: function() {
        return contract.methods.nonFungibleContract().call();
      },
      tokenIdToAuction: function(input1, ) {
        return contract.methods.tokenIdToAuction(input1, ).call();
      },
      isFinished: function(_tokenId, ) {
        return contract.methods.isFinished(_tokenId, ).call();
      },
      isAddedBidder: function(_tokenId, _bidder, ) {
        return contract.methods.isAddedBidder(_tokenId, _bidder, ).call();
      },
      removeAuction: function(_tokenId, options) {
        const txData = contract.methods.removeAuction(_tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      escrow: function(_owner, _tokenId, options) {
        const txData = contract.methods.escrow(_owner, _tokenId, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      addAuction: function(_tokenId, _auctionType, options) {
        const txData = contract.methods.addAuction(_tokenId, _auctionType, ).encodeABI();
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
      transfer: function(_to, _tokenId, options) {
        const txData = contract.methods.transfer(_to, _tokenId, ).encodeABI();
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
      bid: function(_tokenId, _bidder, _bidAmount, options) {
        const txData = contract.methods.bid(_tokenId, _bidder, _bidAmount, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      addBidder: function(_tokenId, _bidder, _bidAmount, options) {
        const txData = contract.methods.addBidder(_tokenId, _bidder, _bidAmount, ).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(contract.options.address, options ? options.value : 0, loadPrivateKey(), options);
      },
      updateBidAmount: function(_tokenId, _bidder, _bidAmount, options) {
        const txData = contract.methods.updateBidAmount(_tokenId, _bidder, _bidAmount, ).encodeABI();
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
