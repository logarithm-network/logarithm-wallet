# Logarithm Token Wallet
A simple Ethereum Wallet based on Logarithm ERC20 Token. Send a Receive Ethereum (ETH) and Logarithm Token (LGR) with ease and security. Ethereum wallets are decrypted and raw transactions are signed locally. Raw Transactions are sent directly to EtherScan.io. Wallet Private Keys are kept on your local machine, everytime you want to use this wallet you must re-use the Keystore JSON or Private Key for your wallet.

<img src="https://image.ibb.co/ncbbWT/logarithm_wallet_1.png">

** This Wallet is very new! Treat it as BETA! **

## Logarithm Token Wallet Features
- Use Keystore JSON wallet
- Use Private Key wallet
- Send and Receive Ethereum (ETH)
- Send and Receive LGR tokens.
- Set custom Gas Price for transactions
- Copy address to clipboard when clicked
- Transaction ID with etherscan URL once transaction is submitted
- Raw Transactions send to EtherScan

<h3>Wallet Security</h3>
None of your wallet information is sent to any server. This wallet uses [ether-js](https://docs.ethers.io/ethers.js/index.html) javascript library to decrypt wallets locally. Each time you open the wallet, you will need to reinput the Keystore JSON file with password or use the wallet's Private Key. To keep your wallet secure, I highly recommend using the Keystore JSON at all times. To remove confusion, this wallet will not allow you to create a new wallet. If you don't have a Ethereum or Storj wallet yet, make one with a secure password at [myetherwallet.com](https://www.myetherwallet.com/). This wallet will not save or move your wallets. Be sure to back up the Keystore JSON file!

<h3>Transactions</h3>
This Logarithm Token Wallet will allow you to set a custom Gas Price if you need to change the price. By default it is set to *21* gwei. Minimum is 5 gwei. The gas limit on a normal Ether transaction is *12000*. The gas limit on sending Storj Tokens is *65000*.


- [Logarithm Token Contract](https://etherscan.io/token/0x2eb86e8fc520e0f6bb5d9af08f924fe70558ab89)
- [Logarithm Token Website Ethereum Transaction](https://getlogarithm.com)
- [Logarithm Network](https://logarithm.network)
