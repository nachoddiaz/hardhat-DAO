import {NEW_STORE_VALUE, 
    FUNC, 
    PROPOSAL_DESCRIPTION, 
    devChains, 
    VOTING_DELAY,
    MIN_DELAY} from "../helper-hardhat-config" 
import { moveTime } from "../utils/move-time"
import { moveBlocks } from "../utils/move-blocks"
//@ts-ignore
import { ethers, network } from "hardhat"

export async function queueAndExecute(){
    const args = [NEW_STORE_VALUE]
    const box = await ethers.getContract("Box")
    const encodedfunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    const governor = await ethers.getContract("GovernorContract");
    console.log("Queueing proposal...")
    const queueTx = await governor.queue([box.address], [0],  [encodedfunctionCall], descriptionHash)
    await queueTx.wait(1)

    if(devChains.includes(network.name)){
        await moveBlocks( 1)
        await moveTime(MIN_DELAY +1)
    }

    console.log("Executing...")
    const executeTx = await governor.executing([box.address], [0],  [encodedfunctionCall], descriptionHash)
    await executeTx.wait(1)

    if(devChains.includes(network.name)){
        await moveBlocks( 1)
        await moveTime(MIN_DELAY +1)
    }

    const boxNewValue = await box.retreive();
    console.log(`New Box Value is ${boxNewValue.toString()}`)

}

queueAndExecute()
    .then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1)
});