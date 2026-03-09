import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { Button } from '@/components/ui';

function App() {
  return <h1>SkillSwap</h1>;
}

export default function Root() {
  return (
    <Provider store={store}>
      <App />
      <Button
        variant="outlined"
        onClick={() => {
          console.log('wwww');
        }}
      >
        Click me
      </Button>
    </Provider>
  );
}
