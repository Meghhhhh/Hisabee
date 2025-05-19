import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logoImg } from '../constants/index1';
import { CiMobile1 } from 'react-icons/ci';
import axios from 'axios';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/resend-otp`,
        {
          email: localStorage.getItem('email'),
        },
      );
      toast.success('Email sent successfully!');
      setTimer(300);
      setCanResend(false);
    } catch (err) {
      toast.error('Failed to send email! Error: ', err);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/verify-otp`,
        {
          email: localStorage.getItem('email'),
          otp: otp.join(''),
        },
      );
      if (response.status < 300) {
        toast.success('Otp verified successfully, please login to continue', {
          autoClose: 3000,
        });
        localStorage.removeItem('email');
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      } else {
        toast.error('Failed to send otp', {
          autoClose: 5000,
        });
      }
      setCanResend(false);
    } catch (err) {
      toast.error('Failed to verify email! Error: ', err);
    }
  };

  useEffect(() => {
    // Start timer countdown
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = () => {
    const mins = Math.floor(timer / 60)
      .toString()
      .padStart(2, '0');
    const secs = (timer % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full bg-black overflow-hidden">
      <Link to={'/home'}>
        <img
          src={logoImg}
          alt="logo-hisabee"
          width={37}
          height={25}
          className="ml-5 pt-3"
        />
      </Link>

      <div className="bg-black flex justify-center items-center h-screen w-full">
        <div className="bg-[#181a21] h-[600px] w-[1000px] flex justify-center items-center flex-col ">
          <div className="text-gray-300 mb-5 text-4xl font-Motiva Sans h-10">
            Hisabee
          </div>
          <div className="bg-[#33353c] h-[70%] w-[80%] flex justify-center items-center flex-col">
            <div className="bg-[#2c2e33] w-[80%] h-[30%] flex justify-center items-center">
              <div className="flex gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={e => handleChange(e, index)}
                    maxLength="1"
                    className="w-12 h-12 text-white text-center border-b-2 bg-transparent"
                  />
                ))}
              </div>
            </div>

            <div className="text-white font-Motiva Sans text-2xl mt-7 flex justify-center items-center ">
              Enter The Code sent to your Email
              <CiMobile1 className="m-2" size={30} />
            </div>

            <div className="mt-4 text-white">
              Time remaining:{' '}
              <span className="text-[#1999ff] font-bold">{formatTime()}</span>
            </div>

            <button
              className="w-35 h-10 mt-7 bg-[#1999ff] px-4 py-2 rounded text-white cursor-pointer"
              onClick={handleVerify}
            >
              Verify
            </button>

            <div className="mt-5 text-white">
              Didn't get the email?{' '}
              {canResend ? (
                <button
                  onClick={resendOtp}
                  className="text-[#1999ff] underline"
                >
                  Resend
                </button>
              ) : (
                <span className="text-gray-400">
                  Resend available after timer ends
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
