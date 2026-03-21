import { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './SkillCard.module.scss';
import { Button } from '@/components/ui/ButtonUI';
import { IconButton } from '@/components/ui/IconButton';
import { NavigationButton } from '@/components/ui/NavigationButton';
import { SkillTag } from '@/components/ui/SkillTag';
import { SkillCategorySlug } from '@/utils/types';
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
  user: {
    id: string | number;
    name: string;
    avatar: string;
    city: string;
    birthday: string;
    about?: string;
    skillsTeach: { name: string; category: string }[];
    skillsLearn: { name: string; category: string }[];
  };
  onLikeToggle?: () => void;
  onShare?: () => void;
  onMoreClick?: () => void;
  onExchangeClick?: () => void;
};

const getAgeString = (birthday?: string): string => {
  if (!birthday) return '';

  const ageDifMs = Date.now() - new Date(birthday).getTime();
  if (isNaN(ageDifMs)) return '';

  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${age} лет`;
  if (lastDigit === 1) return `${age} год`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${age} года`;
  return `${age} лет`;
};
export const SkillCard: FC<SkillCardProps> = ({
  title,
  category,
  subcategory,
  description,
  images = [],
  isLiked = false,
  user,
  onLikeToggle,
  onShare,
  onMoreClick,
  onExchangeClick,
}) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  const thumbnails = images.slice(1, 4);
  const remainingPhotos = Math.max(0, images.length - 4);
  const userAgeString = getAgeString(user.birthday);

  return (
    <article className={styles.card}>
      <aside className={styles.leftColumn}>
        <div className={styles.authorHeader}>
          <img src={user.avatar} alt={user.name} className={styles.avatar} />
          <div className={styles.authorInfo}>
            <h3 className={styles.authorName}>{user.name}</h3>
            <p className={styles.authorLocation}>
              {user.city}, {userAgeString}
            </p>
          </div>
        </div>

        {user.about && <p className={styles.authorAbout}>{user.about}</p>}

        <div className={styles.skillsSection}>
          <h4 className={styles.skillsTitle}>Может научить</h4>
          <div className={styles.tagsContainer}>
            {user.skillsTeach?.map((skill, i) => (
              <SkillTag key={i} label={skill.name} category={skill.category as SkillCategorySlug} />
            ))}
          </div>
        </div>

        <div className={styles.skillsSection}>
          <h4 className={styles.skillsTitle}>Хочет научиться</h4>
          <div className={styles.tagsContainer}>
            {user.skillsLearn?.map((skill, i) => (
              <SkillTag key={i} label={skill.name} category={skill.category as SkillCategorySlug} />
            ))}
          </div>
        </div>
      </aside>

      <div className={styles.rightContent}>
        <div className={styles.actions}>
          <IconButton
            iconSrc={isLiked ? heartFilledSrc : heartOutlineSrc}
            ariaLabel={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
            onClick={onLikeToggle}
          />
          <IconButton iconSrc={shareSrc} ariaLabel="Поделиться карточкой" onClick={onShare} />
          <IconButton iconSrc={moreSrc} ariaLabel="Больше действий" onClick={onMoreClick} />
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
            {images.length === 0 ? (
              <div className={styles.mainImagePlaceholder}>Нет фото</div>
            ) : (
              <div className={styles.mainImageWrapper}>
                <Swiper
                  modules={[Navigation]}
                  onSwiper={(swiper) => setMainSwiper(swiper)}
                  navigation={{ prevEl, nextEl }}
                  className={styles.mainSwiper}
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={`${img}-${index}`}>
                      <img
                        src={img}
                        alt={`Слайд ${index + 1}`}
                        className={styles.mainImage}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </SwiperSlide>
                  ))}
                  {images.length > 1 && (
                    <div className={styles.navContainer}>
                      <NavigationButton ref={setPrevEl} direction="left" />
                      <NavigationButton ref={setNextEl} direction="right" />
                    </div>
                  )}
                </Swiper>
              </div>
            )}

            {thumbnails.length > 0 && (
              <div className={styles.thumbnails}>
                {thumbnails.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    className={styles.thumbnailWrapper}
                    onClick={() => {
                      if (mainSwiper) {
                        mainSwiper.slideTo(idx + 1);
                      }
                    }}
                    aria-label={`Посмотреть фото ${idx + 2}`}
                    type="button"
                  >
                    <img
                      src={img}
                      alt={`Миниатюра ${idx + 2}`}
                      className={styles.thumbnail}
                      loading="lazy"
                    />
                    {idx === 2 && remainingPhotos > 0 && (
                      <div className={styles.overlay}>+{remainingPhotos}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
