import { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType } from 'embla-carousel';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { heroesData } from '@/constants/heroes-data';

const Hero = () => {
  // Embla API can be undefined initially
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | undefined>(
    undefined
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  return (
    <div className='custom-container w-full flex flex-col items-center mt-4 select-none'>
      <Carousel
        setApi={setCarouselApi}
        className='w-full rounded-3xl overflow-hidden shadow-md'
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3500,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {heroesData.map((src, index) => (
            <CarouselItem key={index}>
              <img
                src={src.srcImage}
                alt={`banner-${index}`}
                className='w-full object-cover rounded-3xl '
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* DOT INDICATORS */}
      <div className='flex gap-2 mt-4'>
        {heroesData.map((_, i) => (
          <button
            key={i}
            onClick={() => carouselApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              current === i ? 'bg-primary-300 scale-110' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
