import { styled } from '@mui/system';

import Navbar from './components/Navbar.tsx';
import Router from './router/Router.tsx';

const MainScreen = styled('div')(() => ({
  // border: 'solid 1px red',
  display: "flex",
  height: '100%',
  flexDirection: "column",
  "& main": {
    // border: 'solid 1px blue',
    position: 'relative',
    isOverflown: 'auto',
    flex: 1,
  }
}));

function App() {
  return (
    <MainScreen>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Router />
      </main>
    </MainScreen>
  )
}

export default App
