import { signimg } from '../constants/index1'
import Registrationform from '../components/Registrationform'


const Register = () => {
  return (
    <div className="bg-black flex h-screen w-full"> 
    <div className="w-full [@media(min-width:1080px)]:w-[35%] [@media(max-width:1079px)]:hidden h-full">
        <img src={signimg} alt="Sign Up" className='w-full h-full object-cover' />
    </div>
    <div className=" w-[65%] h-full flex items-center justify-center text-white">

    <Registrationform />
    </div>

    
    </div>
  )
}

export default Register