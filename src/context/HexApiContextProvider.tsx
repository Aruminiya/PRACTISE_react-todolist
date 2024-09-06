import { createContext, ReactNode } from 'react';
import axios, { AxiosResponse } from 'axios';

type HexApiContextValue = {
  login: (data: loginData) => Promise<AxiosResponse>;
  signup: (data: signupData) => Promise<AxiosResponse>;
  checkout: () => Promise<AxiosResponse>;
  signout: () => Promise<AxiosResponse>;
  getTodo: () => Promise<AxiosResponse>;
  postTodo: (content: string) => Promise<AxiosResponse>;
  putTodo: (content: string, id: string) => Promise<AxiosResponse>;
  deleteTodo: (id: string) => Promise<AxiosResponse>;
  patchTodo: (id: string) => Promise<AxiosResponse>;
  checkTokenStatus: (success: () => void, fail: () => void) => Promise<void>;
};

type HexApiContextProviderProps = {
  children: ReactNode;
};

type loginData = { email: string; password: string };
type signupData = { email: string; password: string; nickname: string };

export const HexApiContext = createContext<HexApiContextValue>({
  login: () => Promise.resolve({} as AxiosResponse),
  signup: () => Promise.resolve({} as AxiosResponse),
  checkout: () => Promise.resolve({} as AxiosResponse),
  signout: () => Promise.resolve({} as AxiosResponse),
  getTodo: () => Promise.resolve({} as AxiosResponse),
  postTodo: () => Promise.resolve({} as AxiosResponse),
  putTodo: () => Promise.resolve({} as AxiosResponse),
  deleteTodo: () => Promise.resolve({} as AxiosResponse),
  patchTodo: () => Promise.resolve({} as AxiosResponse),
  checkTokenStatus: () => Promise.resolve()
});

const getToken = () => JSON.parse(localStorage.getItem('userData')!).token;

export default function HexApiContextProvider({ children }: HexApiContextProviderProps) {
  
  // 登入
  async function login(data: loginData) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/users/sign_in`, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data.message
      } else {
        throw error
      }
    }
  };

  // 註冊
  async function signup(data: signupData) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/users/sign_up`, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data.message
      } else {
        throw error
      }
    }
  };

  // 檢查 Token 是否有效
  async function checkout() {
    const token = getToken();
    try {
      const response = await axios.get(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/users/checkout`, {
        headers: {
          Authorization: token
        }
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 登出
  async function signout() {
    const token = getToken();
    try {
      const response = await axios.post(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/users/sign_out`, {}, {
        headers: {
          Authorization: token
        }
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 取得待辦事項
  async function getTodo() {
    const token = getToken();
    try {
      const result = await axios.get(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos`, {
        headers: {
          Authorization: token,
        },
      });
      const { data } = result;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 新增待辦事項
  async function postTodo(content: string) {
    const token = getToken();
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos`,
        {
          content
        },
        {
          headers: {
            Authorization: token
          }
        }
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 修改待辦事項
  async function putTodo(content: string , id: string) {
    const token = getToken();
    try {
      const result = await axios.put(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos/${id}`,
        {
          content
        },
        {
        headers: {
          Authorization: token
        }
      })

      return result
    } catch(error) {
      console.error(error);
      throw error
    }
  };

  // 刪除待辦事項
  async function deleteTodo(id: string) {
    const token = getToken();
    try {
      const result = await axios.delete(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos/${id}`,
        {
        headers: {
          Authorization: token
        }
      })
      return result
    } catch(error) {
      console.error(error);
      throw error
    }
  };

  // 修改待辦事項狀態
  async function patchTodo(id: string) {
    const token = getToken();
    try {
      const result = await axios.patch(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos/${id}/toggle`,
        {},
        {
        headers: {
          Authorization: token
        }
      })
      return result
    } catch(error) {
      console.error(error);
      throw error
    }
  };


  // 檢查登入狀態
  const checkTokenStatus = async (success: () => void , fail: () => void) => {
    try {
      await checkout();
      const token = JSON.parse(localStorage.getItem('userData')!);
      if ( token ) {
        success();
      } else {
        fail();
      }
    } catch(error) {
      console.log(error);
      fail();
    }
  };

  return <HexApiContext.Provider value={{ login, signup, checkout, signout, getTodo, postTodo, putTodo, deleteTodo, patchTodo, checkTokenStatus }}>{children}</HexApiContext.Provider>;
};