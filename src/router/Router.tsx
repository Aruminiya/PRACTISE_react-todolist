import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frontend from '../pages/Frontend/index.tsx';
import Home from '../pages/Frontend/Home.tsx';
import Login from "../pages/Frontend/Login.tsx";
import Signup from "../pages/Frontend/Signup.tsx";
import TodoList from "../pages/Frontend/TodoList/index.tsx";
import TodoListForm from "../pages/Frontend/TodoList/TodoListForm.tsx";
import TodoListDate from "../pages/Frontend/TodoList/TodoListDate.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Frontend />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/todoList',
        element: <TodoList/>,
        children: [
          {
            path: '/todoList/todoList-form',
            element: <TodoListForm />,
          },
          {
            path: '/todoList/todoList-date',
            element: <TodoListDate />
          }
        ]
      }
    ]
  }

]);

export default function Router() {
  return <RouterProvider router={router} />
}
