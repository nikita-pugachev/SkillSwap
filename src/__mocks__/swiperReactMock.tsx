import React, { useEffect, useRef } from 'react';

type SwiperInstance = {
  slideTo: (index: number) => void;
};

type SwiperMockProps = {
  children?: React.ReactNode;
  className?: string;
  onSwiper?: (swiper: SwiperInstance) => void;
};

export const Swiper = ({ children, className, onSwiper }: SwiperMockProps) => {
  const swiperRef = useRef<SwiperInstance>({
    slideTo: () => undefined,
  });

  useEffect(() => {
    onSwiper?.(swiperRef.current);
  }, [onSwiper]);

  return (
    <div className={className} data-testid="swiper">
      {children}
    </div>
  );
};

export const SwiperSlide = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="swiper-slide">{children}</div>
);
