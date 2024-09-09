import { styled } from '@mui/system';

import Navbar from '../../components/Navbar.tsx';
import HexApiContextProvider from '../../context/HexApiContextProvider.tsx';

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
import { Outlet } from "react-router-dom";

export default function Index() {
  return (
    <HexApiContextProvider>
      <MainScreen>
        <nav>
          <Navbar />
        </nav>
        <main>
          <Outlet />
        </main>
      </MainScreen>
    </HexApiContextProvider>
  );
};