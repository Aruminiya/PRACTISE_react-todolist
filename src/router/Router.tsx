import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from '../pages/Index.tsx';
import Login from "../pages/Login.tsx";
import Signup from "../pages/Signup.tsx";
import TodoList from "../pages/TodoList/index.tsx";
import TodoListForm from "../pages/TodoList/TodoListForm.tsx";
import TodoListDate from "../pages/TodoList/TodoListDate.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
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

]);

export default function Router() {
  return <RouterProvider router={router} />
}
