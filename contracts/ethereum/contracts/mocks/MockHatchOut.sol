pragma solidity ^0.5.0;

import "../HatchOut.sol";

contract MockHatchOut is HatchOut {
    constructor (address payable _ceoAddress) public HatchOut(_ceoAddress){}

    function getSpecialAuctionAddress() external view returns (address) {
        return address(specialAuction);
    }

    function isSpecialAuction(uint256 _tokenId) external view returns (bool) {
        address seller;
        (seller, , , , ) = specialAuction.getAuction(_tokenId);

        return seller != address(0);
    }

    function getSaleAuctionAddress() external view returns (address) {
        return address(saleAuction);
    }

    function createEgg(uint64 _gene, address owner) external {
        _createEgg(_gene, owner);
    }

    function isSaleAuction(uint256 _tokenId) external view returns (bool) {
        address seller;
        (seller, , , , ) = saleAuction.getAuction(_tokenId);

        return seller != address(0);
    }
}