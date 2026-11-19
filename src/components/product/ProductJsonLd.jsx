import { useEffect } from "react";

export default function ProductJsonLd({ product, offers }) {
  useEffect(() => {
    if (!product) return;
    const prices = offers
      .map((offer) => Number(offer.total_price))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (!prices.length) return;

    const data = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.slug,
      description: product.description,
      category: product.category,
      brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
      image: product.image_url ? [product.image_url] : undefined,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        offers: offers.map((offer) => ({
          "@type": "Offer",
          price: Number(offer.price),
          priceCurrency: "EUR",
          url: offer.url,
          availability:
            offer.in_stock === false
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          seller: { "@type": "Organization", name: offer.store_name },
        })),
      },
    };

    if (Number(product.rating) > 0) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(product.rating),
        reviewCount: Number(product.reviews_count) || 0,
      };
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data).replace(/</g, "\\u003c");
    document.head.appendChild(script);
    return () => script.remove();
  }, [product, offers]);

  return null;
}