pragma solidity ^0.5.0;

import "./AuctionBase.sol";
import "./ERC721.sol";

contract SaleAuction is AuctionBase {

    constructor (address _nftAddress) public AuctionBase(_nftAddress) {}

    // @dev create auction to sale of ghost.
    //  There is a person to buy ghost.
    // @param _tokenId - Ghost ID to put on auction.
    // @param _approved - address of person to buy ghost.
    // @param _amount - offered price of ghost.
    // @notice Message sender of this function owns _tokenId.
    function createAuction(uint256 _tokenId, address _approved, uint256 _amount) external {
        require(_amount == uint256(uint128(_amount)));
        require(!_isOnAuction(_tokenId));

        require(_owns(msg.sender, _tokenId));
        _escrow(msg.sender, _tokenId);

        Auction memory auction = Auction({
            seller: msg.sender,
            winner: _approved,
            maxPrice: uint128(_amount),
            sumPrice: uint256(0),
            duration: uint64(0),
            startedAt: uint64(now)
            });

        _addAuction(_tokenId, auction);
    }

    // @dev bids on sale auction.
    //  This function just transfer ghost to given person.
    //  Buyer has to pay fee.
    function bid(uint256 _tokenId) external payable {
        require(msg.sender == address(nonFungibleContract));
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));

        require(msg.sender == auction.winner);

        // TODO: setting bidding fee
        auction.seller.send(auction.maxPrice);
        _transfer(msg.sender, _tokenId);
        _removeAuction(_tokenId);
    }

    // @dev cancel ongoing auction.
    // @param _tokenId - auctioned Ghost ID in auction to cancel.
    // @notice This function is just called by seller registered on the auction.
    function cancelAuction(uint256 _tokenId) external {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        require(msg.sender == auction.seller);

        _cancelAuction(_tokenId);
    }

    // @dev returns bid amount of bidder(Message sender of this function)
    function getAuction(uint256 _tokenId) external view returns (address, address, uint256, uint256, uint256, uint256) {

        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));

        return (auction.seller, auction.winner, auction.maxPrice, auction.sumPrice, auction.duration, auction.startedAt);
    }
}
