# Decentralised じゃんけん "DeJunkeng"

1 対 1 じゃんけんゲームを dApps で実装。

勝利すると記念コイン「JunkCoin」がもらえる！

# 起動方法

## ローカル環境（Hardhat）で実行する場合

### Hardhat の起動と、スマートコントラクトのデプロイ

```shell
yarn
yarn serve
```

### フロントエンドの起動

```shell
cd frontend
yarn
yarn start
```

## Rinkeby test net にデプロイする場合

### .env の編集

`dot.env` を `.env` にリネームして、エディタで編集する

```
WALLET_MNEMONIC=Replace your wallet mnemonic
RINKEBY_URL=https://eth-mainnet.alchemyapi.io/v2/123abc123abc123abc123abc123abcde
```

注）上記の値はダミーなのでそのまま使えません。

- `WALLET_MNEMONIC`: ウォレットのニーモニック。尚、デプロイには 1 番目のアカウントが使用されます。
- `RINKEBY_URL`: HTTP_RPC の URL を指定してください。geth 等を使用してもいいですし、めんどくさければ [Alchemy](https://www.alchemyapi.io/) 等で借りても（基本無料）良いです。

### スマートコントラクトのデプロイ

```shell
yarn
yarn deploy
```

### フロントエンドの起動

```shell
cd frontend
yarn
yarn start
```

## Mainnet（本番）にデプロイする場合

やる人はいないと思いますが、Mainnet にデプロイしたい場合は、
`hardhat.config.ts` の `networks` に該当の設定を追加してください。

基本的には Rinkeby をコピーして使えばよいと思います。

Mainnet にデプロイするには、お金（Gas 代）がかかります（ビビるくらい高い）。

# 遊び方

まず MetaMask をインストールして、Rinkeby ネットワークに接続し、幾らかの Ether を入手してください。

- [MetaMask](https://metamask.io/)
- [Ether の入手](https://faucet.rinkeby.io/) 
  
  >  Rinkeby test net はテスト用のネットワークなので Ether はタダで入手できます。
  > 
  >  ただし、スパム避けの為にひと手間掛かるようになっています。
  > 
  >  ウォレットのアドレス（0x で始まるコード）をツイッターでツイートして、ツイートURLを入力欄に投稿すると、
  >  しばらくした後に指定のアドレスに送金されます。

  
フロントエンドは `http://localhost:3000` で起動されます。
（直ぐに試せる様に、オンラインにも [デプロイ](https://priceless-lamport-25f389.netlify.app/) してあります）

アクセスすると、MetaMask のアプリ接続画面が表示されるので、使用するアカウントを選択して接続してください。

「Join match」をクリックすると、MetaMask がトランザクション発行の確認ウインドウを開きます。

GAS FEE（ガス代）等を確認して「Confirm」をクリックしてください。
「Confirm」をしない限りゲームは進行しません。

「Confirm」すると画面は切り替わりますが、
裏では Ethereum ネットワークに参加しているマイナーたちが発行されたトランザクションの確認処理を行います。

承認されるまで時間が掛かります。
どれだけの時間が掛かるかは Gas Price によって決まり、高く設定すればするほどより優先して処理される仕組みになっています。

とは言え、Rinkeby では最低設定でも直ぐに承認されます。

対戦相手が現れるまで待ちの状態になります。対戦相手が決まったらじゃんけんができます。

ゲーム開始後 5 分以内にグー・チョキ・パーを決め、トランザクションを通さなければ負けになります。

勝利すると、連勝した回数に応じた JunkCoin がもらえます。（1 回なら 1 JKC、2連勝なら 2 JKC）

獲得した JunkCoin は Withdraw ボタンで自分のアカウントに引き出しが出来ます。

JunkCoin は ERC20 トークンなので、
MetaMask で `0xf25Aded893150faDC14aaDf817471f3C44c325eD` を Add Token すれば所有数を見られます。

# 開発環境

- [Hardhat](https://hardhat.org/)
- [hardhat-react](https://github.com/symfoni/symfoni-monorepo/tree/master/packages/hardhat-react)
- [ethers](https://docs.ethers.io/v5/)
- [web3modal](https://github.com/Web3Modal/web3modal)
- React
