const Footer = () => {
  return (
    <footer className="bg-white text-sm text-darkblue py-4">
      <div>
        <div className="flex flex-col px-24 md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="mb-4 md:mb-0 w-full md:w-1/3">
            <h3 className="text-base font-bold mb-1">Contact Us</h3>
            <p className="mb-1">Henleykaai 84, 9000 Ghent</p>
            <p className="mb-1">Opening Hours:</p>
            <p className="mb-0">Monday - Friday: 9:00 AM - 6:00 PM</p>
          </div>
          <div className="mb-4 md:mb-0 w-full md:w-1/3">
            <h3 className="text-base font-bold mb-1">Tech Stack</h3>
            <ul className="mb-0">
              <li className="mb-1">C# &#8226; .NET</li>
              <li className="mb-1">React &#8226; Tailwind CSS</li>
              <li className="mb-1">SQL Server</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-bold mb-1">Our Team</h3>
            <ul className="mb-0">
              <li className="mb-1">Almendrit Sadriu &#8226; Muhammed Utkucu</li>
              <li className="mb-1">Orlando Mollaert &#8226; Selin Esgin</li>
              <li className="mb-1">Thomas Luyckx</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-4 pt-3 text-center">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Hogeschool Gent. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
