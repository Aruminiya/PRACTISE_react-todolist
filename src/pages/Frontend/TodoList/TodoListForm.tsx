import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Stack, Button } from '@mui/material';

import { useEffect, useState, useContext } from 'react';
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

  const handleGetTodo = async () => {
    try {
      const response = await getTodo();
      const data: Todo[] = response.data;
      setRowData(() => data);
    } catch (error) {
      console.error(error);
    }
  };

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
  }

  useEffect(() => {
    handleGetTodo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <> 
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
    </>
  );
};