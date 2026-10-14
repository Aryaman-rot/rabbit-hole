"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { AgeBlockedNotice, BasicsWizard } from "./basics-panel";

export default function BasicsPage() {
  const [ageBlocked, setAgeBlocked] = useState(false);

  return (
    <RequireAuth allowSignedOut={ageBlocked}>
      {ageBlocked ? (
        <AgeBlockedNotice />
      ) : (
        <BasicsWizard onAgeBlocked={() => setAgeBlocked(true)} />
      )}
    </RequireAuth>
  );
}
