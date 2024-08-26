import { NAV_ELEMENTS } from "@/lib/constants";
import ToggleTheme from "@/components/shared/ToggleTheme";

const NavBar = () => {
  return (
    <nav className="flex h-[7%] md:h-[8%] items-center border-b dark:border-flip-border border-neutral-300 px-6 py-2 md:py-3 md:px-8 w-full">
      <ul className="flex items-center h-full w-full  justify-between">
        <li className="flex gap-1 font-amsterdam text-lg md:text-xl">
          <span className="dark:text-flip-text-primary text-neutral-900">
            Flip
          </span>
          <span className="text-amber-300">N'</span>
          <span className="dark:text-flip-text-primary text-neutral-900">
            Win
          </span>
        </li>
        <li className="flex items-center gap-2 md:gap-4 text-sm md:text-md">
          <ToggleTheme />
          {NAV_ELEMENTS.map((each) => (
            <a
              key={each.name}
              target="_blank"
              href={each.href}
              className="dark:hover:text-neutral-400 hover:text-black"
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
