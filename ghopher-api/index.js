const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const {
ChainId,
UiIncentiveDataProvider,
UiPoolDataProvider,
} = require('@aave/contract-helpers');
const markets = require('@bgd-labs/aave-address-book');
const ethers = require('ethers');


const app = express();
app.use(cors());

const rpcUrl = process.env.FORK_URL;

app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "API is up and running.",
    });
});


app.get('/aave-data', async (req, res) => {
    console.log(req.query);
    const { address } = req.query;

    const provider = new ethers.providers.JsonRpcProvider(
        rpcUrl,
    );

    // User address to fetch data for, insert address here
    const currentAccount = address;

    // View contract used to fetch all reserves data (including market base currency data), and user reserves
    // Using Aave V3 Eth Mainnet address for demo
    const poolDataProviderContract = new UiPoolDataProvider({
        uiPoolDataProviderAddress: markets.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
        provider,
        chainId: ChainId.mainnet,
    });

    // View contract used to fetch all reserve incentives (APRs), and user incentives
    // Using Aave V3 Eth Mainnet address for demo
    const incentiveDataProviderContract = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress:
            markets.AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
        provider,
        chainId: ChainId.mainnet,
    });

    async function fetchContractData() {
        // Object containing array of pool reserves and market base currency data
        // { reservesArray, baseCurrencyData }
        const reserves = await poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        });

        // Object containing array or users aave positions and active eMode category
        // { userReserves, userEmodeCategoryId }
        const userReserves = await poolDataProviderContract.getUserReservesHumanized({
            lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
            user: currentAccount,
        });

        // Array of incentive tokens with price feed and emission APR
        const reserveIncentives =
            await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
                lendingPoolAddressProvider:
                    markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
            });

        // Dictionary of claimable user incentives
        const userIncentives =
            await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
                lendingPoolAddressProvider:
                    markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
                user: currentAccount,
            });

        console.log({ reserves, userReserves, reserveIncentives, userIncentives });
    }

    await fetchContractData();

    return res.status(200)
});

app.listen(8000, () =>
    console.log('Example app listening on port 8000!'),
);


module.exports.handler = serverless(app);