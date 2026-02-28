import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import dot from 'dot-object'
import { getCurrentCommitHash, getPreviousEnJson } from './git-utils.ts'
import type { EnJson, EnMetaJson, MetaEntry } from './types.d.ts'

const enJsonPath = resolve('i18n/locales/en.json')
const enMetaJsonPath = resolve('i18n/locales/en.meta.json')

/**
 * Update a metadata JSON file for English translations.
 */
export function updateEnMetaJson() {
  const newEnJsonRaw = readFileSync(enJsonPath, 'utf-8')
  const oldEnJsonRaw = getPreviousEnJson(enJsonPath)

  let oldEnMetaJsonRaw = '{}'
  if (existsSync(enMetaJsonPath)) {
    oldEnMetaJsonRaw = readFileSync(enMetaJsonPath, 'utf-8')
  }

  const latestCommitHash = getCurrentCommitHash()
  const enMetaJson = makeEnMetaJson(
    JSON.parse(newEnJsonRaw),
    JSON.parse(oldEnJsonRaw),
    JSON.parse(oldEnMetaJsonRaw),
    latestCommitHash,
  )

  writeFileSync(enMetaJsonPath, JSON.stringify(enMetaJson, null, 2) + '\n', 'utf-8')
  console.log(`📃 Generated ${enMetaJsonPath}`)
}

/**
 * Creates a metadata JSON object by comparing current and previous versions.
 */
export function makeEnMetaJson(
  newEnJson: EnJson,
  oldEnJson: EnJson,
  oldMetaEnJson: EnMetaJson,
  latestCommitHash: string,
): EnMetaJson {
  const newFlat = dot.dot(newEnJson) as Record<string, string>
  const oldFlat = dot.dot(oldEnJson) as Record<string, string>
  const oldMetaFlat = dot.dot(oldMetaEnJson) as Record<string, string>
  const metaFlat: Record<string, MetaEntry> = {}

  for (const key in newFlat) {
    if (Object.prototype.hasOwnProperty.call(newFlat, key)) {
      const newText = newFlat[key]
      const oldText = oldFlat[key]

      if (oldText === newText) {
        const oldCommit = oldMetaFlat[`${key}.commit`]
        metaFlat[key] = { text: newText, commit: oldCommit ?? latestCommitHash }
      } else {
        metaFlat[key] = { text: newText, commit: latestCommitHash }
      }
    }
  }
  return dot.object(metaFlat) as EnMetaJson
}
