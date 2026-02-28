export type EnJson = {
  [key: string]: string | EnJson
}

export type MetaEntry = {
  text: string
  commit: string
}

export type EnMetaJson = {
  [key: string]: string | MetaEntry | EnMetaJson
}
