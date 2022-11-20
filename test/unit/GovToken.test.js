const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { devChains } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
    ? describe.skip
    : describe("Governance Token Tests ", function () {
          beforeEach(async function () {
              console.log("--------------------------")
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              timeLock = await ethers.getContract("TimeLock")
              Box = await ethers.getContract("Box")
          })

          describe("constructor", function () {
              it("initializes the Governance token", async function () {
                  const s_tokenCounter = await BasicNFT.getTokenCounter()
                  assert.equal(s_tokenCounter.toString(), "0")
                  const name = await BasicNFT.name()
                  assert.equal(name, "Onix")
                  const symbol = await BasicNFT.symbol()
                  assert.equal(symbol, "ONIX")
              })
          })

          describe("_afterTokenTransfer", function () {
              /* it("Emits the 'ValueChanged' event", async function () {
                await expect(Box.storeValue(newValue)).to.emit(Box, "ValueChanged")
            }) */
              it("Only the Owner can store a value", async function () {
                  await expect(Box.storeValue(newValue)).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })
          })
      })
