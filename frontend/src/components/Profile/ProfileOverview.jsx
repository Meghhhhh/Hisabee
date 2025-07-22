import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const ProfileOverview = () => {
  const user = useSelector(state => state.user);
  return (
    <div className="font-[Montserrat] relative">
      {/* Avatar and Name */}
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img
          src={user.avatar}
          alt="User avatar"
          className="w-32 h-32 md:w-52 md:h-52 rounded-full shadow-2xl border-4 border-black"
        />
        <h2 className="text-3xl md:text-5xl font-bold mt-4 md:mt-15 md:ml-5 ">
          {user.name}
        </h2>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row my-6 md:space-x-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 w-full md:w-[50%] ">
          <div className="">
            <h4 className="text-sm text-gray-500 ">Email</h4>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="">
            <h4 className="text-sm text-gray-500">Phone</h4>
            <p className="font-medium">{user.phone_number || 'Not provided'}</p>
          </div>
          <div className="">
            <h4 className="text-sm text-gray-500">Payment Method</h4>
            <p className="font-medium">{user.payment_method || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Edit Button styled as + New Hisab */}
      <div className="absolute top-2.5 right-1.5 md:static md:mt-6 md:flex">
        <Link to={'/edit'}>
          <button className="px-4 md:px-5 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm md:text-base flex items-center gap-2">
            Edit Info
          </button>
        </Link>
      </div>

      <div className="mt-8 md:absolute md:top-18 md:right-1.5 w-full md:w-auto flex flex-col items-center">
        <h4 className="text-base md:text-lg text-gray-500 text-center">
          QR code
        </h4>
        <img
          src="/Subject2.png"
          alt=""
          className="border-4 border-black h-40 md:h-[250px] mx-auto"
        />
      </div>
    </div>
  );
};

export default ProfileOverview;
