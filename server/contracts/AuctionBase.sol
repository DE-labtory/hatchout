pragma solidity ^0.5.0;

import "./ERC721.sol";

contract AuctionBase {

    // TODO: set signature of ERC721
    // @dev The ERC-165 interface signature for ERC-721.
    bytes4 constant InterfaceSignature_ERC721 = bytes4(0x9a20483d);
    ERC721 public nonFungibleContract;

    constructor (address _nftAddress) public {
        ERC721 candidateContract = ERC721(_nftAddress);
        require(candidateContract.supportsInterface(InterfaceSignature_ERC721));
        nonFungibleContract = candidateContract;
    }

    struct Auction {
        // creator who this auction create.
        address seller;

        // current the most bid person and price (in wei) that this person bidding.
        address winner;
        uint128 maxPrice;

        //uint256 sumPrice;

        // Duration (in seconds) of auction
        uint64 duration;

        // Time when auction started
        uint64 startedAt;
    }

    // TODO: setting minimum auctioneer and bid price
    //uint16 constant minAuctioneer = 0;
    //uint128 constant minPrice = 0;

    // mapping from token ID(ghost ID) to Auction.
    mapping (uint256 => Auction) tokenIdToAuction;

    // mapping from token ID(ghost ID) to bidders and amounts.
    // allocate one more mapping to calculate the number of bidders who participating in auction.
    mapping (uint256 => mapping (address => uint256)) tokenIdToBidderAndAmount;
    mapping (uint256 => address[]) tokenIdToBidders;

    event AuctionCreated(uint256 tokenId, uint256 duration);
    event AuctionSuccessful(uint256 tokenId, uint256 sumPrice, address winner);
    event AuctionCancelled(uint256 tokenId);

    event BidderCreated(uint256 tokenId, address bidder);
    event BidAmountUpdated(uint256 tokenId, address bidder, uint256 newAmount);

    // @dev Returns true if given address owns the token.
    function _owns(address _owner, uint256 tokenId) internal view returns (bool) {
        return nonFungibleContract.ownerOf(_tokenId) == _owner;
    }

    // @dev Escrows the NFT, assigning ownership to this contract.
    // @param _owner - Current owner address of token to escrow.
    // @param _tokenId - ID of token whose approval to verify.
    function _escrow(address _owner, uint256 tokenId) internal {
        nonFungibleContract.transferFrom(_owner, this, _tokenId);
    }

    // @dev Transfers an NFT owned by this contract to another address.
    function _transfer(address _to, uint256 _tokenId) internal {
        nonFungibleContract.transfer(_to, _tokenId);
    }

    // @dev Adds an auction to the list of auctions.
    // @param _tokenId - Ghost ID to put on auction.
    function _addAuction(uint256 _tokenId, Auction _auction) internal {
        // TODO: setting minimum duration
        require(_auction.duration >= 1 minutes);

        tokenIdToAuction[_tokenId] = _auction;

        emit AuctionCreated(uint256(_tokenId), uint256(_auction.duration));
    }

    // @dev removes an auction from the list of auctions.
    // @param _tokenId - auctioned Ghost ID.
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];

        uint256 idx;
        for (idx = 0; idx < tokenIdToBidders[_tokenId].length; idx++) {
            delete tokenIdToBidderAndAmount[_tokenId][tokenIdToBidders[_tokenId][idx]];
        }

        delete tokenIdToBidderAndAmount[_tokenId];
        delete tokenIdToBidders[_tokenId];
    }

    // @dev cancel ongoing auction.
    // @param _tokenId - Ghost ID in auction to cancel.
    function _cancelAuction(uint256 _tokenId) internal {
        _removeAuction(_tokenId);
        _transfer(tokenIdToAuction[_tokenId].seller, _tokenId);
        emit AuctionCancelled(_tokenId);
    }

    // @dev check if auction is ongoing.
    function _isOnAuction(Auction storage _auction) internal view returns (bool) {
        return _auction.startedAt > 0;
    }

    // @dev bidder who have not participated participates in the ongoing auction.
    // @param _tokenId - auctioned Ghost ID.
    // @notice when bidder has not yet bid
    function _addBidder(uint256 _tokenId, address _bidder, uint256 _bidAmount) internal {
        require(tokenIdToBidderAndAmount[_tokenId][_bidder] == uint256(0));

        tokenIdToBiddersAndAmount[_tokenId][_bidder] = _bidAmount;
        tokenIdToBidders[_tokenId].push(_bidder);

        emit BidderCreated(_tokenId, _bidder.bidder);
    }

    // @dev amount of bidder who have participated updates.
    // @param _tokenId - auctioned Ghost ID.
    // @notice when bidder has been bid
    function _updateBidAmount(uint256 _tokenId, address _bidder, uint256 _bidAmount) internal {
        Auction storage auction = tokenIdToAuction[_tokenId];
        uint256 currentPrice = 0;

        require(tokenIdToBidderAndAmount[_tokenId][_bidder] != uint256(0));
        require(tokenIdToBidderAndAmount[_tokenId][_bidder] < _bidAmount);

        tokenIdToBidderAndAmount[_tokenId][_bidder] = _bidAmount;
        //auction.sumPrice += _bidAmount;

        require(auction.maxPrice < _bidAmount);

        auction.winner = _bidder;
        auction.maxPrice = currentPrice;

        emit BidderUpdated(_tokenId, _bidder, _bidAmount);
    }

    // @dev check if the auction is finished by checking startedAt and duration of auction.
    function _isFinished(uint256 _tokenId) internal view returns (bool) {
        uint256 passedSeconds = 0;

        if (now > tokenIdToAuction[_tokenId].startedAt) {
            passedSeconds = now - tokenIdToAuction[_tokenId].startedAt;
        }

        if (passedSeconds > tokenIdToAuction[_tokenId].duration){
            return true;
        }

        return false;
    }

    // @dev bids on special auction.
    // @notice Auction should be ongoing.
    function _bid(uint256 _tokenId, address _bidder, uint256 _bidAmount) internal {
        require(_isOnAuction(auction));

        //require(tokenIdToBidders[_tokenId].length >= minAuctioneer);
        require(_bidAmount > 0);

        if (tokenIdToBidderAndAmount[_tokenId][msg.sender] == 0) {
            _addBidder(_tokenId, _bidder, _bidAmount);
        }

        _updateBidAmount(_tokenId, _bidder, _bidAmount);
    }
}
