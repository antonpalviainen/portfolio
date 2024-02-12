import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";

import { requireUserId } from "~/session.server";
import "./1-tierlist.css";

const INIT_ROWS = [
  { name: "S", color: "#ff7f7f" },
  { name: "A", color: "#ffbf7f" },
  { name: "B", color: "#ffdf7f" },
  { name: "C", color: "#ffff7f" },
  { name: "D", color: "#bfff7f" },
  { name: "E", color: "#7fff7f" },
  { name: "F", color: "#7fffff" },
];

const INIT_ITEMS = [
  { name: "test", image: "blue" },
  { name: "test", image: "red" },
  { name: "test", image: "green" },
];

interface RowType {
  name: string;
  color: string;
}

interface ItemType {
  name: string;
  image: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({ rows: INIT_ROWS, items: INIT_ITEMS });
}

function Item({
  item,
  itemI,
  rowI,
  image,
  onDragStart,
  onDragEnter,
}: {
  item: ItemType;
  itemI: number;
  rowI: number;
  image: string;
  onDragStart: (e: React.DragEvent, rowI: number, itemI: number) => void;
  onDragEnter: (e: React.DragEvent, rowI: number, itemI: number | null) => void;
}) {
  return (
    <div
      className="item"
      onDragStart={(e) => onDragStart(e, rowI, itemI)}
      onDragEnter={(e) => onDragEnter(e, rowI, itemI)}
      onDragOver={(e) => e.preventDefault()}
      draggable
      title={item.name}
      // style={{ backgroundImage: `url(${image})` }}
      style={{ backgroundColor: image }}
    ></div>
  );
}

function Row({
  rowLabel,
  items,
  rowI,
  onDragStart,
  onDragEnter,
}: {
  rowLabel?: RowType;
  items: ItemType[];
  rowI: number;
  onDragStart: (e: React.DragEvent, rowI: number, itemI: number) => void;
  onDragEnter: (e: React.DragEvent, rowI: number, itemI: number | null) => void;
}) {
  return (
    <div
      className="row"
      onDragEnter={(e) => onDragEnter(e, rowI, null)}
      onDragOver={(e) => e.preventDefault()}
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
          key={itemI}
        />
      ))}
    </div>
  );
}

function Tierlist({ rows, items }: { rows: RowType[]; items: ItemType[] }) {
  const [dragged, setDragged] = useState([-1, -1]);
  // Initialize list with empty arrays up to length of labeled rows and concatenate sortable items
  const [listItems, setListItems] = useState([
    ...Array.from({ length: rows.length }, () => []),
    ...[items],
  ]);

  function onDragStart(e: React.DragEvent, rowI: number, itemI: number) {
    e.dataTransfer.effectAllowed = "move";
    setDragged([rowI, itemI]);
  }

  function onDragEnter(e: React.DragEvent, rowI: number, itemI: number | null) {
    e.stopPropagation();
    const newList = structuredClone(listItems);
    const item = newList[dragged[0]][dragged[1]];

    newList[dragged[0]].splice(dragged[1], 1);
    itemI = itemI ?? newList[rowI].length;

    newList[rowI].splice(itemI, 0, item);
    setDragged([rowI, itemI]);
    setListItems(newList);
  }

  return (
    <div className="list">
      {rows
        ? rows.map((row, rowI) => (
            <Row
              rowLabel={row}
              items={listItems[rowI]}
              rowI={rowI}
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
              key={rowI}
            />
          ))
        : null}
      <Row
        items={listItems[rows.length]}
        rowI={rows.length}
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
      />
    </div>
  );
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <Tierlist rows={data.rows} items={data.items} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
