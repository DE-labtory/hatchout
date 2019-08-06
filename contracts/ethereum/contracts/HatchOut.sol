pragma solidity ^0.5.0;

import "./GhostFactory.sol";
import "./SpecialAuction.sol";
import "./SaleAuction.sol";

contract HatchOut is GhostFactory {
    // address of special auction that control sale of special ghost.
    SpecialAuction public specialAuction;

    // address of sale auction that control sale of ghost between users.
    SaleAuction public saleAuction;


    constructor (address payable _ceoAddress) public GhostFactory(_ceoAddress){}

    // @notice sets reference to the special auction contract and sets reference to the sale auction contract.
    // @dev This function is just called by CEO.
    function setAuctionAddresses(address _specialAuctionContractAddress, address _saleAuctionContractAddress) external onlyCEO {
        specialAuction = SpecialAuction(_specialAuctionContractAddress);

        saleAuction = SaleAuction(_saleAuctionContractAddress);
    }

    // @notice sets reference to the special auction contract.
    // @dev This function is just called by CEO.
    function setSpecialAuctionAddress(address _contractAddress) external onlyCEO {
        SpecialAuction candidateContract = SpecialAuction(_contractAddress);

        specialAuction = candidateContract;
    }

    // @notice create special auction by only CEO.
    // @param _tokenId - Ghost ID of special ghost.
    function createSpecialAuction(uint256 _tokenId) external onlyCEO {
        require(_owns(msg.sender, _tokenId));

        // TODO: initiate duration
        uint256 _duration = 3 seconds;

        _approve(address(specialAuction), _tokenId);

        specialAuction.createAuction(_tokenId, msg.sender, _duration);
    }

    // @notice sets reference to the sale auction contract.
    // @dev This function is just called by CEO.
    function setSaleAuctionAddress(address _contractAddress) external onlyCEO {
        SaleAuction candidateContract = SaleAuction(_contractAddress);

        saleAuction = candidateContract;
    }

    // @notice create sale auction.
    // @param _tokenId - Ghost ID to exchange and put on auction.
    // @param _buyer - address of person to buy ghost.
    // @param _amount - offered price of this ghost.
    function createSaleAuction(uint256 _tokenId, address payable _buyer, uint256 _amount) external {
        require(_owns(msg.sender, _tokenId));
        require(_buyer != address(0));
        require(_amount > uint256(0));

        _approve(address(saleAuction), _tokenId);

        saleAuction.createAuction(_tokenId, msg.sender, _buyer, _amount);
    }
}