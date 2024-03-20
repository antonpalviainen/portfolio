import { readFile } from 'fs/promises'

const resume = './public/resume.pdf'

export async function loader() {
  const pdf = await readFile(resume)

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
}
