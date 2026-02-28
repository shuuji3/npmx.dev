import { execSync } from 'node:child_process'
import { relative } from 'node:path'

export function git(command: string): string {
  return execSync(command, { encoding: 'utf-8' }).trim()
}

export function getCurrentCommitHash(): string {
  return git('git rev-parse HEAD')
}

export function getPreviousEnJson(fileName: string): string {
  const relativePath = relative(process.cwd(), fileName)
  return git(`git show HEAD^:${relativePath}`)
}
