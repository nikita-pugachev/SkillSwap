import type { Preview } from '@storybook/react-vite';
import '../src/assets/fonts/fonts.scss';
import '../src/assets/styles/variables.scss';
import '../src/assets/styles/global.scss';
import '../src/assets/styles/typography.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
