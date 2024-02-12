import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  return userId;
}

export default function Index() {
  const user = useOptionalUser();

  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
          <div>
            <Link
              to="/demos"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-100 sm:px-8"
            >
              View Demos
            </Link>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-100 sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-slate-500 px-4 py-3 font-medium text-white hover:bg-slate-600"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];
