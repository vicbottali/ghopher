import { ethers } from 'ethers';
import {
    UiPoolDataProvider,
    UiIncentiveDataProvider,
    ChainId,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';

export class AaveData {
    public provider: ethers.providers.JsonRpcProvider;
    public poolDataProviderContract: UiPoolDataProvider;
    public incentiveDataProviderContract: UiIncentiveDataProvider;
    private _currentAccount: string;

    get currentAccount() {
        return this._currentAccount;
    }

    constructor({ rpcUrl, address }: {rpcUrl: string, address: string}) {
        const provider = new ethers.providers.JsonRpcProvider(
            rpcUrl,
        );

        this.provider = provider;
        this._currentAccount = address;

        this.poolDataProviderContract = new UiPoolDataProvider({
            uiPoolDataProviderAddress: markets.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
            provider,
            chainId: ChainId.mainnet,
        });


        // View contract used to fetch all reserve incentives (APRs), and user incentives
        // Using Aave V3 Eth Mainnet address for demo
        this.incentiveDataProviderContract = new UiIncentiveDataProvider({
            uiIncentiveDataProviderAddress:
                markets.AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
            provider,
            chainId: ChainId.mainnet,
        });
    }

    async fetchContractData() : Promise<any> {
    // Object containing array of pool reserves and market base currency data
    // { reservesArray, baseCurrencyData }
    const reserves = await this.poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
    });

    // Object containing array or users aave positions and active eMode category
    // { userReserves, userEmodeCategoryId }
    const userReserves = await this.poolDataProviderContract.getUserReservesHumanized({
        lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        user: this.currentAccount,
    });

    // Array of incentive tokens with price feed and emission APR
    const reserveIncentives =
        await this.incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider:
                markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        });

    // Dictionary of claimable user incentives
    const userIncentives =
        await this.incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
            lendingPoolAddressProvider:
                markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
            user: this.currentAccount,
        });

    console.log({ reserves, userReserves, reserveIncentives, userIncentives });
}


}
