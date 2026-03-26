import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DateInput } from '@/components/DateInput';
import { Footer } from '@/components/Footer/Footer';
import { SelectInput } from '@/components/SelectInput/SelectInput';
import { Avatar, Button, IconButton, InputBaseContainerUI, InputUI } from '@/components/ui';
import { CategoryIcon } from '@/components/ui/Icons/CategoryIcon';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  selectIncomingRequests,
  selectOutgoingRequests,
  selectTeachSkillsByUserId,
  selectUser,
} from '@/services/selectors';
import { userEdit, type AuthUserGender } from '@/services/slices/authSlice';
import { removeTeachSkill, replaceTeachSkills } from '@/services/slices/profileSkillsSlice';
import { acceptRequest, rejectRequest } from '@/services/slices/requestsSlice';
import type { RequestStatus, SkillRequest } from '@/services/types/requests';
import { getSkills, getUsersFromDb } from '@/utils/api';
import { buildTeachSkillEntries } from '@/utils/buildTeachSkillEntries';
import { findUserById, toAuthUser } from '@/utils/mock-users';
import type { TSelectOption, UserFromDb } from '@/utils/types';

import styles from './ProfilePage.module.scss';

import IconEdit from '@/assets/icons/edit.svg?react';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import IconGalleryEdit from '@/assets/icons/gallery-edit.svg?react';
import IconIdea from '@/assets/icons/idea.svg?react';
import IconLike from '@/assets/icons/like-outline.svg?react';
import IconMail from '@/assets/icons/request.svg?react';
import IconMessage from '@/assets/icons/message-text.svg?react';
import IconUser from '@/assets/icons/user.svg?react';

type ProfileNavId = 'personal' | 'requests' | 'skills';
type RequestsTabId = 'inbox' | 'outbox';

const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Ожидает ответа',
  accepted: 'Принята',
  rejected: 'Отклонена',
  inProgress: 'В процессе',
  done: 'Завершена',
};

function counterpartyId(request: SkillRequest, tab: RequestsTabId): string {
  return tab === 'inbox' ? request.fromUserId : request.toUserId;
}

type RequestCardProps = {
  user: UserFromDb | undefined;
  skillId: string;
  statusLabel: string;
  actions?: ReactNode;
};

