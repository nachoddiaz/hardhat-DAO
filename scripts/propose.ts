// @ts-ignore
import { ethers } from "hardhat";
import {NEW_STORE_VALUE, FUNC, } from "../helper-hardhat-config"

export async function propose(args: any[], functionToCall: string, ){
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");


    const encodedfunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args
    );
    
    console.log(`Proposing ${functionToCall} function on ${box.address} with ${args}`)

}


//We call here the store function of the box contract and store the number
propose([NEW_STORE_VALUE], FUNC)
    .then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1)
});