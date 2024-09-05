import { createContext, ReactNode } from 'react';
import axios, {AxiosResponse} from 'axios';

type HexApiContextValue = {
  getTodo: () => Promise<AxiosResponse>;
  postTodo: (content: string) => Promise<AxiosResponse>;
  putTodo: (content: string, id: string) => Promise<AxiosResponse>;
  deleteTodo: (id: string) => Promise<AxiosResponse>;
  patchTodo: (id: string) => Promise<AxiosResponse>;
};

type HexApiContextProviderProps = {
  children: ReactNode;
};

export const HexApiContext = createContext<HexApiContextValue>({
  getTodo: () => Promise.resolve({} as AxiosResponse),
  postTodo: () => Promise.resolve({} as AxiosResponse),
  putTodo: () => Promise.resolve({} as AxiosResponse),
  deleteTodo: () => Promise.resolve({} as AxiosResponse),
  patchTodo: () => Promise.resolve({} as AxiosResponse)
});

export default function HexApiContextProvider({ children }: HexApiContextProviderProps) {
  const token: string = JSON.parse(localStorage.getItem('userData')!).token;

  // 取得待辦事項
  async function getTodo() {
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

  return <HexApiContext.Provider value={{ getTodo, postTodo, putTodo, deleteTodo, patchTodo }}>{children}</HexApiContext.Provider>;
}