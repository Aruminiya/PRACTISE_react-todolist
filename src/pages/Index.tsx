import { Button } from '@mui/material';

export default function Index() {
  return (
    <>
      <h1>歡迎來到首頁</h1>
      <Button variant="contained" href='/login'>登入</Button>
      <Button variant="contained" href='/signup'>註冊</Button>
    </>
  );
};