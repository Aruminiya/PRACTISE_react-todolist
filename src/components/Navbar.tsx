import { AppBar, Box, Toolbar, Link, Stack } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { HexApiContext } from '../context/HexApiContextProvider.tsx';
import { useNavigate } from 'react-router-dom';

const links = [
  {
    href: "/",
    title: "首頁"
  },
  {
    href: "/todoList/todoList-form",
    title: "TodoList 表單"
  },
  {
    href: "/todoList/todoList-date",
    title: "TodoList 日曆"
  }
];

export default function Navbar() {
  const [ token, setToken ] = useState<boolean>(false);
  const HexApiCtx = useContext(HexApiContext);
  const { signout, checkTokenStatus } = HexApiCtx;
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await signout();
    localStorage.removeItem('userData');
    setToken(() => false);
    navigate('/');
  };

  useEffect(()=>{
    checkTokenStatus(() => {
      setToken(() => true);
    }, () => {
      setToken(() => false);
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: "space-between", alignItems: "center" }}>
            <Stack direction="row" spacing={2}>
                {links.map(link =>
                  <Box key={link.href} margin="0 12px">
                    <Link color="white" href={link.href} underline="none">{link.title}</Link>
                  </Box>
                )}    
              </Stack>
              <Stack direction="row" spacing={2}>
                {token ?
                  <>
                    <Link sx={{cursor: "pointer"}} color="white" onClick={handleLogOut} underline="none" >登出</Link>
                  </>
                  :
                  <>
                    <Link color="white" href={'/login'} underline="none">登入</Link>
                    <Link color="white" href={'/signup'} underline="none">註冊</Link>
                  </>
                }
              </Stack>
            </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
