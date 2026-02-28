import { describe, expect, it } from 'vitest'
import { makeEnMetaJson } from '#scripts/i18n-meta/update-en-meta'

describe('Create en.meta.json', () => {
  it('should handle an empty en.json file', () => {
    const oldEnJson = {}
    const newEnJson = {}
    const oldEnMetaJson = {}

    const enMetaJson = makeEnMetaJson(newEnJson, oldEnJson, oldEnMetaJson, 'sha-new-12345')
    expect(enMetaJson).toEqual({})
  })

  it('should generate en.meta.json correctly for an initial en.json', () => {
    const oldEnJson = {}
    const newEnJson = {
      tagline: 'npmx - a fast, modern browser for the npm registry',
    }
    const oldEnMetaJson = {}

    const enMetaJson = makeEnMetaJson(newEnJson, oldEnJson, oldEnMetaJson, 'sha-new-12345')
    expect(enMetaJson).toEqual({
      tagline: {
        text: 'npmx - a fast, modern browser for the npm registry',
        commit: 'sha-new-12345',
      },
    })
  })

  it('should update existing keys and add new keys with the latest commit hash', () => {
    const oldEnJson = {
      name: 'npmx',
      tagline: 'npmx - a better browser for the npm registry',
    }
    const newEnJson = {
      name: 'npmx',
      tagline: 'npmx - a fast, modern browser for the npm registry',
      description: 'Search, browse, and explore packages with a modern interface.',
    }
    const oldEnMetaJson = {
      name: {
        tagline: 'npmx',
        commit: 'sha-old-12345',
      },
      tagline: {
        tagline: 'npmx - a better browser for the npm registry',
        commit: 'sha-old-12345',
      },
    }

    const enMetaJson = makeEnMetaJson(newEnJson, oldEnJson, oldEnMetaJson, 'sha-new-12345')
    expect(enMetaJson).toEqual({
      name: {
        text: 'npmx',
        commit: 'sha-old-12345',
      },
      tagline: {
        text: 'npmx - a fast, modern browser for the npm registry',
        commit: 'sha-new-12345',
      },
      description: {
        text: 'Search, browse, and explore packages with a modern interface.',
        commit: 'sha-new-12345',
      },
    })
  })

  it('should remove keys that are no longer in en.json', () => {
    const oldEnJson = {
      tagline: 'npmx - a fast, modern browser for the npm registry',
      toBeRemoved: 'This will be gone',
    }
    const newEnJson = {
      tagline: 'npmx - a fast, modern browser for the npm registry',
    }
    const oldEnMetaJson = {
      tagline: {
        text: 'npmx - a fast, modern browser for the npm registry',
        commit: 'sha-old-12345',
      },
      toBeRemoved: { text: 'This will be gone', commit: 'sha-old-12345' },
    }

    const enMetaJson = makeEnMetaJson(newEnJson, oldEnJson, oldEnMetaJson, 'sha-new-12345')
    expect(enMetaJson).toEqual({
      tagline: {
        text: 'npmx - a fast, modern browser for the npm registry',
        commit: 'sha-old-12345',
      },
    })
  })

  it('should handle complex nested structures', () => {
    const oldEnJson = {
      a: {
        b: 'value-b',
      },
      c: 'value-c',
    }
    const newEnJson = {
      a: {
        b: 'updated-value',
      },
      c: 'value-c',
      d: 'added-value',
    }

    const oldEnMetaJson = {
      a: {
        b: {
          text: 'value-b',
          commit: 'sha-old-12345',
        },
      },
      c: {
        text: 'value-c',
        commit: 'sha-old-12345',
      },
      d: {
        text: 'added-value',
        commit: 'sha-new-12345',
      },
    }

    const enMetaJson = makeEnMetaJson(newEnJson, oldEnJson, oldEnMetaJson, 'sha-new-12345')
    expect(enMetaJson).toEqual({
      a: {
        b: { text: 'updated-value', commit: 'sha-new-12345' },
      },
      c: { text: 'value-c', commit: 'sha-old-12345' },
      d: { text: 'added-value', commit: 'sha-new-12345' },
    })
  })
})
