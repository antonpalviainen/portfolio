import { LinksFunction } from '@remix-run/node'

import { HighlighterDemo } from '~/components/HighlighterDemo'
import options from '~/images/options.png'

import styles from './highlight.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export default function Page() {
  return (
    <div className=" max-w-[50rem] text-lg space-y-4">
      <h1 className="pb-2 text-3xl font-semibold border-b border-zinc-700">
        FindRegex
      </h1>
      <p>An isolated functional demo</p>
      <HighlighterDemo />
      <p>In the real extension this interface appears as the popup</p>
      <h2 className="pb-2 text-2xl font-semibold border-b border-zinc-700">
        Features
      </h2>
      <ul className="list-disc pl-10">
        <li>Find text on page using regular expressions</li>
        <li>Multiple independent queries can be added</li>
        <li>Highlight color for every query can be changed</li>
      </ul>
      <h2 className="pb-2 text-2xl font-semibold border-b border-zinc-700">
        Options
      </h2>
      <img src={options} alt="options" />
      <ol className="list-decimal pl-10">
        <li>Toggle for turning query highlighting off temporarily</li>
        <li>
          Query field. Supports any valid JavaScript regular expression, or any
          string with regex mode turned off
        </li>
        <li>Background color for highlighted text</li>
        <li>Run the query</li>
        <li>Number of matches on page</li>
        <li>Expand or collapse options</li>
        <li>Toggle ignore case. Case is ignored by default.</li>
        <li>
          Turn regex matching off for basic string matching with no special
          characters
        </li>
        <li>Text color for highlighted text</li>
        <li>Remove query, will remove its highlighting</li>
        <li>Add a new query</li>
      </ol>
      <h2 className="pb-2 text-2xl font-semibold border-b border-zinc-700">
        Tools Used
      </h2>
      <ul className="list-disc pl-10">
        <li>
          <a
            href="https://crxjs.dev/vite-plugin"
            className="text-[#7896bd] hover:text-[#a6bdd9]"
          >
            CRXJS
          </a>
        </li>
        <li>
          <a
            href="https://react.dev "
            className="text-[#7896bd] hover:text-[#a6bdd9]"
          >
            React
          </a>
        </li>
        <li>
          <a
            href="https://www.typescriptlang.org"
            className="text-[#7896bd] hover:text-[#a6bdd9]"
          >
            TypeScript
          </a>
        </li>
        <li>
          <a
            href="https://vitejs.dev"
            className="text-[#7896bd] hover:text-[#a6bdd9]"
          >
            Vite
          </a>
        </li>
      </ul>
      <h2 className="pb-2 text-2xl font-semibold border-b border-zinc-700">
        Developing
      </h2>
      <p>
        <a
          href="https://github.com/antonpalviainen/portfolio/blob/main/app/routes/demos%2B/highlight.tsx"
          className="text-2xl text-[#7896bd] hover:text-[#a6bdd9]"
        >
          View on GitHub
        </a>
      </p>
      <h3 className="text-xl">Run a developement server</h3>
      <pre className="whitespace-pre-line break-words p-2 rounded bg-zinc-800">
        <code className="block">
          git clone https://github.com/antonpalviainen/find-regex.git
        </code>
        <code className="block">cd find-regex</code>
        <code className="block">npm run dev</code>
      </pre>
      <h3 className="text-xl">Build</h3>
      <code className="inline-block p-1 rounded bg-zinc-800">
        npm run build
      </code>
    </div>
  )
}
