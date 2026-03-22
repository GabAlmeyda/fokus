import ReactQueryProvider from './providers/ReactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';
import AppRouterProvider from './providers/AppRouterProvider';

export default function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <AppRouterProvider />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
