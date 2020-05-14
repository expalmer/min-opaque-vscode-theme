const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'vsCodeName',
  type: 'name',
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

    const theme = {
      name: 'Min Opaque Dark',
      type: 'dark',
      colors,
      tokenColors
    }

    return JSON.stringify(theme, null, 2);
  }
});


StyleDictionary.extend({
  source: [
    'tokens/core.json5',
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
