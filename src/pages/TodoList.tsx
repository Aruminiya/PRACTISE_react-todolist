import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Stack, Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const token: string = JSON.parse(localStorage.getItem('userData')!).token;

// 取得待辦事項
async function getTodo() {
  try {
    const result = await axios.get(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos`,{
      headers: {
        Authorization: token
      }
    })
    const { data } = result.data
    return data
  } catch(error) {
    console.error(error);
    throw error
  }
};

// 新增待辦事項
async function postTodo(content: string) {
  try {
    const result = await axios.post(`${import.meta.env.VITE_HEX_TODOLIST_HOST}/todos`,
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

// 定義待辦事項的接口
interface Todo {
  id: string;
  status: boolean;
  content: string;
  createTime: string;
}

export default function TodoList() {
  const [ rowData, setRowData ] = useState<Todo[]>([]);
  const [ editDataId, setEditDataId ] = useState<string>('');
  const [ newTodo, setNewTodo ] = useState<string>('');

  const handleGetTodo = async () => {
    try {
      const data = await getTodo();
      setRowData(() => data);
    } catch (error) {
      console.error(error);
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
  }

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
                  <TableCell>完成</TableCell>
                  <TableCell sx={{ width: '60%' }}>待辦內容</TableCell>
                  <TableCell align="right">建立時間</TableCell>
                  <TableCell align="right">編輯/刪除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Checkbox checked={row.status} onClick={() => handlePatchTodo(row.id)}/>
                    </TableCell>
                    <TableCell>{editDataId === row.id ? <TextField value={row.content} onChange={(e)=>{handleEditContent(e.target.value, row.id)}}/> : <span>{row.content}</span>}</TableCell>
                    <TableCell align="right">{row.createTime}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

      </Container>
    </>
  );
};