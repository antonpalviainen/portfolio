import { useEffect, useState } from 'react'

import Highlighter from '~/utils/highlighter'

const defaultOptions = {
  query: '',
  backgroundColor: '#ffff00',
  foregroundColor: '#000000',
  enabled: true,
  expanded: false,
  ignoreCase: true,
  isUsingRegex: true,
}

interface HighlighterFormProps {
  instance: Highlighter
  handleRemoveQuery(): void
  initOptions?: Partial<typeof defaultOptions>
}

function HighlighterForm({
  instance,
  handleRemoveQuery,
  initOptions,
}: HighlighterFormProps) {
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
          name="query-toggle"
          title="Enable/disable highlighting"
        />
        <input
          className="query-input"
          type="text"
          value={options.query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          name="query-input"
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

export function HighlighterDemo() {
  const [instances, setInstances] = useState([new Highlighter()])

  useEffect(() => {
    return () => {
      instances.forEach((instance) => instance.destroy())
    }
  }, [instances])

  function handleAddQuery() {
    setInstances([...instances, new Highlighter()])
  }

  function handleRemoveQuery(instanceId: number) {
    instances.find((instance) => instance.id === instanceId)?.destroy()
    setInstances(instances.filter((instance) => instance.id !== instanceId))
  }

  return (
    <div className="highlighter-demos">
      <HighlighterForm
        instance={instances[0]}
        handleRemoveQuery={() => handleRemoveQuery(instances[0].id)}
        initOptions={{
          query: 'reg(?:ular)? ?ex(?:pressions?)?',
          backgroundColor: '#00ccff',
          expanded: true,
        }}
      />
      {instances.slice(1).map((instance) => (
        <HighlighterForm
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
