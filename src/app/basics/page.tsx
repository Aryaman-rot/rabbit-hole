import { RequireAuth } from "@/components/require-auth";
import { BasicsPanel } from "./basics-panel";

export default function BasicsPage() {
  return (
    <RequireAuth>
      <BasicsPanel />
    </RequireAuth>
  );
}
