import { Link, NavLink, Outlet } from '@remix-run/react'

export default function DemosPage() {
  return (
    <div>
      <header className="p-4 space-x-4">
        <Link to="/" className="font-bold hover:text-zinc-300">
          Home
        </Link>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
            } hover:hover:text-[#a6bdd9]`
          }
          to="tierlist"
        >
          Tierlist
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
            } hover:hover:text-[#a6bdd9]`
          }
          to="highlight"
        >
          Highlight
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? 'text-[#a6bdd9] font-semibold' : 'text-[#7896bd]'
            } hover:hover:text-[#a6bdd9]`
          }
          to="grid"
        >
          Grid
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
            } hover:hover:text-[#a6bdd9]`
          }
          to="accounts"
        >
          User Accounts
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? 'text-[#a6bdd9]' : 'text-[#7896bd]'
            } hover:hover:text-[#a6bdd9]`
          }
          to="does-not-exist"
        >
          Error Page
        </NavLink>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
