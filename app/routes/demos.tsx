import { Link, NavLink, Outlet } from '@remix-run/react'

export default function DemosPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center p-4 gap-4">
        <h1 className="font-bold hover:text-zinc-300">
          <Link to="/">Home</Link>
        </h1>
        <h2>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
              } hover:hover:text-[#a6bdd9]`
            }
            to="1-tierlist"
          >
            Tierlist
          </NavLink>
        </h2>
        <h2>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
              } hover:hover:text-[#a6bdd9]`
            }
            to="2-accounts"
          >
            User Accounts
          </NavLink>
        </h2>
        <h2>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
              } hover:hover:text-[#a6bdd9]`
            }
            to="404-does-not-exist"
          >
            Error Page
          </NavLink>
        </h2>
      </header>

      <main className="flex h-full p-6">
        <Outlet />
      </main>
    </div>
  )
}
