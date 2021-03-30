declare module "@eth-optimism/contracts" {
    import { ContractFactory, Signer } from 'ethers'

    export function getContractFactory(
        name: string,
        signer?: Signer,
        ovm?: boolean
    ): ContractFactory;
}
