import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const ProfileOverview = () => {
  const user = useSelector(state => state.user);
  return (
    <div className="font-[Montserrat] relative">
      {/* Avatar and Name */}
      <div className="flex items-center">
        <img
          src={user.avatar}
          alt="User avatar"
          className="w-52 h-52 rounded-full shadow-2xl border-4 border-black"
        />
        <h2 className="text-5xl font-bold ml-5 ">{user.name}</h2>
      </div>

      {/* Contact Section */}
      <div className="flex my-6 space-x-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 w-[50%] ">
          <div className="">
            <h4 className="text-sm text-gray-500 ">Email</h4>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="">
            <h4 className="text-sm text-gray-500">Phone</h4>
            <p className="font-medium">{user.phone || 'Not provided'}</p>
          </div>
          <div className="">
            <h4 className="text-sm text-gray-500">Payment Method</h4>
            <p className="font-medium">{user.payment_method || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Stats as buttons */}
      <div className="grid grid-cols-2 gap-4 text-center w-[50%] mt-6">
        <button
          className="w-full px-4 py-6 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md flex flex-col items-center"
          style={{ minHeight: '80px' }}
          disabled
        >
          <span className="text-10px font-bold text-white/80 mb-1">Total Expenses</span>
          <span className="text-2xl font-bold">{user.totalExpenses}</span>
        </button>
        <button
          className="w-full px-4 py-6 text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-md flex flex-col items-center"
          style={{ minHeight: '80px' }}
          disabled
        >
          <span className="text-10px font-bold text-white/80 mb-1">Groups</span>
          <span className="text-2xl font-bold">{user.groups}</span>
        </button>
      </div>

      {/* Edit Button styled as + New Hisab */}
      <div className="absolute top-2.5 right-1.5">
        <Link to={"/edit"}>
          <button className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-base flex items-center gap-2">
            Edit Info
          </button>
        </Link>
      </div>

      <div className="absolute top-18 right-1.5">
        <h4 className="text-lg text-gray-500 text-center">QR code</h4>
        <img
          src="/Subject2.png"
          alt=""
          className="border-4 border-black h-[250px] mx-auto"
        />
      </div>
    </div>
  );
};

export default ProfileOverview;
