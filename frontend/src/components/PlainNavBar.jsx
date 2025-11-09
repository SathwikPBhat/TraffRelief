import logo from "../assets/logo.png";

function PlainNavBar() {
  return (
    <header className="w-full top-0 h-16 p-4 flex items-center bg-teal-800 text-white font-medium font-['QuickSand'] lg:text-2xl">
      <div className="flex items-center gap-2">
        <img src={logo} alt="TraffRelief logo" className="w-8 h-8 max-w-full" />
      </div>
    </header>
  );
}

export default PlainNavBar;
