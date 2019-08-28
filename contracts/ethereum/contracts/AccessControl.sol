pragma solidity ^0.5.0;

contract AccessControl {
    address payable public ceoAddress;

    constructor (address payable _ceoAddress) public {
        ceoAddress = _ceoAddress;
    }

    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    function setCEO(address payable _newCEO) external onlyCEO {
        require(_newCEO != address(0));

        ceoAddress = _newCEO;
    }
}
