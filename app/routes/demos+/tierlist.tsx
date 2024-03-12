import { json } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { useEffect, useState } from 'react'

import './tierlist.css'
import apple from '../../images/apple.png'
import banana from '../../images/banana.png'
import kiwi from '../../images/kiwi.png'
import lemon from '../../images/lemon.png'
import lime from '../../images/lime.png'
import orange from '../../images/orange.png'
import raspberry from '../../images/raspberry.png'
import strawberry from '../../images/strawberry.png'

const INIT_ROWS = [
  { name: 'S', color: '#ff7f7f' },
  { name: 'A', color: '#ffbf7f' },
  { name: 'B', color: '#ffdf7f' },
  { name: 'C', color: '#ffff7f' },
  { name: 'D', color: '#bfff7f' },
  { name: 'E', color: '#7fff7f' },
  { name: 'F', color: '#7fffff' },
]

const INIT_ITEMS = [
  { name: 'apple', image: apple },
  { name: 'banana', image: banana },
  { name: 'kiwi', image: kiwi },
  { name: 'lemon', image: lemon },
  { name: 'lime', image: lime },
  { name: 'orange', image: orange },
  { name: 'raspberry', image: raspberry },
  { name: 'strawberry', image: strawberry },
]

interface RowType {
  name: string
  color: string
}

interface ItemType {
  name: string
  image: string
}

export function loader() {
  return json({ rows: INIT_ROWS, items: INIT_ITEMS })
}

export default function DetailsPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <Tierlist rows={data.rows} initItems={data.items} />
      <p className="my-3 text-lg">
        Images from{' '}
        <a
          className="text-[#7896bd] hover:text-[#a6bdd9]"
          href="https://pixabay.com"
        >
          Pixabay
        </a>
      </p>
    </div>
  )
}

function Tierlist({
  rows,
  initItems,
}: {
  rows: RowType[]
  initItems: ItemType[]
}) {
  const [draggedIndex, setDraggedIndex] = useState([-1, -1])
  // initialize list with empty arrays up to the length of labeled rows
  const [items, setItems] = useState([
    ...Array.from({ length: rows.length }, () => []),
    ...[initItems], // concatenate the sortable items
  ])

  useEffect(() => {
    // check localStorage for previous list
    const storedItems = window.localStorage.getItem('tierlist')
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  function onDragStart(e: React.DragEvent, rowI: number, itemI: number) {
    e.dataTransfer.effectAllowed = 'move'
    setDraggedIndex([rowI, itemI])
  }

  // "replace" the target element with the dragged item by splicing
  function onDragEnter(e: React.DragEvent, rowI: number, itemI: number | null) {
    e.stopPropagation()
    const newItems = structuredClone(items)
    const draggedItem = newItems[draggedIndex[0]][draggedIndex[1]]

    // remove the dragged item from its previous place
    newItems[draggedIndex[0]].splice(draggedIndex[1], 1)
    itemI = itemI ?? newItems[rowI].length

    newItems[rowI].splice(itemI, 0, draggedItem)
    setDraggedIndex([rowI, itemI])
    setItems(newItems)
  }

  function onDragEnd() {
    // save the new order to localStorage
    window.localStorage.setItem('tierlist', JSON.stringify(items))
  }

  return (
    <div className="list">
      {rows
        ? rows.map((row, rowI) => (
            <Row
              rowLabel={row}
              items={items[rowI]}
              rowI={rowI}
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              key={rowI}
            />
          ))
        : null}
      <Row
        items={items[rows.length]}
        rowI={rows.length}
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragEnd={onDragEnd}
      />
    </div>
  )
}

function Row({
  rowLabel,
  items,
  rowI,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  rowLabel?: RowType
  items: ItemType[]
  rowI: number
  onDragStart: (e: React.DragEvent, rowI: number, itemI: number) => void
  onDragEnter: (e: React.DragEvent, rowI: number, itemI: number | null) => void
  onDragEnd: () => void
}) {
  return (
    <div
      className="row"
      onDragEnter={(e) => onDragEnter(e, rowI, null)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
    >
      {rowLabel ? (
        <div
          className="row-label"
          contentEditable={false}
          style={{ backgroundColor: rowLabel.color }}
        >
          {rowLabel.name}
        </div>
      ) : null}
      {items.map((item, itemI) => (
        <Item
          item={item}
          itemI={itemI}
          rowI={rowI}
          image={item.image}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          key={itemI}
        />
      ))}
    </div>
  )
}

function Item({
  item,
  itemI,
  rowI,
  image,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  item: ItemType
  itemI: number
  rowI: number
  image: string
  onDragStart: (e: React.DragEvent, rowI: number, itemI: number) => void
  onDragEnter: (e: React.DragEvent, rowI: number, itemI: number | null) => void
  onDragEnd: () => void
}) {
  return (
    <div
      className="item"
      onDragStart={(e) => onDragStart(e, rowI, itemI)}
      onDragEnter={(e) => onDragEnter(e, rowI, itemI)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      draggable
      title={item.name}
      style={{ backgroundImage: `url(${image})` }}
    ></div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>
  }

  if (error.status === 404) {
    return <div>Note not found</div>
  }

  return <div>An unexpected error occurred: {error.statusText}</div>
}
