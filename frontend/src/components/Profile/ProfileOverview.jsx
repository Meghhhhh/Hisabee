const ProfileOverview = ({ user }) => (
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

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4 text-center w-[50%]">
      <div className="bg-gray-100 rounded-xl p-4">
        <h4 className="text-sm text-gray-500">Total Expenses</h4>
        <p className="text-xl font-bold">{user.totalExpenses}</p>
      </div>
      <div className="bg-gray-100 rounded-xl p-4">
        <h4 className="text-sm text-gray-500">Groups</h4>
        <p className="text-xl font-bold">{user.groups}</p>
      </div>
    </div>

    {/* Edit Button */}
    <div className="absolute top-2.5 right-1.5">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
        Edit Info
      </button>
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

export default ProfileOverview;
