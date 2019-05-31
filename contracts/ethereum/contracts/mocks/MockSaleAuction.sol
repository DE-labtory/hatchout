pragma solidity ^0.5.0;

import "../SaleAuction.sol";

contract MockSaleAuction is SaleAuction {
    constructor (address _nftAddress) public SaleAuction(_nftAddress) {}

    function isOnAuction(uint256 _tokenId) external view returns (bool) {
        return _isOnAuction(_tokenId);
    }

    function owns(address _owner, uint256 _tokenId) external view returns (bool) {
        return _owns(_owner, _tokenId);
    }
}
