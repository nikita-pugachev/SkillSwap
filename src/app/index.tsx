import { Provider } from 'react-redux';
import { store } from './store';
import { Button } from '@/shared/ui/Button';

function App() {
  return (
    <>
      <h1>SkillSwap</h1>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', padding: '16px' }}>
        <Button variant="outlined">Войти</Button>
        <Button variant="primary">Зарегистрироваться</Button>
      </div>
    </>
  );
}

export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
