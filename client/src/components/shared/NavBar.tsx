import { NAV_ELEMENTS } from "@/lib/constants";

const NavBar = () => {
  return (
    <nav className="flex h-[7%] md:h-[8%] items-center border-b border-flip-border px-6 py-2 md:py-3 md:px-8 w-full">
      <ul className="flex items-center h-full w-full  justify-between">
        <li className="flex gap-1 font-amsterdam text-lg md:text-xl">
          <span className="text-flip-text-primary">Flip</span>
          <span className="text-amber-300">N'</span>
          <span className="text-flip-text-primary">Win</span>
        </li>
        <li className="flex items-center gap-2 md:gap-4 text-sm md:text-md">
          {NAV_ELEMENTS.map((each) => (
            <a
              key={each.name}
              target="_blank"
              href={each.href}
              className="hover:text-neutral-400"
            >
              {each.name}
            </a>
          ))}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
