// @ts-ignore
import { ethers, network } from "hardhat";
import {NEW_STORE_VALUE, 
        FUNC, 
        PROPOSAL_DESCRIPTION, 
        devChains,
        VOTING_DELAY, 
        PROPOSALS_FILE } from "../helper-hardhat-config"
import {moveBlocks} from "../utils/move-blocks"
import * as fs from 'fs';

export async function propose(args: any[], functionToCall: string, proposalDescription: string ){
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");


    const encodedfunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args,
    );

    const ProposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedfunctionCall],
        PROPOSAL_DESCRIPTION
    )
    const proposalReceipt = await ProposeTx.wait(1);

    const proposalId = await proposalReceipt.event[0].args.proposalId;

    let proposals:any;


    
    if (fs.existsSync(PROPOSALS_FILE)) {
    proposals = fs.readFileSync(PROPOSALS_FILE), "utf-8"
    }




    if(devChains.includes(network.name)){
        await moveBlocks(VOTING_DELAY + 1)
    }
    
    console.log(`Proposing ${functionToCall} function on ${box.address} with ${args}`)
    console.log(`Proposal Descrption: \n ${proposalDescription}`)

}


//We call here the store function of the box contract and store the number
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1)
});