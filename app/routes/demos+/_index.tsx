import { redirect } from '@remix-run/node'

export function loader() {
  return redirect('/demos/tierlist')
}

export default function DemoIndexPage() {
  return <p>No demo selected. Select a demo on the left</p>
}
