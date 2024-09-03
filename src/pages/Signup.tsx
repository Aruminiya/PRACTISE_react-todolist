import { Card, Box, Typography, TextField, Stack, Button } from '@mui/material';
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
      email: 'userTest001@gmail.com',
      password: '12345678',
      nickname: 'usetTest001'
    }
  );
  const [showError, setShowError] = useState('');

  const handleSignup = async () => {
    try {
      const result = await signupAPI(userData);
      console.log(result)
    } catch(errMessage) {
      console.log(errMessage);
      setShowError(() => errMessage as string) // 直接传递错误信息字符串
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => { // `ChangeEvent` 是 TypeScript 中用于描述表单元素（如输入框、选择框等）变化事件的类型。它是 React 提供的类型，用于确保在处理表单事件时具有正确的类型检查。
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ minWidth: 400, padding: '16px' }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">會員註冊</Typography>
          <TextField
            id="username"
            label="帳號"
            variant="outlined"
            name='email'
            fullWidth
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
            value={userData.nickname}
            onChange={handleInputChange}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" fullWidth onClick={() => handleSignup()}>確認註冊</Button>
            <Button variant="outlined" href='/login' fullWidth>前往登入</Button>
          </Stack>
        </Stack>
        <p>{showError}</p>
      </Card>
    </Box>
  );
}