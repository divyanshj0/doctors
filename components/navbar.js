// components/NavBar.js
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
      <div className="flex items-center gap-4 text-white mr-6">
        <Image src={'/logo.svg'} width={50} height={10} alt="logo" className="invert w-auto h-[40px]" />
        <span className="font-semibold text-xl tracking-tight"> Appointments</span>
      </div>
      <div className="  flex items-center w-auto absolute top-3 right-6">
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0"
          >
            Logout
          </button>
        ) : (
          <Link href="/login"className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0">
              Login
            
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

