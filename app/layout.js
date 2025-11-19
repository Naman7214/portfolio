import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata = {
  title: "Naman Agnihotri | Terminal Portfolio",
  description: "Interactive Terminal Portfolio of Naman Agnihotri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
