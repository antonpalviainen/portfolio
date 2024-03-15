import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import { verifyLogin } from '~/models/user.server'
import { safeRedirect } from '~/utils/misc'
import { createUserSession, getUserId } from '~/utils/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const remember = formData.get('remember')

  if (typeof username !== 'string' || username.length === 0) {
    return json(
      { errors: { username: 'Username is required', password: null } },
      { status: 400 }
    )
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { username: null, password: 'Password is required' } },
      { status: 400 }
    )
  }

  const user = await verifyLogin(username, password)

  if (!user) {
    return json(
      { errors: { username: 'Invalid username or password', password: null } },
      { status: 400 }
    )
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on' ? true : false,
    request,
    userId: user.id,
  })
}

export const meta: MetaFunction = () => [{ title: 'Login' }]

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const actionData = useActionData<typeof action>()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <div className="max-w-md px-8">
      <Form method="post" className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <div className="mt-1">
            <input
              ref={usernameRef}
              id="username"
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
              name="username"
              type="text"
              autoComplete="username"
              aria-invalid={actionData?.errors?.username ? true : undefined}
              aria-describedby="username-error"
              className="w-full rounded border border-gray-500 text-slate-800 px-2 py-1 text-lg"
            />
            {actionData?.errors?.username ? (
              <div className="pt-1 text-red-600" id="username-error">
                {actionData.errors.username}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border border-gray-500 text-slate-800 px-2 py-1 text-lg"
            />
            {actionData?.errors?.password ? (
              <div className="pt-1 text-red-600" id="password-error">
                {actionData.errors.password}
              </div>
            ) : null}
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="w-full rounded bg-[#4d79b3] px-4 py-2 text-white hover:bg-[#346ab2] focus:bg-[#6a88af]"
        >
          Log in
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="remember" className="ml-2 block text-sm">
              Remember me
            </label>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              className="text-[#7896bd] hover:text-[#a6bdd9] underline"
              to={{
                pathname: '/demos/join',
                search: searchParams.toString(),
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </Form>
    </div>
  )
}
