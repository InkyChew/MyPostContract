const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  const likeContract = await hre.ethers.deployContract("LikePortal", {
    value: ethers.parseEther("0.1"),
  });
  await likeContract.waitForDeployment();

  console.log("Contract deployed to:", likeContract.target);
  console.log("Contract balance:", hre.ethers.formatEther(
    await hre.ethers.provider.getBalance(likeContract.target)
  ));
  console.log("Contract deployed by:", owner.address);


  const p1 = await likeContract.createPost("My first post!");
  await p1.wait();
  await likeContract.getAllPost();

  const a1 = await likeContract.getAuthor(owner.address);
  console.log(a1.totalPosts, a1.hadPayoff);

  const p2 = await likeContract.createPost("My Second post!");
  await p2.wait();
  await likeContract.getAllPost();

  const a2 = await likeContract.getAuthor(owner.address);
  console.log(a2.totalPosts, a2.hadPayoff);

  const p3 = await likeContract.createPost("My Second post!");
  await p3.wait();
  await likeContract.getAllPost();

  const a3 = await likeContract.getAuthor(owner.address);
  console.log(a3.totalPosts, a3.hadPayoff);

  const po = await likeContract.payoff();
  console.log("Contract balance:", hre.ethers.formatEther(
    await hre.ethers.provider.getBalance(likeContract.target)
  ));
  const a4 = await likeContract.getAuthor(owner.address);
  console.log(a4.totalPosts, a4.hadPayoff);

  // const up1 = await likeContract.updatePost(0, "Update My first post!");
  // await up1.wait();
  // await likeContract.getAllPost();

  // const like = await likeContract.like(0);
  // await like.wait();
  // await likeContract.getAllPost();

  // const unlike = await likeContract.like(0);
  // await unlike.wait();
  // await likeContract.getAllPost();

  // const d1 = await likeContract.deletePost(0);
  // await d1.wait();
  // await likeContract.getAllPost();

  // Put the following code in LikePortal.sol
  // console.log("============================");
  // for(uint256 i = 0; i < allPost.length; i++) {
  //     console.log(allPost[i].postId, allPost[i].content);
  //     for(uint256 j = 0; j < allPost[i].allLovers.length; j++) {
  //         console.log(allPost[i].allLovers[j]);
  //     }
  // }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();