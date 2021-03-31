# Decentralized じゃんけん "DeJunkeng"

1 対 1 じゃんけんゲームを dApps で実装。

勝利すると記念コイン「JunkCoin」がもらえる！

※Optimistic rollups 実装バージョンです。

# 起動方法

## ローカル環境で実行する場合

### optimism-integration を導入後、起動

```shell
git clone git@github.com:ethereum-optimism/optimism-integration.git --recurse-submodules
cd optimism-integration
docker-compose pull

./up.sh
```

※別ターミナルで実行する事

### 設定

```shell
mv dot.env .env
vi .env
```

以下の様に修正

```shell
# Default account on optimism-integration
WALLET_PRIVATE_KEY_DEPLOYER=0x754fde3f5e60ef2c7649061e06957c29017fe21032a8017132c0078e37f6193a
WALLET_PRIVATE_KEY_SEQUENCER=0xd2ab07f7c10ac88d5f86f1b4c1035d5195e81f27dbe62ad65e59cbf88205629b
WALLET_PRIVATE_KEY_TESTER1=0x23d9aeeaa08ab710a57972eb56fc711d9ab13afdecc92c89586e0150bfa380a6
WALLET_PRIVATE_KEY_TESTER2=0x5b1c2653250e5c580dcb4e51c2944455e144c57ebd6a0645bd359d2e69ca0f0c

# Default settings on optimism-integration
L1_WEB3_URL=http://localhost:9545
L2_WEB3_URL=http://localhost:8545
L1_MESSENGER_ADDRESS=0x6418E5Da52A3d7543d393ADD3Fa98B0795d27736
L2_MESSENGER_ADDRESS=0x4200000000000000000000000000000000000007
```

### デプロイ

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

# 遊び方

まず MetaMask をインストールして、Optimism Layer 2 に接続してください。

- [MetaMask](https://metamask.io/)

- Optimism Layer 2 への接続（カスタム RPC サーバー）
  - Network Name: Optimism L2
  - New RPC URL: http://localhost:8545
  - Chain ID: 420
  - Currency Symbol (optional): ETH
  
フロントエンドは `http://localhost:3000` で起動されます。

アクセスすると、MetaMask のアプリ接続画面が表示されるので、使用するアカウントを選択して接続してください。

「Join match」をクリックすると、MetaMask がトランザクション発行の確認ウインドウを開きます。

「Confirm」をクリックしてください。「Confirm」をしない限りゲームは進行しません。

「Confirm」すると画面は切り替わりますが、ほどなくしてトランザクションが承認されます。

対戦相手が現れるまで待ちの状態になります。対戦相手が決まったらじゃんけんができます。

ゲーム開始後 5 分以内にグー・チョキ・パーを決め、トランザクションを通さなければ負けになります。

勝利すると、連勝した回数に応じた JunkCoin がもらえます。（1 回なら 1 JKC、2連勝なら 2 JKC）

獲得した JunkCoin は Withdraw ボタンで自分のアカウントに引き出しが出来ます。

引出し先は Layer 1 のウォレットです。

- Layer 1 の接続情報
  - Network Name: Optimism L1
  - New RPC URL: http://localhost:9545
  - Chain ID: 31337
  - Currency Symbol (optional): ETH
  
- ERC20 トークンのアドレス: デプロイ時に表示される JunkCoinERC20 のアドレス

# 開発環境

- [Optimistic Ethereum](https://optimism.io/)
- [Hardhat](https://hardhat.org/)
- [hardhat-react](https://github.com/symfoni/symfoni-monorepo/tree/master/packages/hardhat-react)
- [ethers](https://docs.ethers.io/v5/)
- [web3modal](https://github.com/Web3Modal/web3modal)
- [React](https://ja.reactjs.org/)
