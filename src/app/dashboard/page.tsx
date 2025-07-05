'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProfileQuery } from '@/lib/services/authApi';
import { logout } from '@/lib/slices/authSlice';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Logout,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import type { RootState } from '@/lib/store';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const { data: currentUser, isLoading } = useGetProfileQuery(
    user?.email || '',
    {
      skip: !isAuthenticated || !user?.email,
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
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
        <Typography>載入中...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
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
          <DashboardIcon sx={{ mr: 2, color: 'background.paper' }} />
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 900, color: 'background.paper' }}
          >
            健康管理系統
          </Typography>
          <Typography variant='body1' sx={{ mr: 2, color: 'background.paper' }}>
            歡迎，{currentUser?.name || user?.name}
          </Typography>
          <Button
            color='secondary'
            variant='contained'
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{ fontWeight: 700 }}
          >
            登出
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ mt: 6 }}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 900, color: 'primary.main' }}
        >
          儀表板
        </Typography>

        <Paper
          sx={{ mt: 4, p: 4, background: 'background.paper', boxShadow: 2 }}
        >
          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontWeight: 700, color: 'primary.main' }}
          >
            系統概覽
          </Typography>
          <Typography variant='body1' sx={{ mb: 3, color: 'text.secondary' }}>
            歡迎使用健康管理系統。這是一個完整的健康管理平台，提供用戶管理、健康記錄追蹤等功能。
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 6, bgcolor: 'secondary.main' },
                  transition: '0.2s',
                }}
                onClick={() => router.push('/users')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <PeopleIcon
                    sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                  />
                  <Typography variant='h6' fontWeight={700}>
                    使用者管理
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    管理系統使用者
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 6, bgcolor: 'secondary.main' },
                  transition: '0.2s',
                }}
                onClick={() => router.push('/records')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <AssessmentIcon
                    sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                  />
                  <Typography variant='h6' fontWeight={700}>
                    健康記錄
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    管理健康記錄
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 6, bgcolor: 'secondary.main' },
                  transition: '0.2s',
                }}
                onClick={() => router.push('/system-configs')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <SettingsIcon
                    sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                  />
                  <Typography variant='h6' fontWeight={700}>
                    系統配置
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    管理系統設定
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
