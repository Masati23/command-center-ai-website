"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";

export default function ProposalActions({ proposalId }: { proposalId: string }) {
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);

  async function acceptProposal() {
    setAccepting(true);
    try {
      const res = await fetch(`/api/proposal/${proposalId}/accept`, { method: "POST" });
      if (res.ok) setAccepted(true);
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button href={`/api/proposal/${proposalId}/pdf`} variant="secondary" className="flex-1">
        Download PDF
      </Button>
      <Button
        variant="secondary"
        className="flex-1"
        onClick={acceptProposal}
      >
        {accepted ? "Proposal Accepted ✓" : accepting ? "Accepting…" : "Accept Proposal"}
      </Button>
    </div>
  );
}
