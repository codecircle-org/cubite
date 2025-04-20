import { Inter } from "next/font/google";
import AuthProvider from "@/app/(dashboard)/auth/Provider";
import "../globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" data-theme="night">
      <body className="max-w-screen-2xl items-center mx-auto">
        <AuthProvider>
          <Navbar />
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
