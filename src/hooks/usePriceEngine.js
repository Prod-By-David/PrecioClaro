import { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { setSyncState } from "@/lib/syncStatus";

const INTERVAL_MS = 60000;
const FIRST_RUN_MS = 5000;

export default function usePriceEngine() {
  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!alive) return;
      setSyncState({ running: true });
      try {
        const response = await base44.functions.invoke("syncPrices", {});
        const data = response.data || {};
        if (!alive) return;
        setSyncState({
          running: false,
          error: Boolean(data.error),
          updated: Number(data.updated) || 0,
          at: data.checkedAt || new Date().toISOString(),
        });
      } catch {
        if (alive) setSyncState({ running: false, error: true });
      }
    };

    const first = setTimeout(run, FIRST_RUN_MS);
    const interval = setInterval(run, INTERVAL_MS);

    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);
}