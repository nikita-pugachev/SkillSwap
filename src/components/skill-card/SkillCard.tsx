import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// @ts-expect-error: Swiper styles may not have types
import 'swiper/css';
// @ts-expect-error: Swiper styles may not have types
import 'swiper/css/navigation';
import styles from './SkillCard.module.scss';
import { Button } from '@/components/ui/ButtonUI';
import { IconButton } from '@/components/ui/IconButton';
import { NavigationButton } from '@/components/ui/NavigationButton';
import { UserCard, UserCardProps } from '../user-card';

import heartOutlineSrc from '@/assets/icons/like-outline.svg';
import heartFilledSrc from '@/assets/icons/like-filled.svg';
import shareSrc from '@/assets/icons/share.svg';
import moreSrc from '@/assets/icons/more-square.svg';

export type SkillCardProps = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  images: string[];
  isLiked?: boolean;
  user: UserCardProps;
  onLikeToggle?: () => void;
  onShare?: () => void;
  onMoreClick?: () => void;
  onExchangeClick?: () => void;
};

export const SkillCard: FC<SkillCardProps> = ({
  title,
  category,
  subcategory,
  description,
  images,
  isLiked = false,
  user,
  onLikeToggle,
  onShare,
  onMoreClick,
  onExchangeClick,
}) => {
  const thumbnails = images.slice(1, 4);
  const remainingPhotos = Math.max(0, images.length - 4);

  return (
    <article className={styles.card}>
      <div className={styles.leftColumn}>
        <UserCard {...user} />
      </div>

      <div className={styles.rightContent}>
        <div className={styles.actions}>
          <IconButton
            iconSrc={isLiked ? heartFilledSrc : heartOutlineSrc}
            ariaLabel="Like"
            onClick={onLikeToggle}
          />
          <IconButton iconSrc={shareSrc} ariaLabel="Share" onClick={onShare} />
          <IconButton iconSrc={moreSrc} ariaLabel="More" onClick={onMoreClick} />
        </div>

        <div className={styles.middleColumn}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.category}>
            {category} / {subcategory}
          </div>
          <p className={styles.description}>{description}</p>
          <Button variant="primary" className={styles.exchangeButton} onClick={onExchangeClick}>
            Предложить обмен
          </Button>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: `.${styles.galleryPrev}`,
                  nextEl: `.${styles.galleryNext}`,
                }}
                observer={true}
                observeParents={true}
                className={styles.mainSwiper}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={`${img}-${index}`}>
                    <img src={img} alt={title} className={styles.mainImage} />
                  </SwiperSlide>
                ))}
                {images.length > 1 && (
                  <div className={styles.navContainer}>
                    <NavigationButton direction="left" className={styles.galleryPrev} />
                    <NavigationButton direction="right" className={styles.galleryNext} />
                  </div>
                )}
              </Swiper>
            </div>

            <div className={styles.thumbnails}>
              {thumbnails.map((img, idx) => (
                <div key={`${img}-${idx}`} className={styles.thumbnailWrapper}>
                  <img src={img} alt="Thumbnail" className={styles.thumbnail} />
                  {idx === 2 && remainingPhotos > 0 && (
                    <div className={styles.overlay}>+{remainingPhotos}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
