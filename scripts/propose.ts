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

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapShot(proposalId)
    const proposalDeadline = await governor.proposalDeadLine(proposalId)

    // The state of the proposal. 1 is not passed. 0 is passed.
    console.log(`Current Proposal State is ${proposalState} where 0 means that's not passed`)
    // What block # the proposal was snapshot
     console.log(`Current Proposal Snapshot is ${proposalSnapShot} block`)
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline is in ${proposalDeadline} block`)

    let proposals:any;


    
    if (fs.existsSync(PROPOSALS_FILE)) {}
    proposals = fs.readFileSync(PROPOSALS_FILE), "utf-8"
    

    proposals[network.config.chainId!.toString()].push(proposalId.toString());
    fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals))




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