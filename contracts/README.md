# ReforestWallet Smart Contracts

## Fee Splitter Contract

Le contrat `ReforestFeeSplitter.sol` permet de :
1. Prendre 1% de commission sur chaque swap
2. Envoyer cette commission à ton adresse
3. Exécuter le swap via 1inch avec les 99% restants

### Déploiement

1. **Prérequis** :
   - Node.js + npm/yarn
   - Foundry ou Hardhat
   - Clé privée avec ETH/MATIC pour le gas
   - Clé API pour le déploiement (Etherscan, Polygonscan, etc.)

2. **Variables de configuration** :
   ```
   FEE_RECIPIENT=<TON_ADRESSE_ICI>
   AGGREGATOR_ROUTER=0x1111111254EEB25477B68fb85Ed929f73A960582
   ```

3. **Déploiement avec Foundry** :
   ```bash
   forge create --rpc-url <RPC_URL> \
     --private-key <PRIVATE_KEY> \
     contracts/ReforestFeeSplitter.sol:ReforestFeeSplitter \
     --constructor-args <FEE_RECIPIENT> <AGGREGATOR_ROUTER>
   ```

4. **Vérification** :
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> \
     contracts/ReforestFeeSplitter.sol:ReforestFeeSplitter \
     --chain-id <CHAIN_ID> \
     --constructor-args $(cast abi-encode "constructor(address,address)" <FEE_RECIPIENT> <AGGREGATOR_ROUTER>)
   ```

### Adresses des routers 1inch par chain

| Chain | Router Address |
|-------|----------------|
| Ethereum | 0x1111111254EEB25477B68fb85Ed929f73A960582 |
| Polygon | 0x1111111254EEB25477B68fb85Ed929f73A960582 |
| Arbitrum | 0x1111111254EEB25477B68fb85Ed929f73A960582 |
| Base | 0x1111111254EEB25477B68fb85Ed929f73A960582 |
| BSC | 0x1111111254EEB25477B68fb85Ed929f73A960582 |

### Après déploiement

Une fois le contrat déployé, donne-moi l'adresse du contrat pour chaque chain, et je l'intégrerai dans l'app pour que les swaps passent par ton fee-splitter.
