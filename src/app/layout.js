import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
});

export const metadata = {
  title: "Opinor",
  description: "Écoutez vos clients, Faites grandir votre réputation.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="">
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}