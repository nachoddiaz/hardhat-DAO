import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "solidity-coverage"
import "dotenv/config"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/types"

const Rinkeby_URL = process.env.Rinkeby_RPC_URL
const Goerly_URL = process.env.Goerly_RPC_URL
const PRIVATE_KEY = process.env.Private_KEY as string
const CMC_API_KEY = process.env.CMCAPI
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const config : HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        rinkeby: {
            chainId: 4,
            url: Rinkeby_URL,
            accounts: [PRIVATE_KEY],
        },
        goerli: {
            chainId: 5,
            url: Goerly_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: CMC_API_KEY,
        token: "MATIC",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    solidity:{
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 1000000, // está en ms
    },
}

export default config
