import React, { useState } from 'react';
import { Link } from "react-router";
import { navLists, profileImg, logoImg } from "../constants/index1";
import { CiMobile1 } from "react-icons/ci";

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '','','']);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Keep only the last digit
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className='w-full  bg-black overflow-hidden'>
         <Link to={"/home"}>
          <img src={logoImg} alt="logo-hisabee" width={37} height={25} className='ml-5 pt-3' />
        </Link>


    <div className='bg-black flex justify-center items-center h-screen w-full'>
        <div className='bg-[#181a21] h-[600px] w-[1000px] flex justify-center items-center flex-col '>
            <div className='text-gray-300 mb-5 text-4xl font-Motiva Sans h-10'>Hisabee</div>
            <div className='bg-[#33353c] h-[70%] w-[80%]  flex justify-center items-center flex-col'>
                <div className='bg-[#2c2e33] w-[80%] h-[30%] flex justify-center items-center'>
                <div className="flex gap-2">
                      {otp.map((digit, index) => (
                            <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        maxLength="1"
                        className="w-12 h-12 text-white text-center border-b-2"
                        />
                    ))}
                 </div>    

                </div>
                <div className='text-white font-Motiva Sans text-2xl mt-7 flex justify-center items-center '>
                    Enter The Code sent to your Email
                    <CiMobile1 className='m-2' size={30} />
                </div>
                <button className="w-35 h-10 mt-7 bg-[#1999ff] cursor-pointer">
                Send
            </button>

            </div>
        </div>

    </div>
        </div>
  );
};

export default OTP;
