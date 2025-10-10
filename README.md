# Checkpoint v2 Documentation

This documentation provides comprehensive information about Checkpoint v2, a
decentralized platform for tokenizing and trading off-chain points programs.

## Overview

Checkpoint v2 enables the conversion of off-chain loyalty points, rewards, and
other point-based systems into tradeable on-chain assets. The system uses a
sophisticated architecture with oracle verification, collateral-based trading,
and cross-chain settlement capabilities.

## Key Features

- **Points Tokenization**: Convert off-chain points into ERC20 tokens and
  soulbound NFTs
- **Oracle Verification**: Secure signature-based verification of off-chain
  point claims
- **Market Trading**: Create and fill orders for points before TGE (Token
  Generation Event)
- **Cross-Chain Settlement**: LayerZero-powered settlement across multiple
  chains
- **Vesting Support**: Handle complex vesting schedules for token distributions

## Architecture

The system consists of five core smart contracts:

1. **Registry Contract**: Manages points programs and configurations
2. **Deposit Contract**: Handles points tokenization and NFT minting
3. **Oracle Contract**: Provides cryptographic verification of off-chain claims
4. **Market Contract**: Enables trading of tokenized points
5. **Settlement Contract**: Manages token distribution after TGE

## Documentation Structure

### Getting Started

- [Overview](index.mdx) - Introduction to Checkpoint v2

### Architecture

- [Architecture Overview](architecture/overview.mdx) - High-level system
  architecture
- [Oracle System](architecture/oracle-system.mdx) - Cryptographic signature
  verification
- [Points Tokenization](architecture/points-tokenization.mdx) - How points
  become tradeable assets
- [Market Trading](architecture/market-trading.mdx) - Collateral-based trading
  system
- [Cross-Chain Settlement](architecture/cross-chain-settlement.mdx) -
  Multi-chain token distribution

### Technical Reference

- [Smart Contracts](technical-reference/smart-contracts.mdx) - Detailed contract
  documentation

## Smart Contracts

### Core Contracts

- **Registry.sol**: Points program management
- **Deposit.sol**: Points tokenization
- **Oracle.sol**: Signature verification
- **Market.sol**: Points trading
- **Settlement.sol**: Token distribution

### Token Contracts

- **DepositReceipt.sol**: Soulbound NFT for point tracking
- **EscrowToken.sol**: ERC20 token for trading

## Key Concepts

### Oracle Attestation

The oracle system uses ECDSA signatures to verify off-chain point claims:

1. Off-chain service signs point claims with private key
2. Smart contracts verify signatures using ECDSA recovery
3. Nonce management prevents replay attacks
4. Time-based validation prevents stale claims

### Deposit Contract Mechanics

When points are deposited:

1. Oracle verifies the off-chain point claim
2. Soulbound NFT is minted to track user's points
3. ERC20 escrow tokens are created for trading
4. Points are held when used in market orders

### Market Trading

The market enables trading before TGE:

1. Users create offers with collateral
2. Buyers fill offers with USDC
3. Escrow tokens are minted to buyers
4. Settlement occurs after TGE

### Cross-Chain Settlement

LayerZero enables multi-chain distribution:

1. Collateral tokens are sent to remote chains
2. Settlement messages contain distribution data
3. Tokens are distributed proportionally to escrow holders
4. Both same-chain and cross-chain settlements are supported

## Security Features

- **Upgradeability**: UUPS proxy pattern for secure upgrades
- **Access Control**: Role-based permissions for different operations
- **Reentrancy Protection**: All external functions are protected
- **Signature Verification**: ECDSA for all off-chain claims
- **Nonce Management**: Prevents replay attacks

## Integration

### LayerZero Integration

- Cross-chain token transfers for settlement
- Multi-chain escrow token support
- Cross-chain settlement verification

### Oracle Integration

- Off-chain point verification
- Signature-based claim validation
- Vesting schedule management

### Market Integration

- Collateral-based trading system
- USDC payment processing
- Order management and settlement

## Development

### Prerequisites

- Foundry for smart contract development
- Node.js for documentation
- Git for version control

### Building

```bash
forge build
```

### Testing

```bash
forge test
```

### Documentation

The documentation is built with Mintlify and can be viewed locally or deployed
to a hosting service.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit
pull requests for any improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

## Support

For support and community discussions:

- [Discord](https://discord.gg/fJ5dJbxxTT)
- [GitHub Issues](https://github.com/0xPortalLabs/checkpoint-v2-contracts/issues)

## Links

- [Portal Dashboard](https://0xportal.io)
- [GitHub Repository](https://github.com/0xPortalLabs/checkpoint-v2-contracts)
- [Documentation](https://docs.checkpoint.exchange)
