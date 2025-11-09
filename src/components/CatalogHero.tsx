interface CatalogHeroProps {
  image: string;
  alt: string;
  mobileImage?: string;
}

export default function CatalogHero({ image, alt, mobileImage }: CatalogHeroProps) {
  return (
    <div className="w-full">
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
        <picture>
          {mobileImage && (
            <source media="(max-width: 768px)" srcSet={mobileImage} />
          )}
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </picture>
      </div>
    </div>
  );
}

