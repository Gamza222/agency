/**
 * Custom SCSS Transformer for Jest
 *
 * This transformer handles SCSS files with design tokens and mixins
 * by converting them to CSS-in-JS objects that Jest can understand.
 */

const sass = require('sass');

module.exports = {
  process(sourceText, sourcePath, options) {
    // Debug: Log when transformer is called
    console.log(`\n🔧 SCSS TRANSFORMER CALLED for: ${sourcePath}\n`);

    try {
      // Compile SCSS to CSS
      const result = sass.compile(sourcePath, {
        style: 'compressed',
        loadPaths: ['src/shared/styles'],
      });

      // Debug: Log successful compilation
      console.log(`✅ SCSS compiled successfully for: ${sourcePath}`);
      console.log(`📄 Generated CSS length: ${result.css.length} characters`);

      // Convert CSS to a JavaScript object
      const cssString = result.css;
      const className = sourcePath.split('/').pop().replace('.module.scss', '') || 'default';

      // Create a simple object with class names as keys
      const cssObject = {};

      // Extract class names from CSS and create object
      const classMatches = cssString.match(/\.[a-zA-Z][a-zA-Z0-9_-]*/g) || [];
      classMatches.forEach((match) => {
        const className = match.substring(1); // Remove the dot
        cssObject[className] = className;
      });

      // If no classes found, create a default
      if (Object.keys(cssObject).length === 0) {
        cssObject[className] = className;
      }

      console.log(`🎯 Generated CSS object keys: ${Object.keys(cssObject).join(', ')}`);

      return {
        code: `module.exports = ${JSON.stringify(cssObject, null, 2)};`,
      };
    } catch (error) {
      const marker = '\n\n\n================ SCSS COMPILATION ERROR ================\n';
      const msg = `${marker}SCSS compilation failed for ${sourcePath}:\n${error.message}\n${marker}`;
      // Print to stderr so it always appears in test output
      console.error(msg);
      // Fallback: return a simple object with the filename as key
      const className = sourcePath.split('/').pop().replace('.module.scss', '') || 'default';
      return {
        code: `module.exports = { "${className}": "${className}" };`,
      };
    }
  },
};
