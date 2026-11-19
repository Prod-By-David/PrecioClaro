import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { fetchCatalog } from "@/lib/catalog";

export default function useLiveCatalog() {
  const [state, setState] = useState({ products: [], offers: [], stores: [], loading: true });

  useEffect(() => {
    let active = true;

    fetchCatalog()
      .then((data) => {
        if (active) setState({ ...data, loading: false });
      })
      .catch(() => {
        if (active) setState((prev) => ({ ...prev, loading: false }));
      });

    const merge = (key) => (event) => {
      setState((prev) => {
        const list = prev[key];
        if (event.type === "delete") {
          return { ...prev, [key]: list.filter((record) => record.id !== event.id) };
        }
        const incoming = event.data;
        if (!incoming?.id) return prev;
        const exists = list.some((record) => record.id === incoming.id);
        const next = exists
          ? list.map((record) => (record.id === incoming.id ? { ...record, ...incoming } : record))
          : [incoming, ...list];
        return { ...prev, [key]: next };
      });
    };

    const unsubs = [
      base44.entities.Product.subscribe(merge("products")),
      base44.entities.Offer.subscribe(merge("offers")),
      base44.entities.Store.subscribe(merge("stores")),
    ];

    return () => {
      active = false;
      unsubs.forEach((unsubscribe) => typeof unsubscribe === "function" && unsubscribe());
    };
  }, []);

  return state;
}