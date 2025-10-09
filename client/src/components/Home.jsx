import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/usersSlice"; // adjust path if needed

const navigation = [{ name: "Movies", href: "/", current: true }];

const userNavigation = [
  { name: "Your profile", href: "/profile" },
  { name: "Sign out" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home({ children, title }) {
  const url = "https://bookmyseat-backend.onrender.com"
  const user = useSelector((state) => state.users.user);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Logout API call
  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken")
      const response = await fetch(`${url}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      dispatch(setUser({})); // clear Redux state

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="min-h-full">
        {/* NAVBAR */}
        <Disclosure as="nav" className="bg-gray-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-10 w-10"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "bg-gray-950/70 text-white shadow-lg"
                            : "text-gray-200 hover:bg-red-600 hover:text-white",
                          "rounded-lg px-6 py-4 text-xl font-extrabold tracking-wide transition-all duration-150"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="hidden md:flex items-center space-x-6 md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full p-2 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-10 w-10 rounded-full outline-1 outline-white/20"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline-1 outline-white/20">
                    {userNavigation.map((item) =>
                      item.name === "Sign out" ? (
                        <MenuItem key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-white/10" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-300"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </MenuItem>
                      ) : (
                        <MenuItem key={item.name}>
                          {({ active }) => (
                            <Link
                              to={item.href}
                              className={classNames(
                                active ? "bg-white/10" : "",
                                "block px-4 py-2 text-sm text-gray-300"
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      )
                    )}
                  </MenuItems>
                </Menu>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex md:hidden  ">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-red-500 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-open:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-open:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <DisclosurePanel className="md:hidden">
            <div className="space-y-2 px-2 pt-4 pb-6 sm:px-6">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-950/80 text-white shadow"
                      : "text-gray-200 hover:bg-red-600 hover:text-white",
                    "block rounded-lg px-8 py-4 text-2xl font-extrabold tracking-wide transition-all duration-150"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="h-12 w-12 rounded-full outline-1 outline-white/20"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user?.role}
                  </div>
                  <div className="text-sm font-medium text-slate-300">
                    {user?.email || "guest@example.com"}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) =>
                  item.name === "Sign out" ? (
                    <DisclosureButton
                      key={item.name}
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left rounded-lg px-6 py-3 text-base font-extrabold text-white hover:bg-red-600 hover:text-white transition"
                    >
                      Sign out
                    </DisclosureButton>
                  ) : (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className="block rounded-lg px-6 py-3 text-base font-extrabold text-white hover:bg-red-600 hover:text-white transition"
                    >
                      {item.name}
                    </DisclosureButton>
                  )
                )}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* PAGE HEADER */}
        <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main>
          <div className="mx-auto max-w-9xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
