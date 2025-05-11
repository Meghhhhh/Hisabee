import { Link } from 'react-router';
import { navLists, profileImg,logoImg } from '../constants/index1';
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  return (
    <header className="w-full px-5 py-5 sm:px-10 flex justify-center items-center">
      <nav className="flex w-full screen-max-width ">
        <Link to={"/home"}>
        <img src={logoImg} alt="Apple" width={50} height={30}  />
        </Link>

        <div className="flex flex-1 justify-end items-center max-sm:hidden">
        
          {navLists.map((nav) => (
            <div key={nav} className="px-5 text-xl cursor-pointer text-white  hover:text-gray-400 transition-all">
              {nav}
            </div>
          ))}
          <Link to={"/profile"}>
          <CgProfile className='text-white ml-5 p-0.5' size={35} />
          </Link>
        </div>
        
       
      </nav>
    </header>
  )
}

export default Navbar