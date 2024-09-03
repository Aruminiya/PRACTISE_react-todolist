import { Card, Box, Typography, TextField, Stack, Button } from '@mui/material';

export default function Login() {
  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ minWidth: 400, padding: '16px' }}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h2">會員登入</Typography>
            <TextField id="outlined-basic" label="帳號" variant="outlined" fullWidth/>
            <TextField id="outlined-basic" label="密碼" variant="outlined" fullWidth/>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" fullWidth>確認登入</Button>
              <Button variant="outlined" href='/signup' fullWidth>前往註冊</Button>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </>
  );
};