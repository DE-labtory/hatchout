const externalConfig = require('./truffle-config');

module.exports = {
  network: 'ropsten',
  networks: {
    development: {
      url: 'http://localhost:8545'
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/132632aea5d34cc383a079ce194c9049',
    }
  },
  from: '0x0751B94C3C90D001E36997BC78135336388E4C025A27050759B1A6A2326F2C8D'
};
