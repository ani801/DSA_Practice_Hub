
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Page/LandingPage';
import Register from './Page/Register';
import Login from './Page/Login';
import DsaPractice from './Page/DsaPractice';
import AddProblem from './Page/AddProblem';
import RecoverAccount from './Page/RecoverAccount';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImportancePage from './Page/ImportancePage';
import ProfilePage from './Page/ProfilePage';
import ProblemNote from './Components/ProblemNote';
import AddProblemGuide from './Page/AddProblemGuide';
const _apiUrl = import.meta.env.VITE_API_URL;
if (!_apiUrl) console.error("VITE_API_URL is not set — all API calls will fail. Add it to your .env file.");
export const Url = _apiUrl || "";
function App() {


  return (
    <>
     <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        {/* <Route path="/calendar" element={<CustomCalendar/>} /> */}
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dsa-practice" element={<DsaPractice/>} />
        <Route path='/add-problem' element={<AddProblem/>} />
        <Route path='/importance' element={<ImportancePage/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-problem-guide" element={<AddProblemGuide />} />
        <Route path="/problem-note" element={<ProblemNote />} />
        <Route path="/forgot-password" element={<RecoverAccount />} />
        {/* Add more routes as needed */}
       
      </Routes>
     </>
  )
}

export default App
