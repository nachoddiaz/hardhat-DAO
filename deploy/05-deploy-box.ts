import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import {verify} from "../utils/verify"
//@ts-ignore
import { ethers } from "hardhat";

const deployBox: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        //@ts-ignore
        const{getNamedAccounts, deployments, network} = hre;
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        const chainId = network.config.chainId

        const box = await deploy("Box", {
            from: deployer,
            args: [],
            log: true,
            /* waitConfirmations: networkConfig[network.name].blockConfirmations || 1, */
        })

        log(`Box contract deployed at address ${box.address}`)
        log("------------------------------------------------")
        if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
            await verify(box.address, arguments)
            log("Contract Verified")
        }

        
    };

    



   export default deployBox
   deployBox.tags = ["all" , "box"]

