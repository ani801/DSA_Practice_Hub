import { useState } from 'react';
import ForgotPassword from '../Components/ForgotPassword';
import VerifyOtp from '../Components/VerifyOtp';
import ResetPassword from '../Components/ResetPassword';


const RecoverAccount = () => {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(''); // For OTP or reset if needed

  const goToOtp = () => setStep('otp');
  const goToReset = () => setStep('reset');

  return (
    // <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
    <>
      {step === 'email' && (
        <ForgotPassword onSuccess={(email) => { setEmail(email); goToOtp(); }} />
      )}

      {step === 'otp' && (
        <VerifyOtp email={email} onSuccess={() => goToReset()} />
      )}

      {step === 'reset' && (
        <ResetPassword email={email} />
      )}
    </>
  );
}
export default RecoverAccount;
