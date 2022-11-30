import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import {verify} from "../utils/verify"
//@ts-ignore
import { ethers } from "hardhat";

const transferOwnership: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
    ){
        const timeLock = await ethers.getContract("TimeLock")
        const box = await ethers.getContract("Box")
        //Transfer te ownership of the Box contract to the TimeLock contract
        const boxContract =  await ethers.getContractAt("Box", box.address)
        //The transferOwnership functions come from Ownable.sol
        const tranferOwnerTx = await boxContract.transferOwnership(timeLock.address)
        await tranferOwnerTx.wait(1)
        console.log(`Box contract transfered to ${timeLock.address}`)
        console.log("------------------------------------------------")


    }

    
   export default transferOwnership
   transferOwnership.tags = ["all" , "transferOwnership"]

