const { Config } = require('@haechi-labs/vvisp-utils');

module.exports = function(configOption, networkSetter) {
  setters.config(configOption);
  setters.setNetwork(networkSetter);

  return {
    config: setters.config,
    ...loadApis()
  };
};

function loadApis() {
  const apis = {};

  apis['AccessControl'] = require('./js/AccessControl.js');
  apis['AuctionBase'] = require('./js/AuctionBase.js');
  apis['ERC721'] = require('./js/ERC721.js');
  apis['GhostAuction'] = require('./js/GhostAuction.js');
  apis['GhostBase'] = require('./js/GhostBase.js');
  apis['GhostFactory'] = require('./js/GhostFactory.js');
  apis['GhostOwnership'] = require('./js/GhostOwnership.js');
  apis['SaleAuction'] = require('./js/SaleAuction.js');
  apis['SpecialAuction'] = require('./js/SpecialAuction.js');
  return apis;
}

const setters = {
  config: configObj => {
    let config;
    try {
      config = Config.get(configObj);
    } catch (e) {}
    if (!config) {
      config = new Config();
      config.merge(configObj);
    }
    Config.setStore(config);
  },
  setNetwork: networkSetter => {
    const config = Config.get();
    const blockchainApiStore = config.blockchainApiStore;
    if (networkSetter && typeof networkSetter === 'string') {
      blockchainApiStore.setWithURL(networkSetter);
    } else if (networkSetter) {
      blockchainApiStore.setWithProvider(networkSetter);
    } else {
      const config = Config.get();
      let provider;
      try {
        provider = config.provider;
      } catch (e) {}
      if (!provider) {
        throw new Error(
          `Input network config as the second parameter or set network in config file`
        );
      }
      if (typeof provider === 'string') {
        blockchainApiStore.setWithURL(provider);
      } else {
        blockchainApiStore.setWithProvider(provider);
      }
    }
  }
};
