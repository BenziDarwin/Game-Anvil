"use client";

import NftForm from "./NFTForm";

export default function NFTForms({
  collectionDialog,
}: {
  collectionDialog: boolean;
}) {
  return (
    <div className="bg-transparent bg-opacity-90 rounded-xl shadow-2xl bg-transparent">
      <NftForm collectionDialog={collectionDialog} />
    </div>
  );
}
