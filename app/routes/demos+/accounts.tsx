import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

import { requireUser } from '~/utils/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)

  return json({ user })
}

export default function Accounts() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <div>Logged in: {data.user.username}</div>
      <Form action="/demos/logout" method="post" className='mt-4'>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Log out
        </button>
      </Form>
    </div>
  )
}
