## How to format commit messages

Inspired by [this repo](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#format-of-the-commit-message)

### Format of the commit message

`<type>(<scope>): <subject>`

### Allowed `<type>`

-   add (add feature)
-   del (remove feature)
-   fix (bug fix)
-   docs (documentation)
-   style (formatting, missing semi colon...)
-   refactor
-   test (add tests)

### Allowed `<scope>`

Scope could be anything specifying place of the commit change : homepage, datamapper, router...

### Allowed `<subject>`

-   use imperative, present tense: “change” not “changed” nor “changes”
-   don't capitalize first letter
-   no dot (.) at the end

### Example

`fix(userRouter): typo in the /user/:id route callback`
