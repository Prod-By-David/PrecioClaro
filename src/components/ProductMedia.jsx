import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function ProductMedia({ src, alt, className, imgClassName }) {
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]",
          imgClassName
        )}
      />
    </div>
  );
}