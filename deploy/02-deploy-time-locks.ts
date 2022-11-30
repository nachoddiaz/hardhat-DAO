import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import {networkConfig, MIN_DELAY, } from "../helper-hardhat-config"
import {verify} from "../utils/verify"
//@ts-ignore
import { ethers } from "hardhat";

const deployTimeLock: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        //@ts-ignore
        const{getNamedAccounts, deployments, network} = hre;
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        const chainId = network.config.chainId

        const argumentos =[
            MIN_DELAY,
            [],
            [],
            deployer
        ]

        const timeLock = await deploy("TimeLock", {
            from: deployer,
            args: argumentos,
            log: true,
            /* waitConfirmations: networkConfig[network.name].blockConfirmations || 1, */
        })
        log(`TimeLock contract deployed at address ${timeLock.address}`)
        log("---------------------------------------------------")
        if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
            await verify(timeLock.address, argumentos)
            log("Contract Verified")
        }

     }

    
    export default deployTimeLock
    deployTimeLock.tags = ["all", "timelock"]