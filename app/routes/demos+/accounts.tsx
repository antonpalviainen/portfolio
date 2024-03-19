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
    <div className="space-y-3">
      <div>Logged in: {data.user.username}</div>
      <p>
        <a
          href="https://github.com/antonpalviainen/portfolio/blob/main/app/routes/demos%2B/accounts.tsx"
          className="text-[#7896bd] hover:text-[#a6bdd9]"
        >
          View on GitHub
        </a>
      </p>
      <Form action="/demos/logout" method="post">
        <button
          type="submit"
          className="rounded bg-[#4d79b3] px-4 py-2 text-white hover:bg-[#346ab2] focus:bg-[#6a88af]"
        >
          Log out
        </button>
      </Form>
    </div>
  )
}
