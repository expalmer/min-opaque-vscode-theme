const theme = require('./theme.json')
const fs = require('fs')

const unique = (item, index, array) => array.indexOf(item) === index
const toLowerCase = i => i.toLowerCase()

const { colors, tokenColors } = theme

function createCoreColors() {
  const colorsHexa = Object.entries(colors)
    .map(([key, val]) => val)
    .filter(unique)
    .map(toLowerCase)
    .sort()

  const tokenHexa = tokenColors
    .filter(i => i.settings.foreground)
    .map(i => i.settings.foreground)
    .filter(unique)
    .map(toLowerCase)
    .sort()

  const coreColors = [...colorsHexa, ...tokenHexa].sort()


  const coreJson = coreColors.reduce((acc, hexa) => ({
    ...acc,
    [hexa]: { value: hexa }
  }), {})

  fs.writeFile('../tokens/core.json', `{ "core": ${JSON.stringify(coreJson)} }`, () => { })
}

function createApplication() {
  const colorsHexa = Object.entries(colors)
    .reduce((acc, [key, val]) => ({
      ...acc,
      [key]: { value: `{core.${toLowerCase(val)}.value}` }
    }), {})

  fs.writeFile('../tokens/application.json', `${JSON.stringify(colorsHexa)}`, () => { })
}

function createSyntax() {

  const makeToken = s => {
    const scope = Array.isArray(s) ? s : [s]
    return scope.join('|')
  }

  const tokenHexa = tokenColors
    .reduce((acc, { name, scope, settings }) => {
      const token = makeToken(scope)
      const { foreground, fontStyle } = settings
      return ({
        ...acc,
        [token]: {
          ...(name && { title: name }),
          ...(fontStyle && { fontStyle }),
          value: (foreground ? `{core.${toLowerCase(foreground)}.value}` : '')
        }
      })
    }, {})

  fs.writeFile('../tokens/syntax.json', `{ "syntax": ${JSON.stringify(tokenHexa)} }`, () => { })
}
