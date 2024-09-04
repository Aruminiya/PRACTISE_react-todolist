import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from '../pages/Index.tsx';
import Login from "../pages/Login.tsx";
import Signup from "../pages/Signup.tsx";
import TodoList from "../pages/TodoList.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/todoList',
    element: <TodoList />,
  }
]);

export default function Router() {
  return <RouterProvider router={router} />
}
