import { ErrorPageUI } from '@/components/ui/ErrorPageUI/ErrorPageUI';
import { useNavigate, useParams } from 'react-router-dom';
import { errorConfig, type ErrorType } from '@/pages/ErrorPage/model/errorConfig';
import styles from './ErrorPage.module.scss';

export const ErrorPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  if (!type || !(type in errorConfig)) {
    return <div>Неизвестная ошибка</div>;
  }

  const errorData = errorConfig[type as ErrorType];

  const handleGoHomeClick = () => {
    navigate('/');
  };

  //   TODO: доделать куда переправляется пользователь
  const handleReportProblemClick = () => {
    console.log('Перенаправляем...');
  };
  return (
    <div className={styles.errorPage}>
      <ErrorPageUI {...errorData} />

      {/* Fix: заменить на компоненты кнопки */}
      <div className={styles.buttonContainer}>
        <button onClick={handleReportProblemClick}>Сообщить об ошибке</button>
        <button onClick={handleGoHomeClick}>На главную</button>
      </div>
    </div>
  );
};
