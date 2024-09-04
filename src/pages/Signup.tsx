import { Card, Box, Typography, TextField, Stack, Button, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm, SubmitHandler } from "react-hook-form";
import axios from 'axios';

type Inputs = {
  email: string,
  password: string,
  nickname: string
}

// API
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [showError, setShowError] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const handleSignup: SubmitHandler<Inputs> = async (data) => {
    try {
      await signupAPI(data);
      navigate('/login'); // 註冊成功後跳轉到登入頁面
    } catch(errMessage) {
      console.error(errMessage);
      if (Array.isArray(errMessage)) {
        setShowError(errMessage as string[]); // 直接传递错误信息数组
      } else {
        setShowError([String(errMessage)]); // 如果不是数组，将其转换为字符串数组
      }
    }
  };

  return (
    <Box margin={2} sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ minWidth: 400, padding: '16px', boxSizing: 'border-box' }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">會員註冊</Typography>
          <form onSubmit={handleSubmit(handleSignup)}>
            <Stack spacing={2}>
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                type='text'
                error={ errors.email ? true : false } 
                helperText={errors?.email?.message}
                {...register("email", { 
                  required: "Email 必填",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Email 的驗證規則
                    message: "無效的 Email 格式"
                  }
                })}
              />
              <TextField
                id="password"
                label="密碼"
                variant="outlined"
                fullWidth
                type="password"
                error={ errors.password ? true : false } 
                helperText={errors?.password?.message}
                {...register("password", { 
                  required: "密碼必填",
                  minLength: {
                    value: 8,
                    message: "密碼長度最少 8 字以上"
                  } 
                })}
              />
              <TextField
                id="nickname"
                label="暱稱"
                variant="outlined"
                fullWidth
                type='text'
                error={ errors.nickname ? true : false } 
                helperText={errors?.nickname?.message}
                {...register("nickname", {
                  required: "暱稱必填",
                  maxLength: {
                    value: 20,
                    message: "暱稱最多 20 字以下"
                  } 
                })}
              />
              {showError.map(err => <Alert severity="error">{err}</Alert>)} {/* 後端驗證出錯的提示 */}
              <Stack direction="row" spacing={2}>
                <Button type='submit' variant="contained" fullWidth>確認註冊</Button>
                <Button variant="outlined" href='/login' fullWidth>前往登入</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Box>
  );
}