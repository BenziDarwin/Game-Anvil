"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { DraftNFT, Collection } from "@/types/drafts";
import NFTCreationForm from "@/components/NFTForms/nftCreationForm";

interface DraftsListProps {
  drafts: DraftNFT[];
  collections: Collection[];
  loading: boolean;
  onSubmitDraft: (draft: DraftNFT) => void;
  onDeleteDraft: (id: string) => void;
  onUpdateDraft: (
    id: string,
    updates: Partial<DraftNFT>,
    files?: { imageFile?: File; gameFile?: File },
  ) => Promise<void>;
  getFiles: (id: string) => { imageFile?: File; gameFile?: File };
}

const getStatusIcon = (status: DraftNFT["status"]) => {
  switch (status) {
    case "draft":
      return <Clock className="w-4 h-4" />;
    case "uploading":
      return <Loader2 className="w-4 h-4 animate-spin" />;
    case "completed":
      return <CheckCircle2 className="w-4 h-4" />;
    case "failed":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: DraftNFT["status"]) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "uploading":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function DraftsList({
  drafts,
  collections,
  loading,
  onSubmitDraft,
  onDeleteDraft,
  onUpdateDraft,
  getFiles,
}: DraftsListProps) {
  const [editingDraft, setEditingDraft] = useState<DraftNFT | null>(null);

  if (editingDraft) {
    const files = getFiles(editingDraft.id!);
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setEditingDraft(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Drafts
        </Button>
        <NFTCreationForm
          collections={collections}
          onSaveDraft={async () => ""}
          initialData={editingDraft}
          initialFiles={files}
          isEditing={true}
          onUpdateDraft={async (id, updates, newFiles) => {
            await onUpdateDraft(id, updates, newFiles);
            setEditingDraft(null);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading drafts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No drafts yet</h3>
            <p className="text-gray-500">
              Create your first NFT draft to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => (
        <Card key={draft.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  {draft.name || "Untitled NFT"}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {draft.description || "No description"}
                </p>
              </div>
              <Badge
                className={`${getStatusColor(draft.status)} flex items-center gap-1`}
              >
                {getStatusIcon(draft.status)}
                {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {draft.status === "uploading" && draft.progress && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{draft.progress.currentStep}</span>
                  <span>
                    {draft.progress.step}/{draft.progress.totalSteps}
                  </span>
                </div>
                {/* Custom Progress Bar for Drafts List */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(Math.max(draft.progress.percentage, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Type: {draft.nftType}</span>
              <span>
                {draft.updatedAt
                  ? `Updated ${formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}`
                  : `Created ${formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}`}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingDraft(draft)}
                disabled={draft.status === "uploading"}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteDraft(draft.id!)}
                disabled={draft.status === "uploading"}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onSubmitDraft(draft)}
                disabled={
                  draft.status === "uploading" || draft.status === "completed"
                }
                className="ml-auto"
              >
                {draft.status === "uploading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
