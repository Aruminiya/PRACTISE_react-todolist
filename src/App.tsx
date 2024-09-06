import { styled } from '@mui/system';

import Navbar from './components/Navbar.tsx';
import Router from './router/Router.tsx';
import HexApiContextProvider from './context/HexApiContextProvider.tsx';

const MainScreen = styled('div')(() => ({
  display: "flex",
  height: '100%',
  flexDirection: "column",
  "& main": {
    position: 'relative',
    isOverflown: 'auto',
    flex: 1,
  }
}));

function App() {

  return (
    <HexApiContextProvider>
      <MainScreen>
        <nav>
          <Navbar />
        </nav>
        <main>
          <Router />
        </main>
      </MainScreen>
    </HexApiContextProvider>
  )
};

export default App
