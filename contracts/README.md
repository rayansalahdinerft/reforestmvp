# ReforestWallet Smart Contracts

## Fee Splitter Contract - 1inch Integration

Le contrat `ReforestFeeSplitter.sol` utilise **1inch Aggregation Router V6** pour :
1. Prendre **1% de commission** sur chaque swap
2. Envoyer cette commission à ton adresse
3. Exécuter le swap via 1inch avec les **99% restants**
4. Supporter **TOUS les tokens** sur **TOUTES les chains** compatibles 1inch

### 1inch Aggregation Router V6

**Adresse unique sur toutes les chains :**
```
0x111111125421cA6dc452d289314280a0f8842A65
```

### Chains supportées

| Chain | Chain ID | Tokens disponibles |
|-------|----------|-------------------|
| Ethereum | 1 | Tous (ETH, USDC, USDT, DAI, WBTC, etc.) |
| Polygon | 137 | Tous (MATIC, USDC, WETH, etc.) |
| Arbitrum One | 42161 | Tous (ETH, ARB, USDC, etc.) |
| Optimism | 10 | Tous (ETH, OP, USDC, etc.) |
| Base | 8453 | Tous (ETH, USDC, etc.) |
| Avalanche C-Chain | 43114 | Tous (AVAX, USDC, etc.) |
| BNB Chain | 56 | Tous (BNB, BUSD, USDT, etc.) |
| Fantom | 250 | Tous (FTM, USDC, etc.) |
| Gnosis | 100 | Tous (xDAI, USDC, etc.) |
| zkSync Era | 324 | Tous (ETH, USDC, etc.) |
| Linea | 59144 | Tous (ETH, USDC, etc.) |
| Scroll | 534352 | Tous (ETH, USDC, etc.) |
| Blast | 81457 | Tous (ETH, USDB, etc.) |

### API 1inch pour les quotes et swaps

```bash
# Get quote (prix sans swap data)
GET https://api.1inch.dev/swap/v6.0/{chainId}/quote?src={srcToken}&dst={dstToken}&amount={amount}

# Get swap data (calldata pour le contrat)
GET https://api.1inch.dev/swap/v6.0/{chainId}/swap?src={srcToken}&dst={dstToken}&amount={amount}&from={feeSplitterAddress}&slippage=1
```

### Déploiement

1. **Prérequis** :
   - Foundry ou Hardhat
   - Clé privée avec gas pour le déploiement
   - ETH/MATIC/BNB/etc. selon la chain

2. **Déploiement avec Foundry** :
   ```bash
   # Ethereum
   forge create --rpc-url https://eth.llamarpc.com \
     --private-key <PRIVATE_KEY> \
     contracts/ReforestFeeSplitter.sol:ReforestFeeSplitter \
     --constructor-args 0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669
   
   # Polygon
   forge create --rpc-url https://polygon.llamarpc.com \
     --private-key <PRIVATE_KEY> \
     contracts/ReforestFeeSplitter.sol:ReforestFeeSplitter \
     --constructor-args 0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669
   ```

3. **Vérification** :
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> \
     contracts/ReforestFeeSplitter.sol:ReforestFeeSplitter \
     --chain-id <CHAIN_ID> \
     --constructor-args $(cast abi-encode "constructor(address)" 0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669)
   ```

### Flow du swap

```
Utilisateur                    ReforestFeeSplitter                    1inch Router
    |                                |                                     |
    |-- approve(feeSplitter, amt) -->|                                     |
    |                                |                                     |
    |-- swap(srcToken, dstToken,     |                                     |
    |       amt, minOut, swapData) ->|                                     |
    |                                |                                     |
    |                                |-- 1% fee --> feeRecipient           |
    |                                |                                     |
    |                                |-- 99% + swapData ------------------>|
    |                                |                                     |
    |                                |<-------------- dstTokens -----------|
    |                                |                                     |
    |<--------- dstTokens -----------|                                     |
```

### Après déploiement

Donne-moi l'adresse du contrat déployé sur chaque chain pour l'intégrer dans l'app !
