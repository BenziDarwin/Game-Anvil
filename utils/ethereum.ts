import { ethers } from 'ethers';

export async function getEthereumContract(
  contractAddress: string,
  contractABI: ethers.InterfaceAbi
) {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  }
  throw new Error('Ethereum provider not found');
}


// Deploy the contract to Ethereum
export const deployContract = async (
  privateKey: string, // Private key to sign the transaction
  contractABI: ethers.InterfaceAbi, // ABI of the contract
  contractBytecode: string // Bytecode of the contract
) => {
  // Create provider and signer using the private key
  const provider = new ethers.JsonRpcProvider(); // You can customize with RPC URL if needed
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a ContractFactory to deploy the contract
  const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

  try {
    // Deploy the contract
    const contract = await factory.deploy(); // Deploying without constructor arguments, pass them if needed

    console.log('Contract deployed at address:', contract.getAddress());

    // Wait for the transaction to be mined
    await contract.deploymentTransaction()?.wait();
    console.log('Deployment confirmed!');
    return contract; // Return the contract instance
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
};


export const getCurrentChain = async (): Promise<number | null> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Get the current chain ID in hex format
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainIdHex, 16); // Convert hex to decimal
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return null;
    }
  }
  throw new Error('Ethereum provider not found');
};