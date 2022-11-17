import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import {verify} from "../utils/verify"
import { ethers } from "hardhat";
import {ADDRESS_ZERO} from "../helper-hardhat-config"

const setupGovContracts: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        const{getNamedAccounts, deployments, network} = hre;
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        const chainId = network.config.chainId

        console.log("Setting up roles")

        const timeLock = await ethers.getContract("TimeLock", deployer)
        const governor = await ethers.getContract("GovernorContract", deployer)

        const proposer = await timeLock.PROPOSER_ROLE();
        const executor = await timeLock.EXECUTOR_ROLE();
        const admin = await timeLock.TIMELOCK_ADMIN_ROLE();

        const proposerTx = await timeLock.grantRole(proposer, governor.address)
        await proposerTx.wait(1)

        //We assing address zero to the executor so anybodycan execute the proposal
        const executorTx = await timeLock.grantRole(executor, ADDRESS_ZERO)
        await executorTx.wait(1)

        //To make the DAO descentraliced, we need the deployer not to be able to grant any more roles
        const revokeTx = await timeLock.revokeRole(admin, deployer)
        await revokeTx.wait(1)

    
        
        console.log("--------------------------------")
    }

    export default setupGovContracts

setupGovContracts.tags = ["all", "setupGovContracts"]