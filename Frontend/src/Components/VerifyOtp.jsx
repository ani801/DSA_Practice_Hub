import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdVerifiedUser } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { Url } from "../App";

function VerifyOtp({ email, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(299);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setResendEnabled(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const response = await axios.post(`${Url}/api/auth/verify-otp`, { email, otp });
      if (response.data.success) {
        setOtp("");
        setVerifying(false);
        toast.success("OTP verified");
       onSuccess();
      }else{

        toast.error(response.data.message || "Invalid OTP");
        setVerifying(false);
      }
      // Redirect to reset password page
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("/api/auth/resend-otp", { email });
      toast.success("OTP resent");
      setSecondsLeft(countdownSeconds);
      setResendEnabled(false);
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <MdVerifiedUser className="mx-auto text-green-600 text-4xl" />
          <h2 className="text-2xl font-bold text-green-700 mt-2">Verify OTP</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter the OTP sent to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
          >
            {verifying ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Didn’t receive the OTP?{" "}
          {resendEnabled ? (
            <button onClick={handleResendOtp} className="text-green-600 hover:underline">
              Resend
            </button>
          ) : (
            <span className="text-gray-400">
              Resend in {secondsLeft} sec
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
