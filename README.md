# Welcome to Palit 🎉

Get yourself a palit by doing this: `git clone git@github.com:oieeaaaa/palit-webapp.git`

### Table of Contents
- [Quick Start]()
- [Scripts]()
- [The Dos and the Don'ts]()


### Quick Start

In your favorite terminal run the following commands:
1. `git clone git@github.com:oieeaaaa/palit-webapp.git`
1. `cd palit-webapp && yarn`
1. `yarn dev`

Highly Recommended:
You might want to setup a firebase emulator when testing to avoid polluting our dev environment

Don't worry it's easy to setup an emulator on your local machine, and once
you've done setting it up you can do all the crazy testing you need without polluting
our dev environment and costing us 💰💰💰💰💰💰! 😅.

Follow the instructions [here](https://firebase.google.com/docs/emulator-suite/install_and_configure).

Once you've done that, run `firebase emulators:start` then go to
`palit-firebase.js` in our repo and uncomment the code that wires up the
emulator. And voila! You Rock! 🔥

Some quick tips:
- If you're making a new component you should use our `yarn component` script.
- Before making a commit make sure that all linters are happy. Do `yarn fix`.

### Scripts
1. `yarn start` you need to run `yarn build` first to make this one work.
1. `yarn dev` for development.
1. `yarn build` to build the production ready codebase.
1. `yarn fix:eslint` it will lint & fix all files that ends with `.js` and `.jsx`.
1. `yarn fix:stylelint` it will lint & fix all files that ends with `.css`, `.scss` and `.sass`.
1. `yarn fix` it is the combination of `yarn fix:eslint` and `yarn fix:stylelint`.
1. `yarn component` THE GREATEST OF 'EM ALL!

### The Dos and the Dont's

I don't really like to do this but base on my years of development experience I found it important to have a guideline for each developer involved.

So, before you dive in to our codebase and writing your code in your own style and your own way.

Please read this first. Its' important (trust me, i'm not sarcastic)

#### THE DO'S!
**GLOBAL**
- The first and most important of 'em all is to be obedient to our linters. They are the POD of our codebase and we need to respect that.
- Write comments if you think you're the only one who can read the code.

**JS/JSX**
- When naming your functions use an easy to understand verbs (e.g., `getItems`, `acceptRequest`, `handleChange`).
- When naming your variables use an easy to understand nouns (e.g., `items`, `user`, `form`).
- If the variable has a value of boolean use questions to indicate that it is a boolean (e.g., `isLoading`, `isFetching`, `isTraded`).
- When writing your conditions try to make it short and easy to understand.
- If your conditions are inevitebly long store them in a boolean variable (e.g., `isUserAtTheBottomPage`, `isItemExist`, `isFormInvalid`).
- When you need a `useEffect` inside a component store them before the `return` keyword. Because when you use an outside function inside your `useEffect` you don't have to worry about the declaration order. (ask joimee for more info).
- When you need a state, name the setter value base on the state. for example: `const [isLoading, setIsLoading] = useState(false)`.
- When you're making an awesome api use the `/api` folder.
- Before you write an algorithm to your problem check our `/js` folder first if it is already there. We want to avoid duplications in our codebase

**CSS/SCSS**
- For components use pascalCase names (e.g., `userProfile`, `userInfo`, `itemCard`).
- For pages use kebab-case names (e.g., `trade-request-select`, `user-profile`, `trade-request`).
- Declare the variables first in our `scss/base/_variables.scss`.
  - If you need to add colors. (Duplicate the color for scss and css)
  - If you need to add a z-index.
  - If you need to add a box-shadow.
  - If you need to add a border.
- Use the `rem()` to convert pixel unit values to rem.
- Use the mixin when adding font-family. (e.g., `@include Montserrat`, `@include Montserrat(700)`).
- Seperate margins and grid specifics with the rest of the properties.

...
