import { PROPOSALS_FILE, devChains, VOTING_DELAY } from "../helper-hardhat-config";
import {moveBlocks} from "../utils/move-blocks"
import * as fs from 'fs';
// @ts-ignore
import { network, ethers } from "hardhat";

const index=0

export async function main(proposalIndex: number){
    const proposal = JSON.parse(fs.readFileSync(PROPOSALS_FILE,"utf8"))
    const porposalId = proposal[network.config.chainId!][proposalIndex]
    //we can vote 0 to vote against, 1 to vote for and 2 to abstain
    const voteWay =1
    const voteReason = "77 is my favorite number"
    await vote(porposalId, voteWay, voteReason)
}

export async function vote(proposalId: string, voteWay: number, voteReason: string){
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTX = await governor.castVoteWithReason(proposalId, voteWay, voteReason)
    const voteTxReceipt = await voteTX.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)
    if(devChains.includes(network.name)){
        await moveBlocks(VOTING_DELAY + 1)
    }
    const proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)
}


main(index)
    .then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1)
});