import { LinksFunction } from '@remix-run/node'
import { useEffect, useState } from 'react'

import options from '~/images/options.png'
import Highlighter from '~/utils/highlighter'

import styles from './highlight.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

const defaultOptions = {
  query: '',
  backgroundColor: '#ffff00',
  foregroundColor: '#000000',
  enabled: true,
  expanded: false,
  ignoreCase: true,
  isUsingRegex: true,
}

interface QueryFormProps {
  instance: Highlighter
  handleRemoveQuery(): void
  initOptions?: Partial<typeof defaultOptions>
}

function QueryForm({
  instance,
  handleRemoveQuery,
  initOptions,
}: QueryFormProps) {
  const [error, setError] = useState('')
  const [matchCount, setMatchCount] = useState(0)
  const [options, setOptions] = useState({
    ...defaultOptions,
    ...initOptions,
  })

  useEffect(() => {
    highlight(options.query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    instance.upsertStyle(options.backgroundColor, options.foregroundColor)
  }, [instance, options.backgroundColor, options.foregroundColor])

  function handleQueryToggle() {
    setOptions({ ...options, enabled: !options.enabled })
    instance.upsertStyle(
      options.enabled ? 'unset' : options.backgroundColor,
      options.enabled ? 'unset' : options.foregroundColor
    )
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOptions({ ...options, query: e.target.value })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      highlight(options.query)
    }
  }

  function handleBGColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOptions({ ...options, backgroundColor: e.target.value })
  }

  function handleQuerySubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    highlight(options.query)
  }

  function handleExpandOptions(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setOptions({ ...options, expanded: !options.expanded })
  }

  function handleIsUsingRegexToggle() {
    setOptions({ ...options, isUsingRegex: !options.isUsingRegex })
    instance.setIsUsingRegex(!options.isUsingRegex)
    highlight(options.query)
  }

  function handleIgnoreCaseToggle() {
    setOptions({ ...options, ignoreCase: !options.ignoreCase })
    instance.setIgnoreCase(!options.ignoreCase)
    highlight(options.query)
  }

  function handleFGColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOptions({ ...options, foregroundColor: e.target.value })
  }

  function highlight(query: string | undefined) {
    if (!query) return

    const count = instance.setQuery(query)
    if (typeof count === 'number') {
      setMatchCount(count)
      setError('')
    } else {
      setError('Invalid regular expression')
    }
  }

  return (
    <div className="query-form">
      <div className="main-settings">
        <input
          type="checkbox"
          checked={options.enabled}
          onChange={handleQueryToggle}
          title="Enable/disable highlighting"
        />
        <input
          className="query-input"
          type="text"
          value={options.query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          title="Regular expression to highlight"
        />
        <input
          type="color"
          value={options.backgroundColor}
          onChange={handleBGColorChange}
          title="Change highlight color"
        />
        <button onClick={handleQuerySubmit} title="Highlight">
          Find
        </button>
        <span className="match-count">{matchCount}</span>
        <button onClick={handleExpandOptions}>
          {options.expanded ? '⯅' : '⯆'}
        </button>
      </div>
      {options.expanded ? (
        <div className="additional-settings">
          <div className="checkbox">
            <input
              id="isUsingRegex"
              type="checkbox"
              checked={options.isUsingRegex}
              onChange={handleIsUsingRegexToggle}
            />
            <label htmlFor="isUsingRegex">Regex</label>
          </div>
          <div className="checkbox">
            <input
              id="ignoreCase"
              type="checkbox"
              checked={options.ignoreCase}
              onChange={handleIgnoreCaseToggle}
            />
            <label htmlFor="ignoreCase">Ignore case</label>
          </div>
          <input
            type="color"
            value={options.foregroundColor}
            onChange={handleFGColorChange}
            title="Change highlight text color"
          />
          <button
            className="remove-button"
            onClick={handleRemoveQuery}
            title="Remove query"
          >
            Remove
          </button>
        </div>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  )
}

function HighlighterDemo() {
  const [instances, setInstances] = useState([new Highlighter()])

  function handleAddQuery() {
    setInstances([...instances, new Highlighter()])
  }

  function handleRemoveQuery(instanceId: number) {
    instances.find((instance) => instance.id === instanceId)?.destroy()
    setInstances(instances.filter((instance) => instance.id !== instanceId))
  }

  return (
    <div className="highlighter-demos">
      <QueryForm
        instance={instances[0]}
        handleRemoveQuery={() => handleRemoveQuery(instances[0].id)}
        initOptions={{
          query: 'reg(?:ular)? ?ex(?:pressions?)?',
          backgroundColor: '#00ccff',
          expanded: true,
        }}
      />
      {instances.slice(1).map((instance) => (
        <QueryForm
          key={instance.id}
          instance={instance}
          handleRemoveQuery={() => handleRemoveQuery(instance.id)}
        />
      ))}
      <button
        className="add-button"
        onClick={handleAddQuery}
        title="Add new query"
      >
        +
      </button>
    </div>
  )
}

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
