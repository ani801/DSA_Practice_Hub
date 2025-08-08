import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMail } from "react-icons/fi"; // email icon
import { FaSpinner } from "react-icons/fa"; // spinner icon
import { Url } from "../App";


function ForgotPassword({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     const response = await axios.post(`${Url}/api/auth/request-otp`, { email });
      if (response.data.success) {
      onSuccess(email);
      setEmail("");
      setLoading(false);
      toast.success("OTP sent to your email");
      }else{
        toast.error(response.data.message || "Failed to send OTP");
        setLoading(false);
      }
     
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <FiMail className="mx-auto text-purple-600 text-4xl" />
          <h2 className="text-2xl font-bold text-purple-700 mt-2">Forgot Password?</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter your registered email to receive an OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Go back to login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
