import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import {verify} from "../utils/verify"
//@ts-ignore
import { ethers } from "hardhat";

const deployGovToken: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        //@ts-ignore
        const{getNamedAccounts, deployments, network} = hre;
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        const chainId = network.config.chainId

        const governanceToken = await deploy("GovToken", {
            from: deployer,
            args: [],
            log: true,
            /* waitConfirmations: networkConfig[network.name].blockConfirmations || 1, */
        })
        log(`Governance token contract deployed at address ${governanceToken.address}`)
        if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
            await verify(governanceToken.address, arguments)
            log("Contract Verified")
        }

        await delegate(governanceToken.address, deployer)
        console.log(`votes delegated to ${deployer}`)
        console.log("--------------------------------")
    };

    const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
        const governanceToken = await ethers.getContractAt("GovToken", governanceTokenAddress)
        /* const TxResponse = await governanceToken.delegate(delegatedAccount) */
        const transactionResponse = await governanceToken.delegate(delegatedAccount)
        await transactionResponse.wait(1)
        console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
    } 



   export default deployGovToken
   deployGovToken.tags = ["all" , "govToken"]

