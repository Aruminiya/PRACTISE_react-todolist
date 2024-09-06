import { Card, Box, Typography, TextField, Stack, Button, Alert } from '@mui/material';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm, SubmitHandler } from "react-hook-form";

import { HexApiContext } from '../context/HexApiContextProvider.tsx';

type Inputs = {
  email: string,
  password: string,
  nickname: string
}

export default function Login() {
  const HexApiCtx = useContext(HexApiContext);
  const { login } = HexApiCtx;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [showError, setShowError] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const handleLogin: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await login(data);
      localStorage.setItem("userData",JSON.stringify(result.data)); // 把登入的 Token 存入 localhost
      navigate('/todoList/todoList-form'); // 登入成功後跳轉到 TodoList 頁面
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
    <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ minWidth: 400, padding: '16px', boxSizing: 'border-box' }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">會員登入</Typography>
          <form onSubmit={handleSubmit(handleLogin)}>
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
              {showError.map(err => <Alert key={err} severity="error">{err}</Alert>)} {/* 後端驗證出錯的提示 */}
              <Stack direction="row" spacing={2}>
                <Button type='submit' variant="contained" fullWidth>確認登入</Button>
                <Button variant="outlined" href='/signup' fullWidth>前往註冊</Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Box>
  );
};