function RequestCard({ user, skillId, statusLabel, actions }: RequestCardProps) {
  const name = user?.name ?? 'Пользователь';

  return (
    <li className={styles.requestRow}>
      <div className={styles.requestCardMain}>
        <div className={styles.requestCardAvatar}>
          <Avatar src={user?.userAvatar} name={name} size="sm" />
        </div>
        <div className={styles.requestCardText}>
          <p className={styles.requestCustomTitle}>{skillId}</p>
          <p className={styles.requestUserName}>{name}</p>
          <p className={styles.requestStatus}>{statusLabel}</p>
        </div>
      </div>
      {actions ?? null}
    </li>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const skillsLoaded = useAppSelector((state) => state.profileSkills.loaded);
  const userId = user?.id ?? 0;
  const userIdStr = String(userId);
  const selectInbox = useMemo(() => selectIncomingRequests(userIdStr), [userIdStr]);
  const selectOutbox = useMemo(() => selectOutgoingRequests(userIdStr), [userIdStr]);
  const selectMyTeachSkills = useMemo(() => selectTeachSkillsByUserId(userId), [userId]);
  const inbox = useAppSelector(selectInbox);
  const outbox = useAppSelector(selectOutbox);
  const myTeachSkills = useAppSelector(selectMyTeachSkills);

  const [dbUsers, setDbUsers] = useState<UserFromDb[]>([]);
  const [requestsTab, setRequestsTab] = useState<RequestsTabId>('inbox');
  const [activeNav, setActiveNav] = useState<ProfileNavId>('personal');
  const [cities, setCities] = useState<TSelectOption[]>([]);
  const [genders, setGenders] = useState<TSelectOption[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const [about, setAbout] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<TSelectOption | null>(null);
  const [city, setCity] = useState<TSelectOption | null>(null);
  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const [avatarSrc, setAvatarSrc] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const usersById = useMemo(() => {
    const map = new Map<number, UserFromDb>();

    for (const dbUser of dbUsers) {
      map.set(dbUser.id, dbUser);
    }

    return map;
  }, [dbUsers]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/db/cities.json');

        if (!response.ok) {
          throw new Error('Ошибка загрузки городов');
        }

        const data: TSelectOption[] = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGenders = async () => {
      try {
        const response = await fetch('/db/gender.json');

        if (!response.ok) {
          throw new Error('Ошибка загрузки пола');
        }

        const data: TSelectOption[] = await response.json();
        setGenders(data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchCities();
    void fetchGenders();
  }, []);

  useEffect(() => {
    const hydrateUserProfile = async () => {
      if (!user?.id || user.email) {
        return;
      }

      try {
        const fullUser = await findUserById(user.id);

        if (!fullUser) {
          return;
        }

        dispatch(userEdit(toAuthUser(fullUser)));
      } catch (error) {
        console.error(error);
      }
    };

    void hydrateUserProfile();
  }, [dispatch, user?.email, user?.id]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setEmail(user.email ?? '');
    setPassword(user.password ?? '');
    setName(user.name ?? '');
    setAbout(user.about ?? '');
    setBirthday(user.birthday ?? '');
    setAvatarSrc(user.userAvatar ?? '');
  }, [user]);

  useEffect(() => {
    if (cities.length === 0) {
      return;
    }

    if (user?.city) {
      setCity(cities.find((option) => option.name === user.city) ?? null);
      return;
    }

    if (user?.cityId) {
      setCity(cities.find((option) => option.id === user.cityId) ?? null);
      return;
    }

    setCity(null);
  }, [cities, user?.city, user?.cityId]);

  useEffect(() => {
    if (genders.length === 0) {
      return;
    }

    if (!user?.gender) {
      setGender(null);
      return;
    }

    setGender(genders.find((option) => option.name === user.gender) ?? null);
  }, [genders, user?.gender]);

  useEffect(() => {
    let cancelled = false;

    getUsersFromDb()
      .then((users) => {
        if (!cancelled) {
          setDbUsers(users);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDbUsers([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skillsLoaded) {
      return;
    }

    let cancelled = false;

    Promise.all([getUsersFromDb(), getSkills()])
      .then(([users, catalog]) => {
        if (cancelled) {
          return;
        }

        dispatch(replaceTeachSkills(buildTeachSkillEntries(users, catalog)));
      })
      .catch(() => {
        if (!cancelled) {
          dispatch(replaceTeachSkills([]));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, skillsLoaded]);

  const handleEditEmail = () => {
    setEmail('');
    emailRef.current?.focus();
  };

  const handleEditName = () => {
    setName('');
    nameRef.current?.focus();
  };

  const handleEditAbout = () => {
    setAbout('');
    aboutRef.current?.focus();
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFavorite = () => {
    navigate('/favorites');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(
      userEdit({
        email,
        password,
        name,
        about,
        birthday,
        gender: gender?.name as AuthUserGender | undefined,
        city: city?.name,
        cityId: city?.id,
        userAvatar: avatarSrc,
      })
    );
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <main className={styles.main}>
        <nav className={styles.navigation}>
          <ul className={styles.navigationList}>
            <li className={styles.navigationListLink}>
              <Button
                variant={activeNav === 'requests' ? 'primary' : 'tertiary'}
                type="button"
                onClick={() => setActiveNav('requests')}
              >
                <IconMail />
                Заявки
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary" type="button">
                <IconMessage />
                Мои обмены
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary" type="button" onClick={handleFavorite}>
                <IconLike />
                Избранное
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button
                variant={activeNav === 'skills' ? 'primary' : 'tertiary'}
                type="button"
                onClick={() => setActiveNav('skills')}
              >
                <IconIdea />
                Мои навыки
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button
                variant={activeNav === 'personal' ? 'primary' : 'tertiary'}
                type="button"
                onClick={() => setActiveNav('personal')}
              >
                <IconUser />
                Личные данные
              </Button>
            </li>
          </ul>
        </nav>

        <div className={styles.profileInfo}>
          {activeNav === 'requests' ? (
            <div className={styles.requestsPanel}>
              <div className={styles.requestTabs} role="tablist" aria-label="Тип заявок">
                <Button
                  variant={requestsTab === 'inbox' ? 'primary' : 'tertiary'}
                  type="button"
                  role="tab"
                  aria-selected={requestsTab === 'inbox'}
                  onClick={() => setRequestsTab('inbox')}
                >
                  Входящие
                </Button>
                <Button
                  variant={requestsTab === 'outbox' ? 'primary' : 'tertiary'}
                  type="button"
                  role="tab"
                  aria-selected={requestsTab === 'outbox'}
                  onClick={() => setRequestsTab('outbox')}
                >
                  Исходящие
                </Button>
              </div>

              {requestsTab === 'inbox' ? (
                <section
                  className={styles.requestSection}
                  role="tabpanel"
                  aria-label="Входящие заявки"
                >
                  {inbox.length === 0 ? (
                    <p className={styles.requestEmpty}>У вас пока нет входящих заявок.</p>
                  ) : (
                    <ul className={styles.requestList}>
                      {inbox.map((request) => (
                        <RequestCard
                          key={request.id}
                          user={usersById.get(Number(counterpartyId(request, 'inbox')))}
                          skillId={request.skillId}
                          statusLabel={REQUEST_STATUS_LABELS[request.status]}
                          actions={
                            request.status === 'pending' ? (
                              <div className={styles.requestActions}>
                                <Button
                                  variant="outlined"
                                  type="button"
                                  onClick={() => dispatch(rejectRequest(request.id))}
                                >
                                  Отклонить
                                </Button>
                                <Button
                                  variant="primary"
                                  type="button"
                                  onClick={() => dispatch(acceptRequest(request.id))}
                                >
                                  Принять
                                </Button>
                              </div>
                            ) : undefined
                          }
                        />
                      ))}
                    </ul>
                  )}
                </section>
              ) : (
                <section
                  className={styles.requestSection}
                  role="tabpanel"
                  aria-label="Исходящие заявки"
                >
                  {outbox.length === 0 ? (
                    <p className={styles.requestEmpty}>У вас пока нет исходящих заявок.</p>
                  ) : (
                    <ul className={styles.requestList}>
                      {outbox.map((request) => (
                        <RequestCard
                          key={request.id}
                          user={usersById.get(Number(counterpartyId(request, 'outbox')))}
                          skillId={request.skillId}
                          statusLabel={REQUEST_STATUS_LABELS[request.status]}
                        />
                      ))}
                    </ul>
                  )}
                </section>
              )}
            </div>
          ) : activeNav === 'skills' ? (
            <div className={styles.skillsPanel}>
              {myTeachSkills.length === 0 ? (
                <div className={styles.skillsEmpty}>
                  <p className={styles.requestEmpty}>У вас пока нет опубликованных навыков.</p>
                  <Link to="/create" className={styles.addSkillLink}>
                    + Добавить навык
                  </Link>
                </div>
              ) : (
                <>
                  <div className={styles.skillsAddRow}>
                    <Link to="/create" className={styles.addSkillLink}>
                      + Добавить навык
                    </Link>
                  </div>
                  <ul className={styles.skillList}>
                    {myTeachSkills.map((skill) => (
                      <li key={`${skill.userId}-${skill.teachSkillId}`} className={styles.skillRow}>
                        <div className={styles.skillRowLeading}>
                          <CategoryIcon
                            categoryTitle={skill.categoryTitle}
                            className={styles.skillCategoryIcon}
                          />
                          <div className={styles.skillRowInfo}>
                            <p className={styles.skillRowTitle}>{skill.title}</p>
                            <p className={styles.skillRowCategory}>
                              {skill.subcategoryTitle
                                ? `${skill.categoryTitle} / ${skill.subcategoryTitle}`
                                : skill.categoryTitle}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outlined"
                          type="button"
                          onClick={() =>
                            dispatch(
                              removeTeachSkill({
                                userId: skill.userId,
                                teachSkillId: skill.teachSkillId,
                              })
                            )
                          }
                        >
                          Удалить
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <>
              <div>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <InputBaseContainerUI className={styles.field} label="Почта" id="email">
                    <div className={styles.inputEdit}>
                      <InputUI
                        id="email"
                        type="email"
                        value={email}
                        ref={emailRef}
                        placeholder="Введите ваш новый email"
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <IconEdit onClick={handleEditEmail} />
                    </div>
                  </InputBaseContainerUI>

                  <div>
                    <p className={styles.editPassword} onClick={() => setOpen(!isOpen)}>
                      Изменить пароль
                    </p>
                  </div>

                  <div ref={passwordRef} className={!isOpen ? styles.passwordContainerState : ''}>
                    <InputBaseContainerUI label="Пароль" id="password">
                      <div className={styles.inputEdit}>
                        <InputUI
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          placeholder="Введите ваш новый пароль"
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <IconButton
                          iconSrc={showPassword ? eyeSlashIcon : eyeIcon}
                          ariaLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                          onClick={togglePassword}
                        />
                      </div>
                    </InputBaseContainerUI>
                  </div>

                  <InputBaseContainerUI label="Имя" id="name">
                    <div className={styles.inputEdit}>
                      <InputUI
                        id="name"
                        type="text"
                        value={name}
                        ref={nameRef}
                        placeholder="Введите ваше имя"
                        onChange={(event) => setName(event.target.value)}
                      />
                      <IconEdit onClick={handleEditName} />
                    </div>
                  </InputBaseContainerUI>

                  <div className={styles.row}>
                    <div className={styles.rowItem}>
                      <DateInput
                        key={user?.birthday || 'empty-birthday'}
                        disabled={false}
                        id="birthDate"
                        label="Дата рождения"
                        placeholder="дд.мм.гггг"
                        defaultValue={birthday}
                        onChange={setBirthday}
                      />
                    </div>

                    <div className={styles.rowItem}>
                      <SelectInput
                        id="gender"
                        label="Пол"
                        options={genders}
                        defaultValue={gender?.name}
                        onChange={setGender}
                      />
                    </div>
                  </div>

                  <SelectInput
                    id="city"
                    label="Город"
                    options={cities}
                    defaultValue={city?.name}
                    onChange={setCity}
                  />

                  <div>
                    <label htmlFor="about" className={styles.textareaLabel}>
                      О себе
                    </label>
                    <div className={styles.textareaWrapper}>
                      <textarea
                        id="about"
                        className={styles.textarea}
                        placeholder="Расскажите о себе"
                        value={about}
                        onChange={(event) => setAbout(event.target.value)}
                        ref={aboutRef}
                      />
                      <button
                        type="button"
                        className={styles.textareaEditButton}
                        aria-label="Редактировать поле О себе"
                        onClick={handleEditAbout}
                      >
                        <IconEdit className={styles.textareaEditIcon} />
                      </button>
                    </div>
                  </div>

                  <Button variant="primary" type="submit">
                    Сохранить
                  </Button>
                </form>
              </div>

              <div className={styles.avatarWrapper}>
                <Avatar src={avatarSrc || undefined} name={name} size="lg" />
                <button
                  type="button"
                  className={styles.avatarEdit}
                  onClick={handleAvatarButtonClick}
                >
                  <IconGalleryEdit />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  className={styles.avatarInput}
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
