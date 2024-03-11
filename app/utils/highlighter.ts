export interface MatchType {
  index: number
  value: string
}

export default class Highlighter {
  id: number
  initColor: string
  initBackgroundColor: string
  private css: string
  private query = ''
  private observer: MutationObserver | null = null
  private ignoreCase = true
  private styleClass: string
  private isUsingRegex = true
  private styleElement: HTMLStyleElement | null = null

  static count = 0

  constructor() {
    this.id = ++Highlighter.count
    this.styleClass = `find-regex-highlight-${this.id}`
    this.css = `.${this.styleClass} { background-color: BACKGROUND_COLOR; color: FOREGROUND_COLOR; font-size: inherit; }`
    this.initColor = '#000000'
    this.initBackgroundColor = '#ffff00'
  }

  upsertStyle(
    backgroundColor: string = this.initBackgroundColor,
    color: string = this.initColor
  ) {
    const css = this.css
      .replace('BACKGROUND_COLOR', backgroundColor)
      .replace('FOREGROUND_COLOR', color)
    if (this.styleElement) {
      this.styleElement.textContent = css
    } else {
      const style = document.createElement('style')
      style.textContent = css
      document.head.append(style)
      this.styleElement = style
    }
  }

  setQuery(query: string) {
    this.query = query
    return this.run()
  }

  setIgnoreCase(value: boolean) {
    this.ignoreCase = value
  }

  setIsUsingRegex(value: boolean) {
    this.isUsingRegex = value
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    this.removeHighlight()
  }

  private createRegexp(query: string) {
    if (query.length === 0) return null

    const flags = this.ignoreCase ? 'gi' : 'g'

    if (!this.isUsingRegex) {
      query = query.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    }

    try {
      return new RegExp(query, flags)
    } catch (error) {
      return null
    }
  }

  private run() {
    if (this.observer) {
      this.observer.disconnect()
    }

    this.removeHighlight()

    const regexp = this.createRegexp(this.query)
    if (!regexp) return null

    let count = this.walkNodes(document.body, regexp)

    this.observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        mutation.addedNodes.forEach(async (node) => {
          count += this.walkNodes(node, regexp)
        })
      }
    })

    this.observer.observe(document.body, { childList: true, subtree: true })

    return count
  }

  private walkNodes(root: Node, query: RegExp) {
    const treeWalker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      (node) => {
        return !node.parentElement?.classList.contains(this.styleClass) &&
          node.nodeValue?.match(query)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP
      }
    )

    let count = 0

    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode
      count += this.addHighlightClass(node, query)
    }

    return count
  }

  private addHighlightClass(node: Node, query: RegExp) {
    const text = node.nodeValue
    if (!text) return 0

    const matches: MatchType[] = []

    let match: RegExpExecArray | null
    while ((match = query.exec(text))) {
      matches.push({
        index: match.index,
        value: match[0],
      })
    }

    node.nodeValue = text.substring(0, matches[0]?.index)

    let prevNode = null
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]

      const span = document.createElement('span')
      span.innerHTML = match?.value ?? ''
      span.classList.add(this.styleClass)

      node.parentNode?.insertBefore(
        span,
        prevNode ? prevNode.nextSibling : node.nextSibling
      )

      const nextIndex =
        i === matches.length - 1 ? undefined : matches[i + 1]?.index

      const afterText = text.substring(
        (match?.index ?? 0) + (match?.value?.length ?? 0),
        nextIndex
      )

      if (afterText) {
        const afterNode = document.createTextNode(afterText)
        node.parentNode?.insertBefore(afterNode, span.nextElementSibling)
        prevNode = afterNode
      } else {
        prevNode = span
      }
    }

    return matches.length
  }

  private removeHighlight() {
    document.querySelectorAll(`.${this.styleClass}`).forEach((el) => {
      el.outerHTML = el.innerHTML
    })
  }
}
