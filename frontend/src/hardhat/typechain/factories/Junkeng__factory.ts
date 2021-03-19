/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Junkeng } from "../Junkeng";

export class Junkeng__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(_coin: string, overrides?: Overrides): Promise<Junkeng> {
    return super.deploy(_coin, overrides || {}) as Promise<Junkeng>;
  }
  getDeployTransaction(
    _coin: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_coin, overrides || {});
  }
  attach(address: string): Junkeng {
    return super.attach(address) as Junkeng;
  }
  connect(signer: Signer): Junkeng__factory {
    return super.connect(signer) as Junkeng__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Junkeng {
    return new Contract(address, _abi, signerOrProvider) as Junkeng;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_coin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "Disclosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Earned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "a",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "a_index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "b",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "b_index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Established",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "Joined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "a",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "a_index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "a_handShape",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "b",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "b_index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "b_handShape",
        type: "uint8",
      },
    ],
    name: "Settled",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_handShape",
        type: "uint8",
      },
    ],
    name: "disclose",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "getCoinBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "coins",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOpponentStatus",
    outputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "handShape",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "streak",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "phase",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStatus",
    outputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "handShape",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "streak",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "phase",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "join",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516117933803806117938339818101604052602081101561003357600080fd5b5051600180546001600160a01b039092166001600160a01b031992831617905560008054909116331790556117268061006d6000396000f3fe608060405234801561001057600080fd5b50600436106100725760003560e01c8063b48b557011610050578063b48b557014610101578063b688a36314610109578063e4df85201461011157610072565b80633ccfd60b146100775780634e69d560146100815780638fca6874146100d2575b600080fd5b61007f610131565b005b610089610477565b604080516001600160a01b039098168852602088019690965260ff9485168787015260608701939093529216608085015260a084019190915260c0830152519081900360e00190f35b6100ef600480360360208110156100e857600080fd5b50356105bc565b60408051918252519081900360200190f35b610089610741565b61007f61094e565b61007f6004803603602081101561012757600080fd5b503560ff16610e9c565b60023360009081526003602052604090206001015460ff16600281111561015457fe5b141561033d5733600090815260036020526040812054906101748261151c565b60025490915081101561033a5760006101c96002848154811061019357fe5b906000526020600020906003020160010154600284815481106101b257fe5b90600052602060002090600302016001015461152d565b905061012c811115610338573360009081526003602052604081206001908101805460ff19169091179055600280548590811061020257fe5b6000918252602090912060039182020154600160a01b900460ff169081111561022757fe5b14158015610266575060006002838154811061023f57fe5b6000918252602090912060039182020154600160a01b900460ff169081111561026457fe5b145b156102e357336000818152600360208181526040808420600201805460018082018355600485529583902080549091019095019094559181529154815193845291830186905282810191909152517f6876fda64f1c65c9d3f597e85b191207e3b78c313b6797570007d3e8a08eed789181900360600190a16102f7565b336000908152600360205260408120600201555b60036002848154811061030657fe5b906000526020600020906003020160020160006101000a81548160ff0219169083600381111561033257fe5b02179055505b505b50505b3360009081526004602052604090205461039e576040805162461bcd60e51b815260206004820152600860248201527f4e6f20636f696e73000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b336000818152600460208181526040808420805490859055600154855483517f23b872dd0000000000000000000000000000000000000000000000000000000081526001600160a01b039182169681019690965260248601979097526044850182905291519095909116936323b872dd936064808201949392918390030190829087803b15801561042e57600080fd5b505af1158015610442573d6000803e3d6000fd5b505050506040513d602081101561045857600080fd5b5050336000908152600360208190526040909120018054600101905550565b6000808080808080803360009081526003602052604090206001015460ff1660028111156104a157fe5b116104f3576040805162461bcd60e51b815260206004820152600f60248201527f4e6f20726567697374726174696f6e0000000000000000000000000000000000604482015290519081900360640190fd5b3360008181526003602052604090205460028054929950909750908790811061051857fe5b600091825260209091206003918202016002015460ff169081111561053957fe5b94506002868154811061054857fe5b90600052602060002090600302016001015493506002868154811061056957fe5b6000918252602090912060039182020154600160a01b900460ff169081111561058e57fe5b3360009081526003602081905260409091206002810154910154989997989697959691959094509092509050565b600060023360009081526003602052604090206001015460ff1660028111156105e157fe5b141561072b5733600090815260036020526040902054600280828154811061060557fe5b600091825260209091206003918202016002015460ff169081111561062657fe5b141561072957600061063782611542565b905060006106816002848154811061064b57fe5b9060005260206000209060030201600101546002848154811061066a57fe5b9060005260206000209060030201600101546115ad565b8503905061012c811180156106c857506000600284815481106106a057fe5b6000918252602090912060039182020154600160a01b900460ff16908111156106c557fe5b14155b801561070557506000600283815481106106de57fe5b6000918252602090912060039182020154600160a01b900460ff169081111561070357fe5b145b15610726573360009081526003602052604090206002015493909301600101925b50505b505b3360009081526004602052604090205401919050565b6000808080808080803360009081526003602052604090206001015460ff16600281111561076b57fe5b116107bd576040805162461bcd60e51b815260206004820152600f60248201527f4e6f20726567697374726174696f6e0000000000000000000000000000000000604482015290519081900360640190fd5b336000908152600360205260409020546107d681611542565b9650600287815481106107e557fe5b6000918252602090912060039091020154600280546001600160a01b039092169950908890811061081257fe5b600091825260209091206003918202016002015460ff169081111561083357fe5b95506002878154811061084257fe5b9060005260206000209060030201600101549450600360006002898154811061086757fe5b60009182526020808320600392830201546001600160a01b031684528301939093526040909101812060029081015481549096508a9081106108a557fe5b60009182526020808320600392830201546001600160a01b03168452830193909352604090910190200154915060028082815481106108e057fe5b600091825260209091206003918202016002015460ff169081111561090157fe5b101561090e576000610937565b6002878154811061091b57fe5b6000918252602090912060039091020154600160a01b900460ff165b600381111561094257fe5b93505090919293949596565b60023360009081526003602052604090206001015460ff16600281111561097157fe5b1415610b245733600090815260036020526040812054906109918261151c565b600254909150811015610b215760006109b06002848154811061019357fe5b905061012c811115610b1f573360009081526003602052604081206001908101805460ff1916909117905560028054859081106109e957fe5b6000918252602090912060039182020154600160a01b900460ff1690811115610a0e57fe5b14158015610a4d5750600060028381548110610a2657fe5b6000918252602090912060039182020154600160a01b900460ff1690811115610a4b57fe5b145b15610aca57336000818152600360208181526040808420600201805460018082018355600485529583902080549091019095019094559181529154815193845291830186905282810191909152517f6876fda64f1c65c9d3f597e85b191207e3b78c313b6797570007d3e8a08eed789181900360600190a1610ade565b336000908152600360205260408120600201555b600360028481548110610aed57fe5b906000526020600020906003020160020160006101000a81548160ff02191690836003811115610b1957fe5b02179055505b505b50505b60013360009081526003602052604090206001015460ff166002811115610b4757fe5b1115610b9a576040805162461bcd60e51b815260206004820152601460248201527f416c726561647920706172746963697061746564000000000000000000000000604482015290519081900360640190fd5b600280546040805160808101825233815260006020820181815242938301939093526001606083018190528401855593909352825160038084027f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0180546001600160a01b039093167fffffffffffffffffffffffff0000000000000000000000000000000000000000909316929092178083559251939493919283917fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff90911690600160a01b908490811115610c6d57fe5b02179055506040820151816001015560608201518160020160006101000a81548160ff02191690836003811115610ca057fe5b021790555060009150610cb09050565b3360009081526003602052604090206001015460ff166002811115610cd157fe5b1415610d4d576040805160808101909152818152602081016002815260006020808301829052604092830182905233825260038152919020825181559082015160018083018054909160ff1990911690836002811115610d2d57fe5b021790555060408201516002820155606090910151600390910155610d6e565b336000908152600360205260409020818155600101805460ff191660021790555b604080513381526020810183905281517f49f8fa5eee2e3f21251c2e968640dcaef35cb9332429eb059bb3cd56ddc2533d929181900390910190a16002810660011415610e7f576000610dca6002600184038154811061064b57fe5b90507fd599fddddd6f19ebc013f20b5a43b042ee5964d209a964274fab8977eb819c0860026001840381548110610dfd57fe5b906000526020600020906003020160000160009054906101000a90046001600160a01b03166001840360028581548110610e3357fe5b600091825260209182902060039091020154604080516001600160a01b0395861681529283019390935292909216828201526060820185905260808201849052519081900360a00190a1505b503360009081526003602081905260409091200180546001019055565b60013360009081526003602052604090206001015460ff166002811115610ebf57fe5b11610f11576040805162461bcd60e51b815260206004820152601060248201527f4e6f74207061727469636970616e747300000000000000000000000000000000604482015290519081900360640190fd5b3360009081526003602052604081205490610f2b82611542565b9050600060028281548110610f3c57fe5b60009182526020909120600390910201546001600160a01b03169050600160028481548110610f6757fe5b600091825260209091206003918202016002015460ff1690811115610f8857fe5b14610fda576040805162461bcd60e51b815260206004820152601160248201527f416c726561647920646973636c6f736564000000000000000000000000000000604482015290519081900360640190fd5b60018460ff1610158015610ff2575060038460ff1611155b611043576040805162461bcd60e51b815260206004820152601260248201527f496e76616c69642068616e642073686170650000000000000000000000000000604482015290519081900360640190fd5b60006110746002858154811061105557fe5b906000526020600020906003020160010154600285815481106101b257fe5b905061012c8111156110c55760006002858154811061108f57fe5b906000526020600020906003020160000160146101000a81548160ff021916908360038111156110bb57fe5b0217905550611113565b8460ff1660038111156110d457fe5b600285815481106110e157fe5b906000526020600020906003020160000160146101000a81548160ff0219169083600381111561110d57fe5b02179055505b600280858154811061112157fe5b906000526020600020906003020160020160006101000a81548160ff0219169083600381111561114d57fe5b0217905550604080513381526020810186905281517f23a6200ad6fe186c45badcd285c34c438705aeb48f037b18133d21df2544ff76929181900390910190a1600280848154811061119b57fe5b600091825260209091206003918202016002015460ff16908111156111bc57fe5b14156114fb577f13e26580722ac6f5336050b3e9fcd2db95f9313d74b4c00ceaf1017e0e159cec3385600287815481106111f257fe5b6000918252602090912060039182020154600160a01b900460ff169081111561121757fe5b85876002898154811061122657fe5b6000918252602090912060039182020154600160a01b900460ff169081111561124b57fe5b604080516001600160a01b039788168152602081019690965260ff948516868201529290951660608501526080840152921660a082015290519081900360c00190a1600061129985856115c5565b90508060000b600114156113535733600081815260036020818152604080842060028082018054600180820183556004875285892080549092018101909155958552918501805460ff1990811687179091556001600160a01b038b1687528387208087018054909216909617905593909301849055928490529054825193845290830188905282820152517f6876fda64f1c65c9d3f597e85b191207e3b78c313b6797570007d3e8a08eed789181900360600190a1611456565b8060000b600019141561140c576001600160a01b038316600081815260036020818152604080842060028082018054600180820183556004875285892080549092018101909155958552918501805460ff1990811687179091553387528387208087018054909216909617905593909301849055928490529054825193845290830187905282820152517f6876fda64f1c65c9d3f597e85b191207e3b78c313b6797570007d3e8a08eed789181900360600190a1611456565b336000908152600360205260408082206001808201805460ff19908116831790915560029283018590556001600160a01b0388168552928420808201805490941690911790925501555b60036002868154811061146557fe5b906000526020600020906003020160020160006101000a81548160ff0219169083600381111561149157fe5b02179055506003600285815481106114a557fe5b906000526020600020906003020160020160006101000a81548160ff021916908360038111156114d157fe5b0217905550506001600160a01b038216600090815260036020819052604090912001805460010190555b50503360009081526003602081905260409091200180546001019055505050565b600119811660018281011601919050565b600061153983836115ad565b42039392505050565b60008061154e8361151c565b60025490915081106115a7576040805162461bcd60e51b815260206004820152601260248201527f4f70706f6e656e74206e6f742072656164790000000000000000000000000000604482015290519081900360640190fd5b92915050565b60008183116115bc57816115be565b825b9392505050565b60408051610100810182526000608080830182815260001960a0850181905260c0850181905260e0850181905290845284518083018652600180825260208281018690528288018290526060808401859052818801939093528751808601895282815280820185905280890187905280840183905287890152875194850188528185528401529482015280840182905292820192909252600280548291908690811061166d57fe5b6000918252602090912060039182020154600160a01b900460ff169081111561169257fe5b60ff166004811061169f57fe5b6020020151600284815481106116b157fe5b6000918252602090912060039182020154600160a01b900460ff16908111156116d657fe5b60ff16600481106116e357fe5b602002015194935050505056fea264697066735822122083ebec546dafd3f33f7dc5b531e18ee5f84f10b53e7d109d9ae3ff5871f7535b64736f6c63430007060033";