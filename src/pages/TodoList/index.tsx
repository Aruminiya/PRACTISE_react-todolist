import { Outlet } from "react-router-dom";
import { useEffect, useContext } from 'react';

import { HexApiContext } from '../../context/HexApiContextProvider.tsx';
import { useNavigate } from 'react-router-dom';

export default function TodoList() {
  // 檢查登入狀態
  const HexApiCtx = useContext(HexApiContext);
  const { checkTokenStatus } = HexApiCtx;
  const navigate = useNavigate();

  useEffect(() => {
    checkTokenStatus(() => {}, () => { navigate('/login') });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};