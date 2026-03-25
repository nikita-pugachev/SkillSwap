import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import styles from './ProfilePage.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  selectIncomingRequests,
  selectOutgoingRequests,
  selectTeachSkillsByUserId,
  selectUser,
} from '@/services/selectors';
import { acceptRequest, rejectRequest } from '@/services/slices/requestsSlice';
import { removeTeachSkill, replaceTeachSkills } from '@/services/slices/profileSkillsSlice';
import { getSkills, getUsersFromDb } from '@/utils/api';
import { buildTeachSkillEntries } from '@/utils/buildTeachSkillEntries';
import type { UserFromDb } from '@/utils/types';
import type { RequestStatus, SkillRequest } from '@/services/types/requests';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { Footer } from '@/components/Footer/Footer';
import { InputBaseContainerUI, InputUI } from '@/components/ui';
import { IconButton } from '@/components/ui';
import { CategoryIcon } from '@/components/ui/Icons/CategoryIcon';

import IconMail from '@/assets/icons/request.svg?react';
import IconMessage from '@/assets/icons/message-text.svg?react';
import IconLike from '@/assets/icons/like-outline.svg?react';
import IconIdea from '@/assets/icons/idea.svg?react';
import IconUser from '@/assets/icons/user.svg?react';
import IconEdit from '@/assets/icons/edit.svg?react';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';
import eyeIcon from '@/assets/icons/eye.svg';
import calendarIcon from '@/assets/icons/calendar.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import crossIcon from '@/assets/icons/cross.svg';
import IconGalleryEdit from '@/assets/icons/gallery-edit.svg?react';

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
  const authUser = useAppSelector(selectUser);
  const skillsLoaded = useAppSelector((state) => state.skills.loaded);
  const userId = authUser?.id ?? 0;
  const userIdStr = String(userId);
  const selectInbox = useMemo(() => selectIncomingRequests(userIdStr), [userIdStr]);
  const selectOutbox = useMemo(() => selectOutgoingRequests(userIdStr), [userIdStr]);
  const selectMyTeachSkills = useMemo(() => selectTeachSkillsByUserId(userId), [userId]);
  const inbox = useAppSelector(selectInbox);
  const outbox = useAppSelector(selectOutbox);
  const myTeachSkills = useAppSelector(selectMyTeachSkills);

  const [dbUsers, setDbUsers] = useState<UserFromDb[]>([]);
  const [requestsTab, setRequestsTab] = useState<RequestsTabId>('inbox');

  const usersById = useMemo(() => {
    const map = new Map<number, UserFromDb>();
    for (const u of dbUsers) {
      map.set(u.id, u);
    }
    return map;
  }, [dbUsers]);

  const [activeNav, setActiveNav] = useState<ProfileNavId>('personal');

  const [email, setEmail] = useState('#TODO почта пользователя');
  const emailRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);

  const [password, setPassword] = useState('#TODO пароль пользователя');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('Пользователь');
  const nameRef = useRef<HTMLInputElement>(null);

  const [about, setAbout] = useState('#TODO о пользователе');
  const aboutRef = useRef<HTMLTextAreaElement>(null);

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

  const [openSelects, setOpenSelects] = useState({
    gender: false,
    city: false,
    learnCategory: false,
    learnSubcategory: false,
    skillCategory: false,
    skillSubcategory: false,
  });

  const toggleSelect = (selectName: keyof typeof openSelects) => {
    setOpenSelects((prev) => ({
      ...prev,
      [selectName]: !prev[selectName],
    }));
  };

  const handleFavorit = () => {
    navigate('/favorites');
  };

  useEffect(() => {
    let cancelled = false;
    getUsersFromDb()
      .then((users) => {
        if (!cancelled) setDbUsers(users);
      })
      .catch(() => {
        if (!cancelled) setDbUsers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skillsLoaded) return;
    let cancelled = false;
    Promise.all([getUsersFromDb(), getSkills()])
      .then(([users, catalog]) => {
        if (cancelled) return;
        dispatch(replaceTeachSkills(buildTeachSkillEntries(users, catalog)));
      })
      .catch(() => {
        if (!cancelled) dispatch(replaceTeachSkills([]));
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, skillsLoaded]);

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
              <Button variant="tertiary">
                <IconMessage />
                Мои обмены
              </Button>
            </li>
            <li className={styles.navigationListLink}>
              <Button variant="tertiary" onClick={handleFavorit}>
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
                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                  <InputBaseContainerUI className={styles.field} label="Почта" id="email">
                    <div className={styles.inputEdit}>
                      <InputUI
                        id="email"
                        type="email"
                        value={email}
                        ref={emailRef}
                        placeholder="Введите ваш новый email"
                        onChange={(e) => setEmail(e.target.value)}
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
                          onChange={(e) => setPassword(e.target.value)}
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
                        onChange={(e) => setName(e.target.value)}
                      />
                      <IconEdit onClick={handleEditName} />
                    </div>
                  </InputBaseContainerUI>
                  <div className={styles.row}>
                    <div className={styles.rowItem}>
                      <InputBaseContainerUI label="Дата рождения" id="birthDate">
                        <button
                          id="birthDate"
                          type="button"
                          className={styles.selectField}
                          // TODO: открыть календарь
                        >
                          <span
                            className={styles.selectText} //TODO Дата рождения
                          >
                            20.03.2026
                          </span>

                          <img src={calendarIcon} alt="" aria-hidden="true" />
                        </button>
                      </InputBaseContainerUI>
                    </div>

                    <div className={styles.rowItem}>
                      <InputBaseContainerUI label="Пол" id="gender">
                        <button
                          id="gender"
                          type="button"
                          className={styles.selectField}
                          onClick={() => toggleSelect('gender')}
                        >
                          <span
                            className={styles.selectText} //TODO Пол
                          >
                            Мужской
                          </span>

                          <img
                            src={openSelects.gender ? chevronUpIcon : chevronDownIcon}
                            alt=""
                            aria-hidden="true"
                          />
                        </button>
                      </InputBaseContainerUI>
                    </div>
                  </div>
                  <InputBaseContainerUI label="Город" id="city">
                    <button
                      id="city"
                      type="button"
                      className={styles.selectField}
                      onClick={() => toggleSelect('city')}
                      // TODO: открыть поиск и список городов
                    >
                      <span
                        className={styles.selectText} //TODO Город
                      >
                        Москва
                      </span>

                      <img
                        src={openSelects.city ? crossIcon : chevronDownIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </InputBaseContainerUI>
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
                        onChange={(e) => setAbout(e.target.value)}
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
                  <Button variant="primary">Сохранить</Button>
                </form>
              </div>
              <div className={styles.avatarWrapper}>
                <Avatar name={name} size="lg" />
                <div className={styles.avatarEdit}>
                  <IconGalleryEdit />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
