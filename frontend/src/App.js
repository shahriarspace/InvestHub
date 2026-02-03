import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StartupsPage from './pages/StartupsPage';
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return _jsx("div", { children: "Loading..." });
    }
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
};
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return _jsx("div", { children: "Loading..." });
    }
    return !isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/" });
};
const AppContent = () => {
    return (_jsxs(Router, { children: [_jsx(Navigation, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "/register", element: _jsx(PublicRoute, { children: _jsx(RegisterPage, {}) }) }), _jsx(Route, { path: "/startups", element: _jsx(ProtectedRoute, { children: _jsx(StartupsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] })] }));
};
const App = () => {
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(AuthProvider, { children: _jsx(AppContent, {}) })] }));
};
export default App;
