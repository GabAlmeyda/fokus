import ReactQueryProvider from './providers/ReactQueryProvider';
import ThemeProvider from './providers/ThemeProvider';
import AppRouterProvider from './providers/AppRouterProvider';

function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <AppRouterProvider/>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
