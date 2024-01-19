import '../App.css';
import { WagmiConfig, createConfig, useAccount } from "wagmi";
import { AaveData } from '../services/aave-data';
import { Button } from 'primereact/button';
import { ethers } from 'ethers';
import {
    UiPoolDataProvider,
    UiIncentiveDataProvider,
    ChainId,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';

const rpcUrl: string = process.env.REACT_APP_FORK_URL ?? "";
// Sample RPC address for querying ETH mainnet
const provider = new ethers.providers.JsonRpcProvider(
    rpcUrl
);

const Account = () => {

    const { address } = useAccount(
        {
            onConnect: ({ address }) => {
                //const aaveData: AaveData = new AaveData({ rpcUrl, address: `${address}` });
                //const { fetchContractData } = aaveData;
                // User address to fetch data for, insert address here
                const currentAccount = `${address}`;

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

                fetchContractData();
            }
        }
    );
    
    //fetchContractData();
    return (
        <div>{address}
           
        </div>
    
    );
}

export default Account;
