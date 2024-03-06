import { readFile } from 'fs/promises'

const resume = './public/resume.pdf'

async function loadFile(path: string) {
  return await readFile(path)
}

export async function loader() {
  const pdf = await loadFile(resume)

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
}
