import { styled } from '@mui/system';
import { Container } from '@mui/material';

import Navbar from './components/Navbar.tsx';
import Router from './router/Router.tsx';

const MainScreen = styled('div')(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "& main": {
    position: 'relative',
    flex: 1,
  }
}));

function App() {
  return (
    <>
    <MainScreen>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Container sx={{height:'100%'}} maxWidth="lg">
          <Router />
        </Container>
      </main>
    </MainScreen>
    </>
  )
}

export default App
