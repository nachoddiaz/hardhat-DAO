import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import {verify} from "../utils/verify"
//@ts-ignore
import { ethers } from "hardhat";
import { QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY, PROPOSAL_THRESHOLD } from "../helper-hardhat-config";

const deployGovContract: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        //@ts-ignore
        const{getNamedAccounts, deployments, network} = hre;
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        const chainId = network.config.chainId
        const governanceToken = await ethers.getContract("GovToken")
        const timeLock = await ethers.getContract("TimeLock")

        const argumentos = [
            governanceToken.address,
            timeLock.address,
            QUORUM_PERCENTAGE,
            VOTING_DELAY,
            VOTING_PERIOD,
            PROPOSAL_THRESHOLD
        ]

        const governanceContract = await deploy("GovernorContract", {
            from: deployer,
            args: argumentos,
            log: true,
            /* waitConfirmations: networkConfig[network.name].blockConfirmations || 1, */
        })
        log(`Governance Contract deployed at address ${governanceContract.address}`)
        if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
            await verify(governanceContract.address, arguments)
            log("Contract Verified")
        }

        console.log("--------------------------------")
    };


export default deployGovContract
deployGovContract.tags = ["all", "govContract"]

