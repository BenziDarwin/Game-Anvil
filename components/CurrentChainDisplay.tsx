"use client";

import { useChain } from "@/context/ChainContext";

export default function CurrentChainDisplay() {
  const { state } = useChain();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Current Chain</h2>
      {state.currentChain ? (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${state.currentChain.color}`} />
          <span>{state.currentChain.name}</span>
        </div>
      ) : (
        <span>No chain selected</span>
      )}
    </div>
  );
}
