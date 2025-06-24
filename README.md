# 🎮 GameAnvil Setup Guide

GameAnvil is a Web3-enabled game asset management platform that combines decentralized storage, blockchain integration, and modern web technologies. This comprehensive guide will help you set up your development environment from scratch! 🚀

## 📋 Prerequisites

Before you begin, ensure you have the following tools installed:

- **[Node.js (LTS version)](https://nodejs.org/)** 📦 - JavaScript runtime for the application
- **[Git](https://git-scm.com/)** 🔧 - Version control system
- **[Firebase CLI](https://firebase.google.com/docs/cli)** 🔥 - Firebase development tools
- **[Ganache GUI Application](https://trufflesuite.com/ganache/)** ⛓️ - Local blockchain simulator with visual interface
- **[MetaMask](https://metamask.io/)** 🦊 or similar Web3 wallet - For blockchain interactions

## 🚀 Step 1: Project Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/BenziDarwin/Game-Anvil.git
cd Game-Anvil
npm install
```

## ⚙️ Step 2: Environment Configuration

Create your environment configuration file:

```bash
cp .env.example .env
```

Open the `.env` file and configure the following variables:

```env
# 🌥️ Cloudflare R2 Storage Configuration
NEXT_PUBLIC_R2_CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
NEXT_PUBLIC_R2_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_R2_SECRET_ACCESS_KEY=your-secret-access-key
NEXT_PUBLIC_R2_BUCKET_NAME=your-r2-bucket-name

# ⛓️ Blockchain Configuration
NEXT_PUBLIC_CHAIN_RPC=http://127.0.0.1:7545
NEXT_PUBLIC_PRIVATE_KEY=your-wallet-private-key

# 🌐 Storacha IPFS Configuration
NEXT_PUBLIC_IPFS_SPACE=did:key:z6Mk...
```

## ⛓️ Step 3: Blockchain Setup with Ganache GUI

### Download and Install Ganache GUI

1. Go to [Ganache Downloads](https://trufflesuite.com/ganache/) 📥
2. Download the GUI application for your operating system
3. Install and launch the application

### Configure Ganache Workspace

1. **Create New Workspace** 🆕
   - Click "New Workspace"
   - Name it "GameAnvil Development"

2. **Server Configuration** 🔧
   - **Hostname:** 127.0.0.1
   - **Port Number:** 7545 (default)
   - **Network ID:** 5777 (default)
   - **Automine:** Enabled ✅

3. **Accounts & Keys** 💰
   - **Account Default Balance:** 100 ETH
   - **Total Accounts to Generate:** 10
   - **Autogenerate HD Mnemonic:** Enabled ✅

4. **Save and Start** 💾
   - Click "Save Workspace"
   - Your blockchain will start automatically!

### 🔑 Copy Your Private Key

1. In the Ganache GUI, go to the **Accounts** tab
2. Click the **key icon** 🗝️ next to the first account
3. Copy the **Private Key**
4. Add it to your `.env` file:

```env
NEXT_PUBLIC_PRIVATE_KEY=0xYourCopiedPrivateKeyHere
```

## 🦊 Step 4: MetaMask Wallet Configuration

### Install and Setup MetaMask

1. Install [MetaMask](https://metamask.io/) browser extension 🦊
2. Create a new wallet or import an existing one
3. **Add Ganache Network** to MetaMask:

#### Network Details:

- **Network Name:** 🏷️ Ganache Local
- **RPC URL:** 🌐 http://127.0.0.1:7545
- **Chain ID:** 🔗 5777
- **Currency Symbol:** 💎 ETH
- **Block Explorer URL:** (leave empty)

4. **Import Test Account** 📝
   - Click "Import Account"
   - Paste the private key from Ganache
   - You should see 100 ETH in your account! 💰

## 🌐 Step 5: Storacha Setup for Decentralized Storage

1. Navigate to [Storacha Network](https://storacha.network) 🔗
2. Connect your MetaMask wallet 🦊
3. Complete the onboarding process ✅
4. Locate your **DID key** (starts with `did:key:z6Mk...`) 🔑
5. Copy this DID key and update your `.env` file:

```env
NEXT_PUBLIC_IPFS_SPACE=did:key:z6MkYourActualDIDKey
```

> 💡 **Pro Tip:** This DID serves as your decentralized identity and links your uploaded assets to your account!

## ☁️ Step 6: Cloudflare R2 Storage Setup

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com) 🌐
2. Sign in or create a new account 📝
3. Navigate to **R2 Object Storage** ☁️
4. Create a new bucket (e.g., `gameanvil-assets`) 🪣
5. Go to **Manage R2 API Tokens** 🔑
6. Create a new API token with R2 permissions ✅

### 📝 Note Down These Values:

- Account ID 🆔
- Access Key ID 🔑
- Secret Access Key 🔐
- Bucket name 🪣

Update your `.env` file with these values! ⚙️

## 🔥 Step 7: Firebase Emulator Setup

Initialize Firebase emulators in your project:

```bash
firebase init emulators
```

Select the emulators you need (typically Auth and Firestore) ✅, then start them:

```bash
firebase emulators:start
```

The Firebase Emulator Suite UI will be available at [http://localhost:4000](http://localhost:4000) 🌐

## 🎮 Step 8: Launch GameAnvil

Start the development server:

```bash
npm run dev
```

Your GameAnvil application will be running at [http://localhost:3002](http://localhost:3002) 🚀

## ✅ Verification Checklist

Before you start developing, verify that:

- [ ] 🟢 Ganache GUI is running and showing accounts
- [ ] 🦊 MetaMask is connected to your local Ganache network
- [ ] 💰 Your wallet has 100 test ETH from Ganache
- [ ] 🔥 Firebase emulators are running
- [ ] 🌐 Storacha DID is properly configured
- [ ] ☁️ Cloudflare R2 credentials are valid
- [ ] 🎮 GameAnvil loads without errors in your browser

## 🔧 Troubleshooting

### Common Issues 🚨

**🔌 Port conflicts:** If port 3002 is in use, specify a different port:

```bash
PORT=3003 npm run dev
```

**🦊 Wallet connection issues:** Ensure MetaMask is unlocked and connected to the correct network (Ganache Local).

**⚙️ Environment variables not loading:** Restart your development server after modifying the `.env` file.

**⛓️ Ganache connection failed:**

- Check if Ganache GUI is running ✅
- Verify RPC URL matches (http://127.0.0.1:7545) 🔗
- Ensure Chain ID is 1337 🔗

**🔥 Firebase emulator issues:** Make sure no other processes are using ports 4000, 8080, or 9099.
