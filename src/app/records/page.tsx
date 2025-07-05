'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  useGetRecordsQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} from '@/lib/services/recordsApi';
import type {
  Record,
  CreateRecordRequest,
  UpdateRecordRequest,
} from '@/lib/services/recordsApi';

export default function RecordsPage() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [formData, setFormData] = useState<CreateRecordRequest>({
    userId: '',
    weight: undefined,
    hba1c: undefined,
    bloodSugar: undefined,
    systolicPressure: undefined,
    diastolicPressure: undefined,
    ldl: undefined,
    hdl: undefined,
    tg: undefined,
    recordDate: new Date().toISOString().split('T')[0],
  });

  const { data: records, isLoading, error } = useGetRecordsQuery();
  const [createRecord, { isLoading: isCreating }] = useCreateRecordMutation();
  const [updateRecord, { isLoading: isUpdating }] = useUpdateRecordMutation();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteRecordMutation();

  const handleOpenDialog = (record?: Record) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        userId: record.userId,
        weight: record.weight,
        hba1c: record.hba1c,
        bloodSugar: record.bloodSugar,
        systolicPressure: record.systolicPressure,
        diastolicPressure: record.diastolicPressure,
        ldl: record.ldl,
        hdl: record.hdl,
        tg: record.tg,
        recordDate: record.recordDate.split('T')[0],
      });
    } else {
      setEditingRecord(null);
      setFormData({
        userId: '',
        weight: undefined,
        hba1c: undefined,
        bloodSugar: undefined,
        systolicPressure: undefined,
        diastolicPressure: undefined,
        ldl: undefined,
        hdl: undefined,
        tg: undefined,
        recordDate: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
    setFormData({
      userId: '',
      weight: undefined,
      hba1c: undefined,
      bloodSugar: undefined,
      systolicPressure: undefined,
      diastolicPressure: undefined,
      ldl: undefined,
      hdl: undefined,
      tg: undefined,
      recordDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingRecord) {
        await updateRecord({
          id: editingRecord._id,
          data: formData as UpdateRecordRequest,
        }).unwrap();
      } else {
        await createRecord(formData).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('操作失敗:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除此記錄嗎？')) {
      try {
        await deleteRecord(id).unwrap();
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
        <Alert severity='error'>載入記錄資料失敗</Alert>
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
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => router.push('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <AssessmentIcon sx={{ mr: 2, color: 'background.paper' }} />
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 900, color: 'background.paper' }}
          >
            健康記錄管理
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
            健康記錄列表
          </Typography>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            新增記錄
          </Button>
        </Box>

        <Paper
          sx={{ borderRadius: 1, boxShadow: 2, bgcolor: 'background.paper' }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>使用者 ID</TableCell>
                  <TableCell>體重 (kg)</TableCell>
                  <TableCell>HbA1c (%)</TableCell>
                  <TableCell>血糖 (mg/dL)</TableCell>
                  <TableCell>血壓 (mmHg)</TableCell>
                  <TableCell>LDL (mg/dL)</TableCell>
                  <TableCell>HDL (mg/dL)</TableCell>
                  <TableCell>TG (mg/dL)</TableCell>
                  <TableCell>記錄日期</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records?.map(record => (
                  <TableRow key={record._id}>
                    <TableCell>{record.userId}</TableCell>
                    <TableCell>{record.weight || '-'}</TableCell>
                    <TableCell>{record.hba1c || '-'}</TableCell>
                    <TableCell>{record.bloodSugar || '-'}</TableCell>
                    <TableCell>
                      {record.systolicPressure && record.diastolicPressure
                        ? `${record.systolicPressure}/${record.diastolicPressure}`
                        : '-'}
                    </TableCell>
                    <TableCell>{record.ldl || '-'}</TableCell>
                    <TableCell>{record.hdl || '-'}</TableCell>
                    <TableCell>{record.tg || '-'}</TableCell>
                    <TableCell>
                      {record.recordDate
                        ? new Date(record.recordDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color='primary'
                        onClick={() => handleOpenDialog(record)}
                        disabled={isUpdating}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={() => handleDelete(record._id)}
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
          <DialogTitle>
            {editingRecord ? '編輯健康記錄' : '新增健康記錄'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label='使用者 ID'
                  fullWidth
                  variant='outlined'
                  value={formData.userId}
                  onChange={e =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  disabled={!!editingRecord}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='體重 (kg)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.weight || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      weight: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='HbA1c (%)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.hba1c || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      hba1c: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='血糖 (mg/dL)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.bloodSugar || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      bloodSugar: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='收縮壓 (mmHg)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.systolicPressure || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      systolicPressure: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='舒張壓 (mmHg)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.diastolicPressure || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      diastolicPressure: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='LDL (mg/dL)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.ldl || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      ldl: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='HDL (mg/dL)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.hdl || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      hdl: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='TG (mg/dL)'
                  type='number'
                  fullWidth
                  variant='outlined'
                  value={formData.tg || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      tg: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='記錄日期'
                  type='date'
                  fullWidth
                  variant='outlined'
                  value={formData.recordDate}
                  onChange={e =>
                    setFormData({ ...formData, recordDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button
              onClick={handleSubmit}
              variant='contained'
              disabled={isCreating || isUpdating || !formData.userId}
            >
              {isCreating || isUpdating
                ? '處理中...'
                : editingRecord
                  ? '更新'
                  : '新增'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
