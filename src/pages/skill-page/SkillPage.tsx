import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillCard } from '@/components/ui/SkillCard/SkillCard';
import { UserCard } from '@/components/user-card';
import { Modal } from '@/components/ui/Modal/Modal';
import styles from './SkillPage.module.scss';
import type { UserFromDb, City, SkillCategory, SkillCategorySlug } from '@/utils/types';
import scrollNavigate from '@/assets/icons/scroll-navigate.svg';
import { IconButton } from '@/components/ui/IconButton';

export const SkillPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getSkillData = (id: string) => ({
    id: id,
    title: 'Игра на барабанах',
    category: 'Творчество и искусство',
    subcategory: 'Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры',
    images: [
      'https://i.pinimg.com/736x/83/b3/01/83b30199926253130693af35f6f55ba8.jpg',
      'https://i.pinimg.com/736x/ea/c3/e8/eac3e85e8c4ce2abfaf009fb12b2fbf8.jpg',
      'https://i.pinimg.com/1200x/b7/da/b2/b7dab2be7395412771b7e768f780b437.jpg',
      'https://i.pinimg.com/736x/f2/da/db/f2dadbd54d3792cd8d82497385600997.jpg',
      'https://i.pinimg.com/736x/03/4b/9f/034b9ff09e91c5655f976206da0dcee5.jpg',
    ],
    isLiked: false,
    user: {
      id: 1,
      name: 'Иван',
      avatar: '/src/assets/user-avatars/ivan.png',
      city: 'Санкт-Петербург',
      birthday: '1992-03-29',
      about: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое.',
      skillsTeach: [{ name: 'Игра на барабанах', category: 'art' }],
      skillsLearn: [
        { name: 'Тайм-менеджмент', category: 'business' },
        { name: 'Йога и медитация', category: 'health' },
      ],
    },
  });

  const [similarUsers, setSimilarUsers] = useState<UserFromDb[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState<boolean>(false);

  const skillData = getSkillData(id || '1');

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setShowLeftButton(scrollLeft > 0);

      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth * 0.8,
        behavior: 'smooth',
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth * 0.8,
        behavior: 'smooth',
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/db/cities.json');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки городов');
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/db/skills.json');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки навыков');
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/db/users.json');
        if (!response.ok) throw new Error('Ошибка загрузки пользователей');
        const data = await response.json();
        const users: UserFromDb[] = data.users;

        const otherUsers = users.filter((user) => user.id !== 1);
        //setSimilarUsers(otherUsers.slice(0, 7));
        setSimilarUsers(otherUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      checkScrollButtons();
    };

    const timeoutId = setTimeout(checkScroll, 100);

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
    }

    window.addEventListener('resize', checkScroll);

    return () => {
      clearTimeout(timeoutId);
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [similarUsers]);

  const getCityName = (cityId: number): string => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : 'Город не указан';
  };

  const getSkillName = (skillId: number): string => {
    for (const category of skills) {
      const subcategory = category.subcategories.find((sub) => sub.id === skillId);
      if (subcategory) {
        return subcategory.title;
      }
    }
    return `Навык ${skillId}`;
  };

  const getSkillCategory = (skillId: number): SkillCategorySlug => {
    for (const category of skills) {
      const subcategory = category.subcategories.find((sub) => sub.id === skillId);
      if (subcategory) {
        return category.slug as SkillCategorySlug;
      }
    }
    return 'other';
  };

  const getSkillCategoryBySubcategoryId = (subcategoryId: number): SkillCategorySlug => {
    const category = skills.find((cat) =>
      cat.subcategories.some((sub) => sub.id === subcategoryId)
    );
    return category ? (category.slug as SkillCategorySlug) : 'other';
  };

  const handleLikeToggle = () => {
    //TODO подключить из SkillsSlice
    console.log('Toggle like', skillData.id);
  };

  const handleShare = () => {
    //TODO подключить из SkillsSlice
    console.log('Share skill', skillData.id);
  };

  const handleMoreClick = () => {
    //TODO подключить из SkillsSlice
    console.log('More actions', skillData.id);
  };

  const handleExchangeClick = () => {
    console.log('Exchange offer', skillData.id);
    setIsExchangeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsExchangeModalOpen(false);
  };

  const handleUserCardClick = (userId: string | number) => {
    //TODO переход работает, но в SkillCard Открываются моковые данные
    navigate(`/skill/${userId}`);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Загрузка похожих предложений...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SkillCard
        id={skillData.id}
        title={skillData.title}
        category={skillData.category}
        subcategory={skillData.subcategory}
        description={skillData.description}
        images={skillData.images}
        isLiked={skillData.isLiked}
        user={skillData.user}
        onLikeToggle={handleLikeToggle}
        onShare={handleShare}
        onMoreClick={handleMoreClick}
        onExchangeClick={handleExchangeClick}
      />

      <Modal
        isOpen={isExchangeModalOpen}
        onClose={handleCloseModal}
        title="Вы предложили обмен"
        description="Теперь дождитесь подтверждения. Вам придет уведомление"
        buttonText="Готово"
        onButtonClick={handleCloseModal}
        showBell={true}
      />

      {similarUsers.length > 0 && (
        <section className={styles.similarSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.similarTitle}>Похожие предложения</h2>
          </div>
          <div className={styles.skillsWrapper}>
            <div className={styles.skillsScroll} ref={scrollRef}>
              <div className={styles.skillsGrid}>
                {similarUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    avatar={user.userAvatar}
                    city={getCityName(user.cityId)}
                    birthday={user.birthday}
                    skillsTeach={user.skillsTeach.map((skill) => ({
                      name: skill.customTitle,
                      category: getSkillCategoryBySubcategoryId(skill.subcategoryId),
                    }))}
                    skillsLearn={user.skillsLearn.map((learnId) => ({
                      name: getSkillName(learnId),
                      category: getSkillCategory(learnId),
                    }))}
                    onDetailsClick={handleUserCardClick}
                  />
                ))}
              </div>
            </div>
            {(showLeftButton || showRightButton) && (
              <div className={styles.scrollButtons}>
                {showLeftButton && (
                  <IconButton
                    iconSrc={scrollNavigate}
                    ariaLabel="Прокрутить влево"
                    onClick={scrollLeft}
                    className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                  />
                )}
                {showRightButton && (
                  <IconButton
                    iconSrc={scrollNavigate}
                    ariaLabel="Прокрутить вправо"
                    onClick={scrollRight}
                    className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
export default SkillPage;
