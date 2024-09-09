import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Stack, Button } from '@mui/material';

import { useState, useContext, useEffect, useCallback } from 'react';
import { HexApiContext } from '../../../context/HexApiContextProvider.tsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { formatTimestampToDate } from '../../../utils/dateUtils.ts';

// 定義待辦事項的接口
type Todo = {
  id: string;
  status: boolean;
  content: string;
  createTime: string;
};

export default function TodoList() {
  const HexApiCtx = useContext(HexApiContext);
  const { getTodo, postTodo, putTodo, deleteTodo, patchTodo } = HexApiCtx;

  const [ rowData, setRowData ] = useState<Todo[]>([]);
  const [ editDataId, setEditDataId ] = useState<string>('');
  const [ newTodo, setNewTodo ] = useState<string>('');

  const handleGetTodo = useCallback(async () => {
    try {
      const response = await getTodo();
      const data: Todo[] = response.data;
      setRowData(() => data);
    } catch (error) {
      console.error(error);
    }
  }, [getTodo]);
  // `useCallback` 是 React 中的一個 Hook，用於優化函數的創建和重建。它的主要用途是避免在每次渲染時重新創建函數，從而提高性能，特別是在函數被傳遞給子組件或用作依賴的情況下。
  /*
    在 React 中，依賴變化是指在 `useEffect`、`useCallback`、`useMemo` 等 Hook 的依賴列表中的變量或函數發生變化時，這些 Hook 會重新執行。這些依賴變化的情況包括：

    1. **狀態變化** (`useState`)：
      當你使用 `useState` 更新狀態時，這個狀態變量會變化。如果這個狀態變量在依賴列表中，相關的 Hook 會重新執行。

    2. **屬性變化** (`props`)：
      當父組件重新渲染並傳遞新的屬性給子組件時，這些屬性會變化。如果這些屬性在依賴列表中，相關的 Hook 會重新執行。

    3. **函數變化**：
      當函數在每次渲染時重新創建時，這些函數會變化。如果這些函數在依賴列表中，相關的 Hook 會重新執行。這也是為什麼我們使用 `useCallback` 來記憶化函數，避免不必要的重新創建。

    4. **上下文變化** (`useContext`)：
      當上下文中的值變化時，使用這個上下文的組件會重新渲染。如果這些上下文值在依賴列表中，相關的 Hook 會重新執行。
  */ 

  const handleCheckedStatus = () => {
    const rowDataCheckedStatus = rowData.filter((e)=> e.status === true);
    if ( rowDataCheckedStatus.length === 0 ) {
      return "unchecked"
    } else if ( rowDataCheckedStatus.length === rowData.length ) {
      return "checked"
    } else {
      return "indeterminate"
    }
  };

  const handlePostTodo = async () => {
    try {
      await postTodo(newTodo);
      setNewTodo('');
      handleGetTodo();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePatchTodo = async (id: string) => {
    try {
      await patchTodo(id);
      handleGetTodo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditContent = (content: string, id: string) => {
    setRowData((prev)=>{
      const newValue = [...prev];
      const findEdiitIndex =  newValue.findIndex((e)=>e.id === id);
      newValue[findEdiitIndex].content = content;

      return newValue
    })
  };

  const handlePutTodo = async (id: string) => {
    try {
      const data = rowData.find(e => e.id === id )
      if (data) {
        setEditDataId(()=>'');
        await putTodo(data.content, id);
      } else {
        handleGetTodo();
        throw new Error('發生錯誤: 找不到該編輯資料');
      }
    } catch (error) {
      handleGetTodo();
      console.error(error);
    }
  };

  const handleCheckAll = async () => {
    if (handleCheckedStatus() === "indeterminate") {
      const promises = rowData.map((e) => {
        if (e.status === false) {
          return handlePatchTodo(e.id);
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
    } else {
      const promises = rowData.map((e) => handlePatchTodo(e.id));
      await Promise.all(promises);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      handleGetTodo();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetTodo();
  }, [handleGetTodo]);

  return (
    <Container sx={{height:'100%'}} maxWidth="md">
      <Stack marginTop={3} spacing={2}>
        <Stack spacing={2} direction='row' >
          <TextField fullWidth id="outlined-basic" label="新增待辦事項" variant="outlined" value={newTodo} onChange={(e)=>setNewTodo(e.target.value)}/>
          <Button variant='contained' onClick={handlePostTodo}>送出</Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={handleCheckedStatus() === "checked"}
                    indeterminate={handleCheckedStatus() === "indeterminate"}
                    onClick={()=>handleCheckAll()}
                  />
                </TableCell>
                <TableCell sx={{ width: '60%' }}>待辦內容</TableCell>
                <TableCell align="right">建立時間</TableCell>
                <TableCell align="right">{editDataId === '' ? '編輯/刪除' : '確定/取消'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
            {rowData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', height: '200px' }}>
                    <h1>尚未有待辦事項</h1>
                  </TableCell>
                </TableRow>
              ) : (
                rowData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Checkbox checked={row.status} onClick={() => handlePatchTodo(row.id)}/>
                    </TableCell>
                    <TableCell>{editDataId === row.id ? <TextField value={row.content} onChange={(e)=>{handleEditContent(e.target.value, row.id)}}/> : <span>{row.content}</span>}</TableCell>
                    <TableCell align="right">{formatTimestampToDate(Number(row.createTime))}</TableCell>
                    <TableCell align="right">
                      {editDataId === row.id ? 
                      <>
                        <IconButton onClick={()=>handlePutTodo(row.id)}>
                          <CheckIcon/>
                        </IconButton>
                        <IconButton onClick={()=>setEditDataId('')}>
                          <ClearIcon />
                        </IconButton>
                      </> :
                      <>
                        <IconButton onClick={()=>setEditDataId(row.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={()=>handleDeleteTodo(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};