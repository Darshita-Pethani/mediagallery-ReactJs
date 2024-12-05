import './App.css';
import Login from './components/login';
import MediaList from './components/media';
import Register from './components/register';

import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

const MainRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/media",
    element: <MediaList />,
  },
];

const Routes = () => useRoutes(MainRoutes);

const App = () => {
  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default App;
