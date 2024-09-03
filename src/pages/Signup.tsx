import { Card, Box, Typography, TextField, Stack, Button, Alert } from '@mui/material';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

async function signupAPI(data: { email: string; password: string; nickname: string }) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/users/sign_up`, data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data.message
    } else {
      throw error // `axios.isAxiosError` 是 Axios 提供的一个类型保护（type guard）函数，用于检查一个错误对象是否是由 Axios 请求引发的。这在处理错误时非常有用，因为它允许你区分 Axios 错误和其他类型的错误，从而可以更有针对性地处理错误。
    }
  }
}

export default function Signup() {
  const [userData, setUserData] = useState(
    {
      email: '',
      password: '',
      nickname: ''
    }
  );
  const [showError, setShowError] = useState<string[]>([]);

  const handleSignup = async () => {
    try {
      await signupAPI(userData);
    } catch(errMessage) {
      console.error(errMessage);
      if (Array.isArray(errMessage)) {
        setShowError(errMessage as string[]); // 直接传递错误信息数组
      } else {
        setShowError([String(errMessage)]); // 如果不是数组，将其转换为字符串数组
      }
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => { // `ChangeEvent` 是 TypeScript 中用于描述表单元素（如输入框、选择框等）变化事件的类型。它是 React 提供的类型，用于确保在处理表单事件时具有正确的类型检查。
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Box margin={2} sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ minWidth: 400, padding: '16px' }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">會員註冊</Typography>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            name='email'
            fullWidth
            type='text'
            value={userData.email}
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            label="密碼"
            variant="outlined"
            name='password'
            fullWidth
            type="password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <TextField
            id="nickname"
            label="暱稱"
            variant="outlined"
            name='nickname'
            fullWidth
            type='text'
            value={userData.nickname}
            onChange={handleInputChange}
          />
          {showError.map(err => <Alert severity="error">{err}</Alert>)}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" fullWidth onClick={() => handleSignup()}>確認註冊</Button>
            <Button variant="outlined" href='/login' fullWidth>前往登入</Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}