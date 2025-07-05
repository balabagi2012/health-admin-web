'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/lib/services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/slices/authSlice';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: result,
          token: 'mock-token-' + Date.now(), // 暫時使用模擬 token
        })
      );
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'data' in err
          ? (err.data as { message?: string })?.message
          : '登入失敗，請檢查您的帳號密碼';
      setError(errorMessage || '登入失敗，請檢查您的帳號密碼');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container component='main' maxWidth='xs'>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 4,
            boxShadow: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            component='h1'
            variant='h5'
            sx={{ fontWeight: 900, color: 'primary.main' }}
          >
            健康管理系統
          </Typography>
          <Typography
            component='h2'
            variant='h6'
            sx={{ mt: 1, mb: 3, fontWeight: 700, color: 'text.secondary' }}
          >
            請登入您的帳號
          </Typography>
          {error && (
            <Alert severity='error' sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='電子郵件'
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='密碼'
              type='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px #fff inset',
                    '-webkit-text-fill-color': '#3E2C19',
                    'border-radius': '2px',
                  },
                  '& input:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px #fff inset',
                  },
                  '& input:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px #fff inset',
                  },
                },
              }}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              sx={{ mt: 3, mb: 2, fontWeight: 700, borderRadius: 2 }}
              disabled={isLoading}
            >
              {isLoading ? '登入中...' : '登入'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
