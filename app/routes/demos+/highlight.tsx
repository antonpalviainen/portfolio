import { useEffect, useState } from 'react'

import options from '~/images/options.png'
// import './highlight.css'
import Highlighter from '~/utils/highlighter'

export default function Page() {
  return (
    <div className="text-lg space-y-4">
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
        <li>Run query</li>
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
      <h3 className="text-xl">Run developement server</h3>
      <pre className="whitespace-pre-line p-2 rounded bg-zinc-800">
        <code className="block">
          git clone https://github.com/antonpalviainen/find-regex.git
        </code>
        <code className="block">cd find-regex</code>
        <code className="block">npm run dev</code>
      </pre>
      <h3 className="text-xl">Build</h3>
      <code className="p-1 rounded bg-zinc-800">npm run build</code>
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
          query: 'reg(?:ular)',
          backgroundColor: '#00aaff',
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

interface QueryFormProps {
  instance: Highlighter
  handleRemoveQuery(): void
  initOptions?: {
    query?: string
    backgroundColor?: string
    foregroundColor?: string
    enabled?: boolean
    expanded?: boolean
    ignoreCase?: boolean
    isUsingRegex?: boolean
  }
}

function QueryForm({
  instance,
  handleRemoveQuery,
  initOptions,
}: QueryFormProps) {
  const [query, setQuery] = useState(initOptions?.query ?? '')
  const [error, setError] = useState('')
  const [foregroundColor, setFGColor] = useState(
    initOptions?.foregroundColor ?? '#000000'
  )
  const [backgroundColor, setBGColor] = useState(
    initOptions?.backgroundColor ?? '#ffff00'
  )
  const [enabled, setEnabled] = useState(initOptions?.enabled ?? true)
  const [expanded, setExpanded] = useState(initOptions?.expanded ?? false)
  const [ignoreCase, setIgnoreCase] = useState(initOptions?.ignoreCase ?? true)
  const [isUsingRegex, setIsUsingRegex] = useState(
    initOptions?.isUsingRegex ?? true
  )
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    instance.upsertStyle(backgroundColor, foregroundColor)
  }, [instance, backgroundColor, foregroundColor])

  function handleQueryToggle() {
    setEnabled(!enabled)
    instance.upsertStyle(
      enabled ? 'unset' : backgroundColor,
      enabled ? 'unset' : foregroundColor
    )
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      instanceQuery(query)
    }
  }

  function handleBGColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBGColor(e.target.value)
  }

  function handleQuerySubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    instanceQuery(query)
  }

  function handleExpandOptions(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setExpanded(!expanded)
  }

  function handleIsUsingRegexToggle() {
    setIsUsingRegex(!isUsingRegex)
    instance.setIsUsingRegex(!isUsingRegex)
    instanceQuery(query)
  }

  function handleIgnoreCaseToggle() {
    setIgnoreCase(!ignoreCase)
    instance.setIgnoreCase(!ignoreCase)
    instanceQuery(query)
  }

  function handleFGColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFGColor(e.target.value)
  }

  function instanceQuery(query: string) {
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
          checked={enabled}
          onChange={handleQueryToggle}
          title="Enable/disable highlighting"
        />
        <input
          className="query-input"
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          title="Regular expression to highlight"
        />
        <input
          type="color"
          value={backgroundColor}
          onChange={handleBGColorChange}
          title="Change highlight color"
        />
        <button onClick={handleQuerySubmit} title="Highlight">
          Find
        </button>
        <span className="match-count">{matchCount}</span>
        <button onClick={handleExpandOptions}>{expanded ? '⯅' : '⯆'}</button>
      </div>
      {expanded ? (
        <div className="additional-settings">
          <label>
            <input
              type="checkbox"
              checked={isUsingRegex}
              onChange={handleIsUsingRegexToggle}
            />{' '}
            Regex
          </label>
          <label>
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={handleIgnoreCaseToggle}
            />{' '}
            Ignore case
          </label>
          <input
            type="color"
            value={foregroundColor}
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
