import { useEffect, useState } from "react";
import { getAlerts, removeAlert, saveAlert, subscribeAlerts } from "@/lib/alerts";

export default function useAlerts() {
  const [alerts, setAlerts] = useState(getAlerts);

  useEffect(() => {
    setAlerts(getAlerts());
    return subscribeAlerts(() => setAlerts(getAlerts()));
  }, []);

  return { alerts, add: saveAlert, remove: removeAlert };
}