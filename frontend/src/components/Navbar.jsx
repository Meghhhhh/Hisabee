
import { navLists, profileImg,logoImg } from '../constants/index1';

const Navbar = () => {
  return (
    <header className="w-full px-5 py-5 sm:px-10 px-5 flex justify-center items-center">
      <nav className="flex w-full screen-max-width ">
        <img src={logoImg} alt="Apple" width={100} height={50}  />

        <div className="flex flex-1 justify-end max-sm:hidden">
        
          {navLists.map((nav) => (
            <div key={nav} className="px-5 text-xl cursor-pointer text-gray-400 hover:text-white transition-all">
              {nav}
            </div>
          ))}
          <img src={profileImg } alt="profile" width={30} height={30}  />
        </div>
        
       
      </nav>
    </header>
  )
}

export default Navbar