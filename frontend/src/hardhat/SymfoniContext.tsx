/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { providers, Signer, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Web3Modal, { IProviderOptions } from "web3modal";
import JunkCoinERC20Deployment from "./deployments/localhost/JunkCoinERC20.json";
import { JunkCoinERC20 } from "./typechain/JunkCoinERC20";
import { JunkCoinERC20__factory } from "./typechain/factories/JunkCoinERC20__factory";
import JunkengDeployment from "./deployments/localhost/Junkeng.json";
import { Junkeng } from "./typechain/Junkeng";
import { Junkeng__factory } from "./typechain/factories/Junkeng__factory";
import { ERC20 } from "./typechain/ERC20";
import { ERC20__factory } from "./typechain/factories/ERC20__factory";

const emptyContract = {
    instance: undefined,
    factory: undefined
};
const defaultProvider: providers.Provider | undefined = undefined;
export const ProviderContext = React.createContext<[providers.Provider | undefined, React.Dispatch<React.SetStateAction<providers.Provider | undefined>>]>([defaultProvider, () => { }]);
const defaultCurrentAddress: string = "";
export const CurrentAddressContext = React.createContext<[string, React.Dispatch<React.SetStateAction<string>>]>([defaultCurrentAddress, () => { }]);
const defaultSigner: Signer | undefined = undefined;
export const SignerContext = React.createContext<[Signer | undefined, React.Dispatch<React.SetStateAction<Signer | undefined>>]>([defaultSigner, () => { }]);
const defaultSymfoniContext: SymfoniContextInterface = {
    currentHardhatProvider: "",
    init: () => { throw Error("Symfoni context not initialized") },
    loading: false,
    messages: [],
    providers: []
};
export const SymfoniContext = React.createContext<SymfoniContextInterface>(defaultSymfoniContext);
export const JunkCoinERC20Context = React.createContext<SymfoniJunkCoinERC20>(emptyContract);
export const JunkengContext = React.createContext<SymfoniJunkeng>(emptyContract);
export const ERC20Context = React.createContext<SymfoniERC20>(emptyContract);

export interface SymfoniContextInterface {
    init: (provider?: string) => void;
    loading: boolean;
    messages: string[];
    currentHardhatProvider: string;
    providers: string[];
}

export interface SymfoniProps {
    autoInit?: boolean;
    showLoading?: boolean;
    loadingComponent?: React.ReactNode;
}

export interface SymfoniJunkCoinERC20 {
    instance?: JunkCoinERC20;
    factory?: JunkCoinERC20__factory;
}

export interface SymfoniJunkeng {
    instance?: Junkeng;
    factory?: Junkeng__factory;
}

export interface SymfoniERC20 {
    instance?: ERC20;
    factory?: ERC20__factory;
}

export const Symfoni: React.FC<SymfoniProps> = ({
    showLoading = true,
    autoInit = true,
    ...props
}) => {
    const [initializeCounter, setInitializeCounter] = useState(0);
    const [currentHardhatProvider, setCurrentHardhatProvider] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [signer, setSigner] = useState<Signer | undefined>(defaultSigner);
    const [provider, setProvider] = useState<providers.Provider | undefined>(defaultProvider);
    const [currentAddress, setCurrentAddress] = useState<string>(defaultCurrentAddress);
    const [fallbackProvider] = useState<string | undefined>(undefined);
    const [providerPriority, setProviderPriority] = useState<string[]>(["web3modal", "hardhat"]);
    const [JunkCoinERC20, setJunkCoinERC20] = useState<SymfoniJunkCoinERC20>(emptyContract);
    const [Junkeng, setJunkeng] = useState<SymfoniJunkeng>(emptyContract);
    const [ERC20, setERC20] = useState<SymfoniERC20>(emptyContract);
    useEffect(() => {
        if (messages.length > 0)
            console.debug(messages.pop())
    }, [messages])

    const getProvider = async (): Promise<{ provider: providers.Provider, hardhatProviderName: string } | undefined> => {
        let hardhatProviderName = "Not set";
        let _providerPriority = [...providerPriority];
        // Fallback provider
        if (fallbackProvider && autoInit && initializeCounter === 0) {
            if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") === null) {
                _providerPriority = _providerPriority.sort((a, b) => {
                    return a === fallbackProvider ? -1 : b === fallbackProvider ? 1 : 0;
                })
            }
        }
        const provider = await _providerPriority.reduce(async (maybeProvider: Promise<providers.Provider | undefined>, providerIdentification) => {
            let foundProvider = await maybeProvider
            if (foundProvider) {
                return Promise.resolve(foundProvider)
            }
            else {
                switch (providerIdentification.toLowerCase()) {
                    case "web3modal":
                        try {
                            const provider = await getWeb3ModalProvider()
                            const web3provider = new ethers.providers.Web3Provider(provider);
                            hardhatProviderName = "web3modal";
                            return Promise.resolve(web3provider)
                        } catch (error) {
                            return Promise.resolve(undefined)
                        }
                    case "hardhat":
                        try {
                            const provider = new ethers.providers.JsonRpcProvider({
                                url: "http://127.0.0.1:8545",
                            });
                            hardhatProviderName = "hardhat";
                            return Promise.resolve(provider)
                        } catch (error) {
                            return Promise.resolve(undefined)
                        } default:
                        return Promise.resolve(undefined)
                }
            }
        }, Promise.resolve(undefined)) // end reduce
        return provider ? { provider, hardhatProviderName } : undefined
    };
    const getSigner = async (_provider: providers.Provider, hardhatProviderName: string): Promise<Signer | undefined> => {
        switch (hardhatProviderName) {
            case "web3modal":
                const web3provider = _provider as ethers.providers.Web3Provider
                return await web3provider.getSigner()
            case "hardhat":
                return ethers.Wallet.fromMnemonic("test test test test test test test test test test test junk").connect(_provider)
            default:
                return undefined
        }
    };
    const getWeb3ModalProvider = async (): Promise<any> => {
        const providerOptions: IProviderOptions = {

        };
        const web3Modal = new Web3Modal({
            // network: "mainnet",
            cacheProvider: false,
            providerOptions, // required
        });
        return await web3Modal.connect();
    };

    useEffect(() => {
        let subscribed = true
        const doAsync = async () => {
            const finish = (text: string) => {
                setLoading(false)
                setMessages(old => [...old, text])
            }
            const finishWithContracts = (text: string) => {
                setJunkCoinERC20(getJunkCoinERC20(_provider, _signer))
                setJunkeng(getJunkeng(_provider, _signer))
                setERC20(getERC20(_provider, _signer))
                finish(text)
            }
            if (!autoInit && initializeCounter === 0) return finish("Auto init turned off.")
            setLoading(true)
            setMessages(old => [...old, "Initiating Symfoni React"])
            const providerObject = await getProvider() // getProvider can actually return undefined, see issue https://github.com/microsoft/TypeScript/issues/11094

            if (!subscribed || !providerObject) return finish("No provider or signer.")
            const _provider = providerObject.provider
            setProvider(_provider)
            setMessages(old => [...old, "Useing " + providerObject.hardhatProviderName])
            setCurrentHardhatProvider(providerObject.hardhatProviderName)
            const _signer = await getSigner(_provider, providerObject.hardhatProviderName);

            if (!subscribed || !_signer) return finishWithContracts("Provider, without signer.")
            setSigner(_signer)
            setMessages(old => [...old, "Useing signer"])
            const address = await _signer.getAddress()

            if (!subscribed || !address) return finishWithContracts("Provider and signer, without address.")
            setCurrentAddress(address)

            return finishWithContracts("Completed Symfoni context initialization.")
        };
        doAsync();
        return () => { subscribed = false }
    }, [initializeCounter])

    const getJunkCoinERC20 = (_provider: providers.Provider, _signer?: Signer) => {

        const contractAddress = JunkCoinERC20Deployment.receipt.contractAddress
        const instance = _signer ? JunkCoinERC20__factory.connect(contractAddress, _signer) : JunkCoinERC20__factory.connect(contractAddress, _provider)
        const contract: SymfoniJunkCoinERC20 = {
            instance: instance,
            factory: _signer ? new JunkCoinERC20__factory(_signer) : undefined,
        }
        return contract
    }
        ;
    const getJunkeng = (_provider: providers.Provider, _signer?: Signer) => {

        const contractAddress = JunkengDeployment.receipt.contractAddress
        const instance = _signer ? Junkeng__factory.connect(contractAddress, _signer) : Junkeng__factory.connect(contractAddress, _provider)
        const contract: SymfoniJunkeng = {
            instance: instance,
            factory: _signer ? new Junkeng__factory(_signer) : undefined,
        }
        return contract
    }
        ;
    const getERC20 = (_provider: providers.Provider, _signer?: Signer) => {
        let instance = _signer ? ERC20__factory.connect(ethers.constants.AddressZero, _signer) : ERC20__factory.connect(ethers.constants.AddressZero, _provider)
        const contract: SymfoniERC20 = {
            instance: instance,
            factory: _signer ? new ERC20__factory(_signer) : undefined,
        }
        return contract
    }
        ;

    const handleInitProvider = (provider?: string) => {
        if (provider) {
            setProviderPriority(old => old.sort((a, b) => {
                return a === provider ? -1 : b === provider ? 1 : 0;
            }))
        }
        setInitializeCounter(initializeCounter + 1)
    }
    return (
        <SymfoniContext.Provider value={{ init: (provider) => handleInitProvider(provider), providers: providerPriority, currentHardhatProvider, loading, messages }}>
            <ProviderContext.Provider value={[provider, setProvider]}>
                <SignerContext.Provider value={[signer, setSigner]}>
                    <CurrentAddressContext.Provider value={[currentAddress, setCurrentAddress]}>
                        <JunkCoinERC20Context.Provider value={JunkCoinERC20}>
                            <JunkengContext.Provider value={Junkeng}>
                                <ERC20Context.Provider value={ERC20}>
                                    {showLoading && loading ?
                                        props.loadingComponent
                                            ? props.loadingComponent
                                            : <div>
                                                {messages.map((msg, i) => (
                                                    <p key={i}>{msg}</p>
                                                ))}
                                            </div>
                                        : props.children
                                    }
                                </ERC20Context.Provider >
                            </JunkengContext.Provider >
                        </JunkCoinERC20Context.Provider >
                    </CurrentAddressContext.Provider>
                </SignerContext.Provider>
            </ProviderContext.Provider>
        </SymfoniContext.Provider>
    )

};
