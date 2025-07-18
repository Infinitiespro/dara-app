# Changelog

All notable changes to **Dara** will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
- Upcoming features and fixes will appear here.

---

## [0.3.4] – 2024-06-20
### Fixed
- Bug with missing relevant messages
- Error handling for failed bundle data fetch

## [0.3.3] – 2024-06-13
### Added
- Cookie.fun integration
- Bundle checker for Pumpfun tokens
### Fixed
- UI bug fixes
- Security: Prevent updates to arbitrary user fields

## [0.3.2] – 2024-06-06
### Improved
- Handle missing stats in NFT collectionStats tool for new collections
- Allow users to toggle Trial/EPA banners

## [0.3.1] – 2024-05-30
### Fixed
- Client-side error when an unknown tool is invoked

## [0.3.0] – 2024-05-25
### Added
- Saved prompts improvements
- Platform subscription implementation
- Sharable referral codes
- Trial feature for token holders

## [0.2.3] – 2024-05-18
### Improved
- Platform performance and stability
- Automation status UI
- Conversation read receipts
- Prompt management

## [0.2.2] – 2024-05-12
### Improved
- Action graceful failure logic

## [0.2.1] – 2024-05-08
### Fixed
- Navigation issue
### Added
- Degen mode for skipping confirmations
- Dynamic action scheduling
- UI fixes

## [0.2.0] – 2024-05-01
### Added
- Telegram notification connection & reliability
- Action management: edit & pause automated actions
- Privy embedded wallet integration
- Backend optimizations (model token savings, automations)
- Improved UX and stylings
- Tool orchestration layer, improved agent selection and efficiency
- Various tool fixes (token holders reliability + styling)
- Swap & misc. txn improved land rates
- Confirmation prompt UI buttons
- Overall performance and reliability improvements

## [0.1.14] – 2024-04-25
### Improved
- Removed images from Jina scraping results to reduce context bloat
- Improved Telegram setup check for actions
- Ensure Telegram botId is passed back for setup guidance

## [0.1.13] – 2024-04-18
### Added
- Telegram notification tool
- Discord Privy config, EAP role linking

## [0.1.12] – 2024-04-12
### Improved
- Utilize PPQ for AI model endpoint

## [0.1.11] – 2024-04-08
### Added
- Price charts (initial implementation)
- Automated actions (recurring agent actions)

## [0.1.10] – 2024-04-01
### Improved
- Message token tracking (model usage)
- Solana-agent-kit fixes for decimal handling

## [0.1.9] – 2024-03-28
### Fixed
- Use correct messages when trimming message context for gpt4o

## [0.1.8] – 2024-03-22
### Improved
- Conversation API route usage
- Limit messages in context for AI model usage
- Add confirmation tool for messages requiring extra confirmation

## [0.1.7] – 2024-03-15
### Added
- Top 10 token holder analysis
- Enhanced token swap functionality and suggestions
- Updated layout and component styles for responsiveness

## [0.1.6] – 2024-03-10
### Improved
- Token filtering with advanced metrics
- Floating wallet UI
- Optimize `getTokenPrice` tool
- Routing UX (new conversation)

## [0.1.5] – 2024-03-05
### Fixed
- Placeholder image for tokens
- Routing issue after deleting conversation
### Added
- Integrated [Magic Eden](https://magiceden.io/) APIs

---

> For a full development history, see the commit log on [GitHub](https://github.com/DaraProjects/dara-app/commits/main).
