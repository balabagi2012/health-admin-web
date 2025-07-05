'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: { main: '#A97C50', contrastText: '#fff' }, // 陶壺棕
    secondary: { main: '#E6D3B3' }, // 淺米色
    background: { default: '#F7F3ED', paper: '#FFFDF8' },
    text: { primary: '#3E2C19', secondary: '#6D5C48' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Noto Sans TC, sans-serif',
    h6: { fontWeight: 700 },
    h4: { fontWeight: 900 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px 0 rgba(169, 124, 80, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#3E2C19',
          borderRadius: 2,
          fontSize: '1rem',
          paddingLeft: 0,
          paddingRight: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#A97C50',
            borderWidth: 2,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#A97C50',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8B5C2A', // 聚焦時主色加深
            borderWidth: 2.5,
          },
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
        input: {
          color: '#3E2C19',
          padding: '16.5px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#A97C50',
          fontWeight: 700,
          fontSize: '1rem',
          '&.Mui-focused': {
            color: '#8B5C2A',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#3E2C19',
          backgroundColor: '#fff',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
