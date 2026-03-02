import { FC } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white text-center text-xs text-gray-500 py-3 border-t border-gray-200">
      © {currentYear} APF Service Portal Admin. All rights reserved.
    </footer>
  );
};

export default Footer;
