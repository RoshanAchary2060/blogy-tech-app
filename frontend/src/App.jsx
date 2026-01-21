import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/Homepage/homepage';
import Login from './components/Users/login';
import UserProfile from './components/Users/userProfile';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/user-profile' element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )
}