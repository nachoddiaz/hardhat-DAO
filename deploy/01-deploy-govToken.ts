import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"

const deployGovToken: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        const{getNamedAccounts, deployments, network} = hre;
    };


   export default deployGovToken ;