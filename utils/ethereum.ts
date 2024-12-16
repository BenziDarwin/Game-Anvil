import { ethers } from 'ethers';

export async function getEthereumContract(
  contractAddress: string,
  contractABI: ethers.ContractInterface
) {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  }
  throw new Error('Ethereum provider not found');
}

