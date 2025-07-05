'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { RootState } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // 檢查登入狀態並重定向
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      <Typography
        variant='h6'
        sx={{ mt: 2, color: 'primary.main', fontWeight: 700 }}
      >
        正在檢查登入狀態...
      </Typography>
    </Box>
  );
}
