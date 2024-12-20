'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Chain {
  id: number;
  name: string;
  color: string;
}

export const ethereumChains: Chain[] = [
  { id: 1, name: 'Ethereum Mainnet', color: 'text-blue-500' },
  { id: 5, name: 'Goerli Testnet', color: 'text-green-500' },
  { id: 137, name: 'Polygon Mainnet', color: 'text-purple-500' },
  { id: 80001, name: 'Mumbai Testnet', color: 'text-pink-500' },
  {id: 1337, name: 'Local RPC Provider', color: 'text-red-500'}
];

interface ChainState {
  currentChain: Chain | null;
}

type ChainAction = { type: 'SET_CHAIN'; payload: number };

const ChainContext = createContext<
  { state: ChainState; dispatch: React.Dispatch<ChainAction> } | undefined
>(undefined);

const chainReducer = (state: ChainState, action: ChainAction): ChainState => {
  switch (action.type) {
    case 'SET_CHAIN':
      const newChain = ethereumChains.find(chain => chain.id === action.payload) || null;
      return { ...state, currentChain: newChain };
    default:
      return state;
  }
};

export const ChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chainReducer, { currentChain: null });

  return (
    <ChainContext.Provider value={{ state, dispatch }}>
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = () => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
};
