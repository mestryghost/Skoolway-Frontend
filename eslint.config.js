const eslint = require('@eslint/js');
const expo = require('eslint-config-expo');

module.exports = [
  eslint.configs.recommended,
  ...expo,
  {
    rules: {
      // High-quality file size: 200 lines max (code only)
      'max-lines': [
        'error',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      // Keep functions small and scannable
      'max-lines-per-function': [
        'error',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
];
