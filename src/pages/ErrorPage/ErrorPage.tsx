import { ErrorPageUI } from '@/components/ui/ErrorPageUI';
import { useNavigate, useParams } from 'react-router-dom';
import { errorConfig, type ErrorType } from '@/pages/ErrorPage/model/errorConfig';
import styles from './ErrorPage.module.scss';
import { Button } from '@/components/ui';

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
  const handleReportProblemClick = () => {};
  return (
    <div className={styles.errorPage}>
      <ErrorPageUI {...errorData} />

      <div className={styles.buttonContainer}>
        <Button onClick={handleReportProblemClick} variant="outlined" className="buttonErrorPage">
          Сообщить об ошибке
        </Button>
        <Button onClick={handleGoHomeClick} variant="primary" className="buttonErrorPage">
          На главную
        </Button>
      </div>
    </div>
  );
};
