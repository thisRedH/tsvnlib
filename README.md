# tsvnlib

TypeScript library for interacting with SVN (Subversion) via the command-line client.

## Requirements

- Node.js >= 20
- SVN command-line client (`svn`) installed and in `PATH`

## Installation

```sh
npm install tsvnlib
```

## Usage

```ts
import { SvnClient, nodeRunner } from 'tsvnlib';

const client = new SvnClient(nodeRunner, {
    repoUrl: 'https://svn.example.com/repo',
    cwd: '/path/to/working-copy',
});

// Checkout
await client.checkout(['https://svn.example.com/repo/trunk'], '/path/to/wc');

// Update
const { revision } = await client.update();
console.log(`Updated to r${revision}`);

// Status
const entries = await client.status();
for (const entry of entries) {
    console.log(entry.item, entry.path);
}

// Commit
const { revision } = await client.commit(['file.ts'], { message: 'fix: correct typo' });
console.log(`Committed r${revision}`);

// Log
const entries = await client.log('https://svn.example.com/repo/trunk', [], { limit: 10 });
for (const entry of entries) {
    console.log(`r${entry.revision} by ${entry.author}: ${entry.message}`);
}
```

## Authentication

Pass credentials in the constructor's config:

```ts
const client = new SvnClient(nodeRunner, {
    username: 'alice',
    passwordFromStdin: true, // preferred - avoids exposing the password in process args
    nonInteractive: true,
});
```

> **Note:** Using `password` instead of `passwordFromStdin` will expose the value in process arguments (visible via `ps`). Use `passwordFromStdin` when secrecy matters.

## Logging

Pass any object implementing the `Logger` interface. A `consoleLogger` is included:

```ts
import { SvnClient, consoleLogger } from 'tsvnlib';
import { nodeRunner } from 'tsvnlib/runners/node';

const client = new SvnClient(nodeRunner, {
    logger: consoleLogger,
});
```

## Custom runner

`SvnClient` is decoupled from Node.js via the `Runner` interface. You can provide your own runner to control how the `svn` process is spawned:

```ts
import type { Runner } from 'tsvnlib';

const myRunner: Runner = async (executable, args, opts) => {
    // spawn the process however you like
    return { stdout, stderr, exitCode };
};

const client = new SvnClient(myRunner, { ... });
```

## Error handling

All SVN errors are typed. Errors thrown by `SvnClient` are instances of `SvnError` subclasses, allowing precise error handling:

```ts
import { SvnClient, SvnRaNotAuthorizedError, SvnProcessError } from 'tsvnlib';

try {
    await client.update();
} catch (err) {
    if (err instanceof SvnRaNotAuthorizedError) {
        console.error('Authentication failed');
    } else if (err instanceof SvnProcessError) {
        console.error('SVN exited with code', err.exitCode);
    }
}
```

## License

[MIT](LICENSE)
