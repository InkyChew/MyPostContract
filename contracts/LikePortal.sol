// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract LikePortal {

    struct Post { 
        uint256 postId;
        address author;
        string content;
        uint lastUpdated;
        address[] allLovers;
    }
    Post[] allPost;

    struct Author {
        uint256 totalPosts;
        bool hadPayoff;
    }
    mapping(address => Author) progress;

    event newPosts(Post[] allPost);
    event newAuthor(Author author);

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function getAllPost() public view returns (Post[] memory) {
        return allPost;
    }

    function createPost(string calldata content) public {
        uint256 postId = allPost.length == 0 ? 0 : allPost.length;
        address[] memory emptyLovers;
        allPost.push(Post(postId, msg.sender, content, block.timestamp, emptyLovers));
        progress[msg.sender].totalPosts += 1;
        emit newPosts(allPost);
        emit newAuthor(progress[msg.sender]);
    }

    function updatePost(uint256 postId, string calldata content) public {
        Post storage post = allPost[postId];
        require(msg.sender == post.author, "Unauthorized");
        post.content = content;
        post.lastUpdated = block.timestamp;
        emit newPosts(allPost);
    }

    function deletePost(uint256 postId) public {
        Post memory post = allPost[postId];
        require(msg.sender == post.author, "Unauthorized");

        for (uint256 i = postId; i < allPost.length; i++) {
            if(i+1 < allPost.length) {
                allPost[i] = allPost[i+1];
                allPost[i].postId = i;                
            }
        }
        allPost.pop();
        progress[msg.sender].totalPosts -= 1;
        emit newPosts(allPost);
        emit newAuthor(progress[msg.sender]);
    }

    function like(uint256 postId) public {
        updateLover(allPost[postId].allLovers, msg.sender);
        emit newPosts(allPost);
    }

    function updateLover(address[] storage allLovers, address addr) private {
        bool hasFind = false;
        for (uint256 i = 0; i < allLovers.length; i++) {
            if (allLovers[i] == addr) hasFind = true;
            if(hasFind && i+1 < allLovers.length) allLovers[i] = allLovers[i+1];
        }
        hasFind ? allLovers.pop() : allLovers.push(addr);
    }

    function payoff() public {
        require(progress[msg.sender].totalPosts > 2,
            "Unable to earn the price yet!");
        require(!progress[msg.sender].hadPayoff,
            "Unable to earn the price more than one time!");
        uint256 prizeAmount = 0.0001 ether;
        require(prizeAmount <= address(this).balance,
            "Ethers have been lack off currently."
        );
        
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");

        progress[msg.sender].hadPayoff = true;
        emit newAuthor(progress[msg.sender]);
    }

    function getAuthor(address account) public view returns (Author memory) {
        return progress[account];
    }
}