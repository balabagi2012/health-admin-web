'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/lib/services/usersApi';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/lib/services/usersApi';

export default function UsersPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    lineId: '',
    name: '',
    birthday: '',
    gender: '',
    height: '',
    chronicIllness: [],
  });

  const { data: users, isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        lineId: user.lineId,
        name: user.name,
        birthday: user.birthday || '',
        gender: user.gender || '',
        height: user.height || '',
        chronicIllness: user.chronicIllness || [],
      });
    } else {
      setEditingUser(null);
      setFormData({
        lineId: '',
        name: '',
        birthday: '',
        gender: '',
        height: '',
        chronicIllness: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      lineId: '',
      name: '',
      birthday: '',
      gender: '',
      height: '',
      chronicIllness: [],
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await updateUser({
          lineId: editingUser.lineId,
          data: formData as UpdateUserRequest,
        }).unwrap();
      } else {
        await createUser(formData).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('操作失敗:', error);
    }
  };

  const handleDelete = async (lineId: string) => {
    if (window.confirm('確定要刪除此使用者嗎？')) {
      try {
        await deleteUser(lineId).unwrap();
      } catch (error) {
        console.error('刪除失敗:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Alert severity='error'>載入使用者資料失敗</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <AppBar
        position='static'
        color='primary'
        elevation={2}
        sx={{
          borderRadius: 0,
          boxShadow: '0 2px 8px 0 rgba(169, 124, 80, 0.08)',
        }}
      >
        <Toolbar>
          <PeopleIcon sx={{ mr: 2, color: 'background.paper' }} />
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 900, color: 'background.paper' }}
          >
            使用者管理
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ mt: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant='h4'
            component='h1'
            sx={{ fontWeight: 900, color: 'primary.main' }}
          >
            使用者列表
          </Typography>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            新增使用者
          </Button>
        </Box>

        <Paper
          sx={{ borderRadius: 1, boxShadow: 2, bgcolor: 'background.paper' }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Line ID</TableCell>
                  <TableCell>姓名</TableCell>
                  <TableCell>生日</TableCell>
                  <TableCell>性別</TableCell>
                  <TableCell>建立時間</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map(user => (
                  <TableRow key={user.lineId}>
                    <TableCell>{user.lineId}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.birthday
                        ? new Date(user.birthday).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>{user.gender || '-'}</TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString('zh-TW')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color='primary'
                        onClick={() => handleOpenDialog(user)}
                        disabled={isUpdating}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={() => handleDelete(user.lineId)}
                        disabled={isDeleting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* 新增/編輯對話框 */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>{editingUser ? '編輯使用者' : '新增使用者'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Line ID'
              fullWidth
              variant='outlined'
              value={formData.lineId}
              onChange={e =>
                setFormData({ ...formData, lineId: e.target.value })
              }
              disabled={!!editingUser} // 編輯時不允許修改 lineId
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='姓名'
              fullWidth
              variant='outlined'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='生日'
              type='date'
              fullWidth
              variant='outlined'
              value={formData.birthday}
              onChange={e =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='性別'
              fullWidth
              variant='outlined'
              value={formData.gender}
              onChange={e =>
                setFormData({ ...formData, gender: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='身高 (cm)'
              fullWidth
              variant='outlined'
              value={formData.height}
              onChange={e =>
                setFormData({ ...formData, height: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='慢性病 (用逗號分隔)'
              fullWidth
              variant='outlined'
              value={formData.chronicIllness?.join(', ') || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  chronicIllness: e.target.value
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item),
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button
              onClick={handleSubmit}
              variant='contained'
              disabled={isCreating || isUpdating || !formData.lineId}
            >
              {isCreating || isUpdating
                ? '處理中...'
                : editingUser
                  ? '更新'
                  : '新增'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
