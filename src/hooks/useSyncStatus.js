import { useEffect, useState } from "react";
import { getSyncState, subscribeSync } from "@/lib/syncStatus";

export default function useSyncStatus() {
  const [state, setState] = useState(getSyncState);

  useEffect(() => {
    setState(getSyncState());
    return subscribeSync(setState);
  }, []);

  return state;
}