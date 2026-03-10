import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui';

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
      <Avatar src="src\assets\user-avatars\michael.png" name="Михаил" size="sm"></Avatar>
    </Provider>
  );
}
