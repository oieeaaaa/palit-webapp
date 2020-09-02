const packageJSON = require('./package.json');

module.exports = function (plop) {
  const componentPath = 'components/{{name}}/{{name}}';

  // component generator
  plop.setGenerator('component', {
    description: 'Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'input',
        name: 'author',
        message: 'Your name please:',
        default: packageJSON.author,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Component description (will be useful for your co-devs)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${componentPath}.js`,
        templateFile: 'templates/component.hbs',
      },
      {
        type: 'add',
        path: `${componentPath}.scss`,
        templateFile: 'templates/scss.hbs',
      },
      {
        type: 'add',
        path: `${componentPath}.styleguide.js`,
        templateFile: 'templates/styleguide.hbs',
      },
      {
        type: 'append',
        pattern: /\[(?<!];)/gm,
        path: 'styleguide/component-list.js',
        templateFile: 'templates/object.hbs',
        seperator: '',
      },
      {
        type: 'append',
        pattern: '// list of components',
        path: 'styleguide/component-list.js',
        templateFile: 'templates/import.hbs',
        seperator: '',
      },
      {
        type: 'append',
        pattern: '// components',
        path: 'scss/main.scss',
        templateFile: 'templates/import-scss.hbs',
        seperator: '',
      },
    ],
  });
};
