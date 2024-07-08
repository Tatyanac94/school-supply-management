import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My School Supplies",
  description: "This list is for managing supplies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}> 
        <header className="w-full">
          <nav className="flex justify-center space-x-4">
            <Link href="/" className="text-white hover:text-blue-500">
              Home
            </Link>
            <Link href="/management" className="text-white hover:text-blue-500">
              Management
            </Link>
          </nav>
        </header>
        {children}
        <footer className="text-center">&copy; TC - School Supply Management - Module 3</footer>
      </body>
    </html>
  );
}
