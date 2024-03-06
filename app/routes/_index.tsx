import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <main className="flex flex-col min-h-screen p-4 space-y-12">
      <section className="flex flex-col justify-center items-center md:mt-56 ">
        <h1 className="text-6xl font-bold mb-3">Links</h1>
        <p className="text-center">
          <a
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            href="https://antonpalviainen.dev"
          >
            antonpalviainen.dev
          </a>
          <span className="mx-2">-</span>
          <a
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            href="https://github.com/antonpalviainen"
          >
            github.com/antonpalviainen
          </a>
          <span className="mx-2">-</span>
          <Link
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            to="resume.pdf"
            reloadDocument
          >
            Résumé
          </Link>
        </p>
      </section>
      <section className="flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold mb-3">Demos</h1>
        <p className="text-center">
          <Link
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            to="/demos/1-tierlist"
            rel="prefetch"
          >
            Tierlist
          </Link>
          <span className="mx-2">-</span>
          <Link
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            to="/demos/2-accounts"
          >
            User Accounts
          </Link>
          <span className="mx-2">-</span>
          <Link
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            to="/demos/404-does-not-exist"
          >
            Error Page
          </Link>
        </p>
      </section>
      <section className="flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold mb-3">Notes</h1>
        <p className="text-center">
          Created using{' '}
          <a
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            href="https://remix.run"
          >
            Remix
          </a>{' '}
          and{' '}
          <a
            className="text-[#7896bd] hover:text-[#a6bdd9]"
            href="https://react.dev"
          >
            React
          </a>
        </p>
      </section>
    </main>
  )
}

export const meta: MetaFunction = () => [{ title: 'Remix Notes' }]
