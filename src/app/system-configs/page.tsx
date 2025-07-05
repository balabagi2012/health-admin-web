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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  useGetSystemConfigsQuery,
  useCreateSystemConfigMutation,
  useUpdateSystemConfigMutation,
  useDeleteSystemConfigMutation,
} from '@/lib/services/systemConfigsApi';
import type {
  SystemConfig,
  CreateSystemConfigRequest,
  UpdateSystemConfigRequest,
} from '@/lib/services/systemConfigsApi';

export default function SystemConfigsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [formData, setFormData] = useState<CreateSystemConfigRequest>({
    key: '',
    value: '',
    description: '',
    type: 'string',
    isActive: true,
  });

  const { data: configs, isLoading, error } = useGetSystemConfigsQuery();
  const [createConfig, { isLoading: isCreating }] =
    useCreateSystemConfigMutation();
  const [updateConfig, { isLoading: isUpdating }] =
    useUpdateSystemConfigMutation();
  const [deleteConfig, { isLoading: isDeleting }] =
    useDeleteSystemConfigMutation();

  const handleOpenDialog = (config?: SystemConfig) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        key: config.key,
        value: config.value,
        description: config.description || '',
        type: config.type || 'string',
        isActive: config.isActive ?? true,
      });
    } else {
      setEditingConfig(null);
      setFormData({
        key: '',
        value: '',
        description: '',
        type: 'string',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingConfig(null);
    setFormData({
      key: '',
      value: '',
      description: '',
      type: 'string',
      isActive: true,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingConfig) {
        await updateConfig({
          key: editingConfig.key,
          data: formData as UpdateSystemConfigRequest,
        }).unwrap();
      } else {
        await createConfig(formData).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('操作失敗:', error);
    }
  };

  const handleDelete = async (key: string) => {
    if (window.confirm('確定要刪除此配置嗎？')) {
      try {
        await deleteConfig(key).unwrap();
      } catch (error: unknown) {
        console.error('刪除失敗:', error);
      }
    }
  };

  const truncateValue = (value: string, maxLength: number = 50) => {
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + '...';
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
        <Alert severity='error'>載入系統配置失敗</Alert>
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
          <SettingsIcon sx={{ mr: 2, color: 'background.paper' }} />
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 900, color: 'background.paper' }}
          >
            系統配置管理
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
            系統配置列表
          </Typography>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            新增配置
          </Button>
        </Box>

        <Paper
          sx={{ borderRadius: 1, boxShadow: 2, bgcolor: 'background.paper' }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>配置鍵</TableCell>
                  <TableCell>配置值</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>類型</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>建立時間</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {configs?.map(config => (
                  <TableRow key={config.key}>
                    <TableCell>
                      <Chip label={config.key} size='small' color='primary' />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {truncateValue(config.value)}
                      </Typography>
                    </TableCell>
                    <TableCell>{config.description || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={config.type || 'string'}
                        size='small'
                        color={config.type === 'json' ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={config.isActive ? '啟用' : '停用'}
                        size='small'
                        color={config.isActive ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      {config.createdAt
                        ? new Date(config.createdAt).toLocaleString('zh-TW')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color='primary'
                        onClick={() => handleOpenDialog(config)}
                        disabled={isUpdating}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={() => handleDelete(config.key)}
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
          maxWidth='md'
          fullWidth
        >
          <DialogTitle>{editingConfig ? '編輯配置' : '新增配置'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='配置鍵'
              fullWidth
              variant='outlined'
              value={formData.key}
              onChange={e => setFormData({ ...formData, key: e.target.value })}
              disabled={!!editingConfig} // 編輯時不允許修改 key
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='配置值'
              fullWidth
              variant='outlined'
              multiline
              rows={4}
              value={formData.value}
              onChange={e =>
                setFormData({ ...formData, value: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin='dense'
              label='描述'
              fullWidth
              variant='outlined'
              multiline
              rows={2}
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin='dense' sx={{ mb: 2 }}>
              <InputLabel>類型</InputLabel>
              <Select
                value={formData.type}
                label='類型'
                onChange={e =>
                  setFormData({
                    ...formData,
                    type: e.target.value as unknown as
                      | 'string'
                      | 'number'
                      | 'boolean'
                      | 'json',
                  })
                }
              >
                <MenuItem value='string'>字串</MenuItem>
                <MenuItem value='number'>數字</MenuItem>
                <MenuItem value='boolean'>布林值</MenuItem>
                <MenuItem value='json'>JSON</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={e =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label='啟用'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button
              onClick={handleSubmit}
              variant='contained'
              disabled={
                isCreating || isUpdating || !formData.key || !formData.value
              }
            >
              {isCreating || isUpdating
                ? '處理中...'
                : editingConfig
                  ? '更新'
                  : '新增'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
