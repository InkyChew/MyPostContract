const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await hre.ethers.provider.getBalance(deployer.address);

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const likeContract = await hre.ethers.deployContract("LikePortal", {
        value: ethers.parseEther("0.1"),
    });
    await likeContract.waitForDeployment();

    console.log("LikeContract address: ",  await likeContract.getAddress());
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();