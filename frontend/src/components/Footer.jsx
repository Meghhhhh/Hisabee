

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 ">
      <div className="mx-auto flex flex-col md:flex-row justify-between px-2">
        <p className="text-sm">&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
