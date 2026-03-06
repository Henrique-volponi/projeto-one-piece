import { Octokit } from '@octokit/rest'
import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

async function run() {
  const diff = fs.readFileSync('diff.txt', 'utf8')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Você é um engenheiro de software sênior fazendo code review.',
      },
      {
        role: 'user',
        content: `Analise esse pull request e sugira melhorias:\n\n${diff}`,
      },
    ],
  })

  const review = completion.choices[0].message.content

  await octokit.issues.createComment({
    owner: process.env.REPO_OWNER,
    repo: process.env.REPO_NAME,
    issue_number: process.env.PR_NUMBER,
    body: `PRGuardia AI Review\n\n${review}`,
  })
}

run()
