import { useState } from 'react';

import authStyles from '@/assets/styles/auth.module.scss';
import styles from './register-page.module.scss';

import { Button, IconButton, InputBaseContainerUI, InputUI } from '@/components/ui';
import { SelectInput } from '@/components/SelectInput';
import { DateInput } from '@/components/DateInput';
import { TSelectOption } from '@/utils/types';

import eyeIcon from '@/assets/icons/eye.svg?react';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg?react';
import appleIcon from '@/assets/icons/logo/apple.svg';
import googleIcon from '@/assets/icons/logo/google.svg';
import lightBulb from '@/assets/illustrations/light-bulb.svg';
import UserInfo from '@/assets/illustrations/user-info.svg';
import avatarAddIcon from '@/assets/icons/avatar-add.svg';
import SchoolBoard from '@/assets/illustrations/school-board.svg';
import galleryAddIcon from '@/assets/icons/gallery-add.svg';

const GENDER_OPTIONS: TSelectOption[] = [
  { id: 1, name: 'Мужской' },
  { id: 2, name: 'Женский' },
];

const CITY_OPTIONS: TSelectOption[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Казань' },
];

const CATEGORY_OPTIONS: TSelectOption[] = [
  { id: 1, name: 'IT и программирование' },
  { id: 2, name: 'Дизайн' },
  { id: 3, name: 'Языки' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  // TODO: получать из состояния формы (Redux)
  const passwordError: string | undefined = undefined;

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <main className={authStyles.main}>
      <div className={styles.steps}>
        <h1 className={authStyles.title}>Шаг {step} из 3</h1>
        <div className={styles.progressBar} aria-hidden="true">
          <span className={`${styles.segment} ${step >= 1 ? styles.segmentActive : ''}`} />
          <span className={`${styles.segment} ${step >= 2 ? styles.segmentActive : ''}`} />
          <span className={`${styles.segment} ${step >= 3 ? styles.segmentActive : ''}`} />
        </div>
      </div>

      <div className={authStyles.content}>
        {step === 1 && (
          <>
            <section
              className={`${authStyles.formSection} ${styles.formSectionStepOne}`}
              aria-label="Форма регистрации: шаг 1"
            >
              <div className={authStyles.socialButtons}>
                <Button variant="outlined" type="button">
                  <img src={googleIcon} alt="" aria-hidden="true" />
                  <span>Продолжить с Google</span>
                </Button>

                <Button variant="outlined" type="button">
                  <img src={appleIcon} alt="" aria-hidden="true" />
                  <span>Продолжить с Apple</span>
                </Button>
              </div>

              <div className={authStyles.divider}>или</div>

              <form
                className={authStyles.formContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNextStep();
                  // TODO: сохранить данные первого шага и перейти дальше
                }}
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Email" id="email">
                    <InputUI id="email" type="email" placeholder="Введите email" />
                  </InputBaseContainerUI>

                  <InputBaseContainerUI
                    label="Пароль"
                    id="password"
                    error={passwordError}
                    hint="Пароль должен содержать не менее 8 знаков"
                  >
                    <div className={authStyles.passwordField}>
                      <InputUI
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Придумайте надёжный пароль"
                      />
                      <IconButton
                        icon={showPassword ? eyeSlashIcon : eyeIcon}
                        ariaLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        onClick={togglePassword}
                      />
                    </div>
                  </InputBaseContainerUI>
                </div>

                <Button variant="primary" type="submit" className={authStyles.submitButton}>
                  Далее
                </Button>
              </form>
            </section>

            <section className={authStyles.onboarding} aria-label="О платформе">
              <img src={lightBulb} alt="" className={authStyles.onboardingImage} />

              <div className={authStyles.onboardingText}>
                <h2 className={authStyles.onboardingTitle}>Добро пожаловать в SkillSwap!</h2>

                <p className={authStyles.onboardingSubtitle}>
                  Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми
                </p>
              </div>
            </section>
          </>
        )}

        {step === 2 && (
          <>
            <section
              className={`${authStyles.formSection} ${styles.formSectionStepTwo}`}
              aria-label="Форма регистрации: шаг 2"
            >
              <div className={styles.avatarBlock}>
                <button
                  type="button"
                  className={styles.avatarButton}
                  aria-label="Добавить фото"
                  // TODO: открыть загрузку фото профиля
                >
                  <img
                    src={avatarAddIcon}
                    alt=""
                    aria-hidden="true"
                    className={styles.avatarAddIcon}
                  />
                </button>
              </div>

              <form
                className={authStyles.formContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNextStep();
                  // TODO: сохранить данные второго шага регистрации и перейти дальше
                }}
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Имя" id="name">
                    <InputUI id="name" type="text" placeholder="Введите ваше имя" />
                  </InputBaseContainerUI>

                  <div className={styles.row}>
                    <div className={styles.rowItem}>
                      <DateInput
                        id="birthDate"
                        label="Дата рождения"
                        placeholder="дд.мм.гггг"
                        disabled={false}
                      />
                    </div>

                    <div className={styles.rowItem}>
                      <SelectInput
                        id="gender"
                        label="Пол"
                        placeholder="Не указан"
                        options={GENDER_OPTIONS}
                        isOpen={openSelectId === 'gender'}
                        onToggle={(next) => setOpenSelectId(next ? 'gender' : null)}
                      />
                    </div>
                  </div>

                  <SelectInput
                    id="city"
                    label="Город"
                    placeholder="Не указан"
                    options={CITY_OPTIONS}
                    isOpen={openSelectId === 'city'}
                    onToggle={(next) => setOpenSelectId(next ? 'city' : null)}
                  />

                  <SelectInput
                    id="learnCategory"
                    label="Категория навыка, которому хотите научиться"
                    placeholder="Выберите категорию"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'learnCategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'learnCategory' : null)}
                  />

                  <SelectInput
                    id="learnSubcategory"
                    label="Подкатегория навыка, которому хотите научиться"
                    placeholder="Выберите подкатегорию"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'learnSubcategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'learnSubcategory' : null)}
                  />
                </div>

                <div className={styles.actions}>
                  <Button type="button" variant="outlined" onClick={handlePrevStep}>
                    Назад
                  </Button>
                  <Button type="submit" variant="primary">
                    Продолжить
                  </Button>
                </div>
              </form>
            </section>

            <section className={authStyles.onboarding} aria-label="О платформе">
              <img src={UserInfo} alt="" className={authStyles.onboardingImage} />
              <div className={authStyles.onboardingText}>
                <h2 className={authStyles.onboardingTitle}>Расскажите немного о себе</h2>
                <p className={authStyles.onboardingSubtitle}>
                  Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена
                </p>
              </div>
            </section>
          </>
        )}

        {step === 3 && (
          <>
            <section
              className={`${authStyles.formSection} ${styles.formSectionStepThree}`}
              aria-label="Форма регистрации: шаг 3"
            >
              <form
                className={authStyles.formContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: показать модальное окно подтверждения профиля
                }}
              >
                <div className={authStyles.fields}>
                  <InputBaseContainerUI label="Название навыка" id="skillName">
                    <InputUI
                      id="skillName"
                      type="text"
                      placeholder="Введите название вашего навыка"
                    />
                  </InputBaseContainerUI>

                  <SelectInput
                    id="skillCategory"
                    label="Категория навыка"
                    placeholder="Выберите категорию навыка"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'skillCategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'skillCategory' : null)}
                  />

                  <SelectInput
                    id="skillSubcategory"
                    label="Подкатегория навыка"
                    placeholder="Выберите подкатегорию навыка"
                    options={CATEGORY_OPTIONS}
                    isOpen={openSelectId === 'skillSubcategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'skillSubcategory' : null)}
                  />

                  <div className={styles.textareaBlock}>
                    <label htmlFor="description" className={styles.textareaLabel}>
                      Описание
                    </label>
                    <textarea
                      id="description"
                      className={styles.textarea}
                      placeholder="Коротко опишите, чему можете научить"
                    />
                  </div>

                  <div className={styles.uploadBlock}>
                    <p className={styles.uploadText}>Перетащите или выберите изображения навыка</p>
                    <button
                      type="button"
                      className={styles.uploadButton}
                      // TODO: открыть выбор изображений
                    >
                      <img
                        src={galleryAddIcon}
                        alt=""
                        aria-hidden="true"
                        className={styles.uploadIcon}
                      />
                      <span className={styles.uploadButtonText}>Выбрать изображения</span>
                    </button>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button type="button" variant="outlined" onClick={handlePrevStep}>
                    Назад
                  </Button>
                  <Button type="submit" variant="primary">
                    Продолжить
                  </Button>
                </div>
              </form>
            </section>

            <section className={authStyles.onboarding} aria-label="О платформе">
              <img src={SchoolBoard} alt="" className={authStyles.onboardingImage} />
              <div className={authStyles.onboardingText}>
                <h2 className={authStyles.onboardingTitle}>Укажите, чем вы готовы поделиться</h2>
                <p className={authStyles.onboardingSubtitle}>
                  Так другие люди смогут увидеть ваши предложения и предложить вам обмен!
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
