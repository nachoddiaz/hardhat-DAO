import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import networkConfig from "../helper-hardhat-config"
import {verify} from "../utils/verify"

const deployGovToken: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        const{getNamedAccounts, deployments, network} = hre;
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        log("Deploying Governance token")
        const chainId = network.config.chainId

        const governanceToken = await deploy("GovToken", {
            from: deployer,
            args: [],
            log: true,
            waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        })
        if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
            log("Verificando....")
            await verify(governanceToken.address, arguments)
        }
    };


   export default deployGovToken ;