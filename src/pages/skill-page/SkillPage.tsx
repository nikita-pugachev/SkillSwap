import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillCard } from '@/components/ui/SkillCard/SkillCard';
import { UserCard } from '@/components/ui/UserCard';
import { Modal } from '@/components/ui/Modal/Modal';
import styles from './SkillPage.module.scss';
import type { UserDb, City, SkillCategory, SkillCategorySlug } from '@/utils/types';
import ScrollNavigateIcon from '@/assets/icons/scroll-navigate.svg?react';
import { IconButton } from '@/components/ui/IconButton';
import { setSkills } from '@/services/slices/skillsSlice';
import { selectIsAuthenticated, selectUser } from '@/services/selectors';
import { createRequest } from '@/services/slices/requestsSlice';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/services/hooks';

export const SkillPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectUser);

  const [allUsers, setAllUsers] = useState<UserDb[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [skillsData, setSkillsData] = useState<SkillCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState<boolean>(false);

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
        setSkillsData(data);
        dispatch(setSkills(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки навыков');
      }
    };
    fetchSkills();
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/db/users.json');
        if (!response.ok) throw new Error('Ошибка загрузки пользователей');
        const data = await response.json();
        const users: UserDb[] = data.users;

        setAllUsers(users);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getCityName = (cityId: number): string => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : 'Город не указан';
  };

  const getSkillName = (skillId: number): string => {
    for (const category of skillsData) {
      const subcategory = category.subcategories.find((sub) => sub.id === skillId);
      if (subcategory) {
        return subcategory.title;
      }
    }
    return `Навык ${skillId}`;
  };

  const getSkillCategory = (skillId: number): SkillCategorySlug => {
    for (const category of skillsData) {
      const subcategory = category.subcategories.find((sub) => sub.id === skillId);
      if (subcategory) {
        return category.slug as SkillCategorySlug;
      }
    }
    return 'other';
  };

  const getSkillCategoryBySubcategoryId = (subcategoryId: number): SkillCategorySlug => {
    const category = skillsData.find((cat) =>
      cat.subcategories.some((sub) => sub.id === subcategoryId)
    );
    return category ? (category.slug as SkillCategorySlug) : 'other';
  };

  const targetUser = allUsers.find((user) => String(user.id) === String(id)) || allUsers[0];
  const similarUsers = allUsers.filter((user) => user.id !== targetUser?.id);

  const primarySkill = targetUser?.skillsTeach?.[0];
  const subcategoryId = primarySkill?.subcategoryId;

  let categoryTitle = 'Категория не указана';
  let subcategoryTitle = 'Подкатегория не указана';

  if (subcategoryId && skillsData.length > 0) {
    for (const cat of skillsData) {
      const sub = cat.subcategories.find((s) => s.id === subcategoryId);
      if (sub) {
        categoryTitle = cat.title;
        subcategoryTitle = sub.title;
        break;
      }
    }
  }

  const skillData = {
    id: id || String(targetUser?.id || '1'),
    title: primarySkill?.customTitle || 'Предложение навыка',
    category: categoryTitle,
    subcategory: subcategoryTitle,
    description: primarySkill?.description || targetUser?.about || '',
    images:
      primarySkill?.images && primarySkill.images.length > 0
        ? primarySkill.images
        : [targetUser?.userAvatar || ''],
    isLiked: false,
    user: {
      id: targetUser?.id || 1,
      name: targetUser?.name || '',
      avatar: targetUser?.userAvatar || '',
      city: targetUser ? getCityName(targetUser.cityId) : '',
      birthday: targetUser?.birthday || '',
      about: targetUser?.about || '',
      skillsTeach: (targetUser?.skillsTeach || []).map((skill) => ({
        name: skill.customTitle,
        category: getSkillCategoryBySubcategoryId(skill.subcategoryId),
      })),
      skillsLearn: (targetUser?.skillsLearn || []).map((learnId) => ({
        name: getSkillName(learnId),
        category: getSkillCategory(learnId),
      })),
    },
  };

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
    if (!isAuthenticated || !currentUser) {
      navigate('/login', {
        state: {
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        },
        replace: true,
      });
      return;
    }

    const fromUserId = currentUser.id.toString();
    const toUserId = skillData.user.id.toString();

    dispatch(
      createRequest({
        skillId: skillData.id,
        fromUserId,
        toUserId,
      })
    );

    toast.success('Заявка на обмен успешно отправлена!', {
      duration: 3000,
    });

    setIsExchangeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsExchangeModalOpen(false);
  };

  const handleUserCardClick = (userId: string | number) => {
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
                    likes={user.likes}
                    isLogin={isAuthenticated}
                    onDetailsClick={handleUserCardClick}
                  />
                ))}
              </div>
            </div>
            {(showLeftButton || showRightButton) && (
              <div className={styles.scrollButtons}>
                {showLeftButton && (
                  <IconButton
                    icon={ScrollNavigateIcon}
                    ariaLabel="Прокрутить влево"
                    onClick={scrollLeft}
                    className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                  />
                )}
                {showRightButton && (
                  <IconButton
                    icon={ScrollNavigateIcon}
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
