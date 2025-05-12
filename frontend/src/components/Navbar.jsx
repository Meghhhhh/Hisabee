import { Link } from "react-router";
import { navLists, profileImg, logoImg } from "../constants/index1";
import { CgProfile } from "react-icons/cg";
import { CiBellOn } from "react-icons/ci";

const Navbar = () => {
  return (
    <header className="w-full px-3 py-5 sm:px-5 flex justify-center items-center">
      <nav className="flex w-full h-[25px] screen-max-width ">
        <Link to={"/home"}>
          <img src={logoImg} alt="logo-hisabee" width={37} height={25} />
        </Link>

        <div className="flex flex-1 justify-end items-center max-sm:hidden">
          {navLists.map((nav) =>
            nav === "Login" ? (
              <Link to={"/SignUp"}>
                <div
                  key={nav}
                  className="px-5 text-xl cursor-pointer text-white  hover:text-gray-400 transition-all"
                >
                  {nav}
                </div>{" "}
              </Link>
            ) : (
              <div
                key={nav}
                className="px-5 text-xl cursor-pointer text-white  hover:text-gray-400 transition-all"
              >
                {nav}
              </div>
            )
          )}
          <Link to={"/profile"}>
            <CgProfile className="text-white ml-5 p-0.5" size={32} />
          </Link>
          <Link to={"/Notifications"}>
            <CiBellOn className="text-white ml-5 p-0.5" size={32}  />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
