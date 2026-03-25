import { ErrorPageUI, Button } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { errorConfig, type ErrorType } from '@/pages/error-page/model/errorConfig';
import styles from './error-page.module.scss';

type ErrorPageProps = {
  defaultType?: ErrorType;
};

export const ErrorPage = ({ defaultType }: ErrorPageProps) => {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();

  const errorType = (type && type in errorConfig ? type : defaultType) as ErrorType | undefined;

  if (!errorType) {
    return <div>Неизвестная ошибка</div>;
  }

  const errorData = errorConfig[errorType];

  const handleGoHomeClick = () => {
    navigate('/');
  };

  const handleReportProblemClick = () => {};

  return (
    <div className={styles.errorPage}>
      <ErrorPageUI {...errorData} />

      <div className={styles.buttonContainer}>
        <Button
          onClick={handleReportProblemClick}
          variant="outlined"
          className={styles.buttonErrorPage}
        >
          Сообщить об ошибке
        </Button>

        <Button onClick={handleGoHomeClick} variant="primary" className={styles.buttonErrorPage}>
          На главную
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
