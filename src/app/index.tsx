import { Provider } from 'react-redux';
import { store } from '@/services/store';

function App() {
  return <h1>SkillSwap</h1>;
}

export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
