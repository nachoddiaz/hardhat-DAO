const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { devChains } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
    ? describe.skip
    : describe("Box Contracts Tests ", function () {
          let Box
          let newValue = 37
          let timeLock

          beforeEach(async function () {
            console.log("--------------------------")
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["box", "timelock"])
              timeLock = await ethers.getContract("TimeLock")
              Box = await ethers.getContractAt("Box", timeLock.address)
              
              
          })

          describe("StoreValue", function () {
              it("Emits the 'ValueChanged' event", async function () {
                  await expect(Box.storeValue(newValue)).to.emit(Box, "ValueChanged")
              })
              it("Only the Owner can store a value", async function () {
                await expect(Box.storeValue(newValue)).to.revertedWith("Ownable: caller is not the owner")
              })
              it("Stores the given value ", async function () {
                const value = await Box.storeValue(newValue)
                const value2 = await Box.getStoreValue()
                assert(value.toString() == value2.toString())
              })
          })
      })
