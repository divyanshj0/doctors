// components/NavBar.js
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex md:items-center  flex-wrap bg-blue-500 py-6 px-2">
      <div className="flex items-center gap-4 text-white mr-6">
        <Image src={'/logo.svg'} width={50} height={10} alt="logo" className="invert w-auto h-[40px]" />
        <div className=" flex text-lg lg:flex-grow">
          <Link href="/" className="block  lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
              Home
          </Link>
          {isAuthenticated && (
            <Link href="/viewAppointments" className="block  lg:inline-block lg:mt-0 text-blue-200 hover:text-white">
                View Appointments
            </Link>
          )}
        </div>
      </div>
      <div className="w-full  flex items-center ">
        
        {isAuthenticated ? (
          <button onClick={logout} className="absolute top-4 right-5 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0">
            Logout
          </button>
        ) : (
          <Link href="/login" className="absolute top-4 right-5 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0">
              Login
                          
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

