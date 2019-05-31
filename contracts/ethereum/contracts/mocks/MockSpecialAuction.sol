pragma solidity ^0.5.0;

import "../SpecialAuction.sol";

contract MockSpecialAuction is SpecialAuction {
    constructor (address _nftAddress) public SpecialAuction(_nftAddress) {}

    function isOnAuction(uint256 _tokenId) external view returns (bool) {
        return _isOnAuction(_tokenId);
    }
}
