/* // @ts-ignore
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

    if(devChains.includes(network.name)){
        await moveBlocks(VOTING_DELAY + 1)
    }

    const proposalReceipt = await ProposeTx.wait(1);

    const proposalId = await proposalReceipt.events[0].args.proposalId

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)

    // The state of the proposal. 1 is not passed. 0 is passed.
    console.log(`Current Proposal State is ${proposalState} where 0 means that's not passed`)
    // What block # the proposal was snapshot
     console.log(`Current Proposal Snapshot is ${proposalSnapShot} block`)
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline is in ${proposalDeadline} block`)


    function storeProposalId(proposalId: any){
        const chainId = network.config.chainId!.toString()
        let proposals:any

        if (fs.existsSync(PROPOSALS_FILE)) {
            proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"));
        } else {
            proposals = { };
            proposals[chainId] = [];
        }   
        proposals[chainId].push(proposalId.toString());
        fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals), "utf8");
    }


    
    console.log(`Proposing ${functionToCall} function on ${box.address} with ${args}`)
    console.log(`Proposal Descrption: \n ${proposalDescription}`)

}


//We call here the store function of the box contract and store the number
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1)
}); */

//@ts-ignore
import { ethers, network } from "hardhat"
import {
  devChains,
  VOTING_DELAY,
  PROPOSALS_FILE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
  console.log(`Proposal Description:\n  ${proposalDescription}`)
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
  // If working on a development chain, we will push forward till we get to the voting period.
  if (devChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }
  const proposeReceipt = await proposeTx.wait(1)
  const proposalId = proposeReceipt.events[0].args.proposalId
  console.log(`Proposed with proposal ID:\n  ${proposalId}`)

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)
  // save the proposalId
  storeProposalId(proposalId);

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

function storeProposalId(proposalId: any) {
  const chainId = network.config.chainId!.toString();
  let proposals:any;

  if (fs.existsSync(PROPOSALS_FILE)) {
      proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"));
  } else {
      proposals = { };
      proposals[chainId] = [];
  }   
  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals), "utf8");
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })