import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // choisis les graisses que tu veux
  variable: "--font-poppins",
});

export const metadata = {
  title: "Opinor",
  description: "Écoutez vos clients, Faites grandir votre réputation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
