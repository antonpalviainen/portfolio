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
      <div>Logged in: {data.user.email}</div>
      <Form action="/logout" method="post">
        <button type="submit">Log Out</button>
      </Form>
    </div>
  )
}
