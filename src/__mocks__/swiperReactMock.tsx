import React, { useEffect } from 'react';

type SwiperProps = {
  children?: React.ReactNode;
  onSwiper?: (swiper: { slideTo: (index: number) => void }) => void;
};

export const Swiper = ({ children, onSwiper }: SwiperProps) => {
  useEffect(() => {
    onSwiper?.({
      slideTo: () => undefined,
    });
  }, [onSwiper]);

  return <div data-testid="swiper">{children}</div>;
};

export const SwiperSlide = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="swiper-slide">{children}</div>
);
