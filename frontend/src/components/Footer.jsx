// import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-darkblue mt-10 py-4 bottom-0 w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-evenly">
        <div className="mb-4">
          <h3 className="text-base font-bold mb-1">Contact Us</h3>
          <p className="mb-1">Henleykaai 84, 9000 Gent</p>
          <p className="mb-1">Opening Hours:</p>
          <p className="mb-0">Monday - Friday: 09:00 - 18:00</p>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="text-base font-bold mb-1">Tech Stack</h3>
          <ul className="mb-0">
            <li className="mb-1">C# .Net</li>
            <li className="mb-1">React</li>
            <li className="mb-1">MySQL Server</li>
            <li className="mb-1">TailwindCSS</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-bold mb-1">Our Team</h3>
          <ul className="mb-0">
            <li className="mb-1">Almendrit Sadriu</li>
            <li className="mb-1">Thomas Luyckx</li>
            <li className="mb-1">Muhammed Utkucu</li>
            <li className="mb-1">Orlando Mollaert</li>
            <li className="mb-1">Selin Esgin</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-4 pt-2 text-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Hogeschool Gent. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
