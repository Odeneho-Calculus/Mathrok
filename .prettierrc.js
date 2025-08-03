module.exports = {
    // Print width
    printWidth: 100,

    // Tab width
    tabWidth: 2,
    useTabs: false,

    // Semicolons
    semi: true,

    // Quotes
    singleQuote: true,
    quoteProps: 'as-needed',

    // JSX
    jsxSingleQuote: true,

    // Trailing commas
    trailingComma: 'es5',

    // Bracket spacing
    bracketSpacing: true,
    bracketSameLine: false,

    // Arrow function parentheses
    arrowParens: 'avoid',

    // Range formatting
    rangeStart: 0,
    rangeEnd: Infinity,

    // Parser
    parser: undefined,

    // File path
    filepath: undefined,

    // Require pragma
    requirePragma: false,
    insertPragma: false,

    // Prose wrap
    proseWrap: 'preserve',

    // HTML whitespace sensitivity
    htmlWhitespaceSensitivity: 'css',

    // Vue files script and style tags indentation
    vueIndentScriptAndStyle: false,

    // End of line
    endOfLine: 'lf',

    // Embedded language formatting
    embeddedLanguageFormatting: 'auto',

    // Single attribute per line
    singleAttributePerLine: false,

    // Override for specific file types
    overrides: [
        {
            files: '*.json',
            options: {
                printWidth: 80,
                tabWidth: 2
            }
        },
        {
            files: '*.md',
            options: {
                printWidth: 80,
                proseWrap: 'always'
            }
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
                singleQuote: false
            }
        }
    ]
};