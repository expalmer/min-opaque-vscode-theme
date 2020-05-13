// If you are unfamiliar with Style Dictionary take a look at the docs:
// https://styledictionary.com
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'vsCodeName',
  type: 'name',
  // transformer: (token) => console.log('->', token.path) && token.path.join('.')
  transformer: (token) => token.path.join('.')
});

StyleDictionary.registerFormat({
  name: 'vsCodeTheme',
  formatter: ({ allProperties }, config) => {

    const colors = allProperties
      .filter(({ path: [head] }) => !['core', 'syntax'].includes(head))
      .reduce((acc, { name, value }) => ({
        ...acc,
        [name]: value
      }), {})

    const tokenColors = allProperties
      .filter(({ path: [head] }) => head === 'syntax')
      .map(({ name, value, title, fontStyle }) => {
        const scope = name.replace('syntax.', '').split('|')
        return {
          ...(title && { name: title }),
          ...(scope[0] !== 'settings' && { scope }),
          settings: {
            ...(fontStyle && { fontStyle }),
            ...(value && { foreground: value })
          }
        }
      })

    // console.log('==> allProperties', )
    const theme = {
      name: 'Min Opaque Dark',
      type: 'dark',
      colors,
      tokenColors
    }

    // dictionary.allProperties.filter((token) => {
    //   return !.includes(token.path[0])
    // }).forEach((token) => {
    //   theme.colors[token.name] = token.value;
    // });

    // theme.tokenColors = dictionary.allProperties
    //   .map(i => {
    //     return i
    //   })
    //   .filter(({ path: [first] }) => first !== 'core')
    //   .map((token) => {
    //     console.log('==> ', token)
    //   })
    // ({
    //   scope: token.name,
    //   settings: {
    //     foreground: token.value,
    //     fontStyle: token.fontStyle,
    //   }
    // }));

    // Style Dictionary formats expect a string that will be then written to a file
    return JSON.stringify(theme, null, 2);
  }
});


StyleDictionary.extend({
  source: [
    'tokens/core.json',
    'tokens/application.json',
    'tokens/syntax.json',
  ],
  platforms: {
    vscode: {
      buildPath: 'build/',
      transforms: [`vsCodeName`],
      files: [{
        destination: 'min-opaque-dark.color-theme.json',
        format: 'vsCodeTheme'
      }]
    }
  }
}).buildAllPlatforms();
