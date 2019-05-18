pragma solidity ^0.5.0;

import "./GhostOwnership.sol";
import "./SpecialAuction.sol";
import "./AccessControl.sol";
import "./SaleAuction.sol";

contract GhostAuction is GhostOwnership, AccessControl {

    // @dev sets reference to the special auction contract.
    // @notice This function is just called by CEO.
    function setSpecialAuctionAddress(address _contractAddress) external onlyCEO {
        SpecialAuction candidateContract = SpecialAuction(_contractAddress);

        specialAuction = candidateContract;
    }

    // @dev create special auction by only CEO.
    // @param _gene - the gene of newly created special ghost.
    function createSpecialAuction(uint256 _gene) external onlyCEO {
        require(_gene != uint256(0));

        uint256 tokenId = _createEgg(_gene, ceoAddress);

        // TODO: initiate duration
        uint256 _duration = 0;

        _approve(_tokenId, specialAuction);

        specialAuction.createAuction(_tokenId, _duration);
    }

    // @dev sets reference to the sale auction contract.
    // @notice This function is just called by CEO.
    function setSaleAuctionAddress(address _contractAddress) external onlyCEO {
        SaleAuction candidateContract = SaleAuction(_contractAddress);

        saleAuction = candidateContract;
    }

    // @dev create sale auction.
    // @param _tokenId - Ghost ID to exchange and put on auction.
    // @param _approved - address of person to buy ghost.
    // @param _amount - offered price of this ghost.
    function createSaleAuction(uint256 _tokenId, address _approved, uint256 _amount) external {
        require(_owns(msg.sender, _tokenId));
        require(_approved != address(0));
        require(_amount > uint256(0));

        _approve(_tokenId, saleAuction);

        saleAuction.createAuction(_tokenId, _approved, _amount);
    }
}
