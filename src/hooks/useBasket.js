import { useEffect, useState } from "react";
import { getBasket, subscribeBasket } from "@/lib/basket";

export default function useBasket() {
  const [items, setItems] = useState(getBasket);

  useEffect(() => {
    setItems(getBasket());
    return subscribeBasket(() => setItems(getBasket()));
  }, []);

  return items;
}