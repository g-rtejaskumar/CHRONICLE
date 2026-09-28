import React, { useEffect, useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "All Posts", slug: "/all-posts", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ].filter((item) => item.active);

  const go = (slug) => {
    setMenuOpen(false);
    navigate(slug);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "border-b border-white/10 bg-[#05060c]/90 py-2.5 shadow-[0_18px_50px_-30px_rgba(139,92,246,1)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <Container>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="group relative flex shrink-0 items-center gap-3"
            aria-label="Chronicle home"
          >
            <span className="relative block rounded-2xl bg-white/95 p-1.5 shadow-[0_10px_30px_-14px_rgba(34,211,238,0.9)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
              <Logo width="42px" />
              <span className="absolute inset-0 rounded-2xl ring-1 ring-white/40" />
            </span>
            <span className="font-display hidden text-lg font-extrabold tracking-tight text-white sm:block">
              Chron<span className="text-gradient-static">icle</span>
            </span>
          </Link>

          <ul className="ml-auto hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => go(item.slug)}
                  data-active={location.pathname === item.slug}
                  className="nav-link px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  {item.name}
                </button>
              </li>
            ))}
            {authStatus && (
              <>
                {userData && (
                  <li className="hidden items-center pl-2 lg:flex">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 px-3 text-xs text-slate-300 backdrop-blur-md">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-bold text-white uppercase">
                        {userData.name ? userData.name.charAt(0) : "U"}
                      </span>
                      <span className="max-w-[110px] truncate font-medium text-slate-200">
                        {userData.name || "Author"}
                      </span>
                    </div>
                  </li>
                )}
                <li className="ml-2">
                  <LogoutBtn />
                </li>
              </>
            )}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 transition-colors duration-300 hover:border-cyan-300/50 md:hidden"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-slate-100 transition-transform duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-slate-100 transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-slate-100 transition-transform duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>

        <div
          className={`overflow-hidden transition-all duration-500 md:hidden ${
            menuOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="glass stagger rounded-3xl p-2.5">
            {authStatus && userData && (
              <li className="px-4 py-2.5 text-xs text-slate-400 border-b border-white/10 mb-1 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white uppercase shadow-sm">
                  {userData.name ? userData.name.charAt(0) : "U"}
                </span>
                <span>Signed in as <strong className="text-white">{userData.name || "Author"}</strong></span>
              </li>
            )}
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => go(item.slug)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    location.pathname === item.slug
                      ? "bg-gradient-to-r from-violet-500/40 to-cyan-400/25 text-white"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {item.name}
                  <span aria-hidden="true" className="text-cyan-300">→</span>
                </button>
              </li>
            ))}
            {authStatus && (
              <li className="p-1 pt-2">
                <LogoutBtn className="w-full text-center" />
              </li>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
}

export default Header;
