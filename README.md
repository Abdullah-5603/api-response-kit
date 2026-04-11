# @abdullah/api-response-kit

Small, dependency-light TypeScript helpers for standardized API responses in Node.js and Express-style backends.

## Purpose

`@abdullah/api-response-kit` gives you a compact set of response builders that keep API payloads consistent across services, controllers, and middleware. It is ESM-first, ships CommonJS output, generates declaration files, and keeps runtime dependencies at zero.

## Installation

```bash
npm install @abdullah/api-response-kit
```

## Quick Start

```ts
import { badRequest, ok } from '@abdullah/api-response-kit';

const success = ok(
  {
    user: {
      id: 'u_123',
      name: 'Ada Lovelace',
    },
  },
  { request_id: 'req_123' }
);

const failure = badRequest('Validation failed', [
  { field: 'email', message: 'Email is required' },
]);
```

Success payloads look like this:

```json
{
  "success": true,
  "status_code": 200,
  "message": "OK",
  "data": {
    "user": {
      "id": "u_123",
      "name": "Ada Lovelace"
    }
  },
  "meta": {
    "request_id": "req_123"
  }
}
```

Error payloads look like this:

```json
{
  "success": false,
  "status_code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## API Reference

### Success Helpers

- `ok(data, meta?)`
- `created(data, meta?)`
- `accepted(data, meta?)`
- `noContent(meta?)`

### Error Helpers

- `badRequest(message?, errors?, meta?)`
- `unauthorized(message?, meta?)`
- `forbidden(message?, meta?)`
- `notFound(message?, meta?)`
- `conflict(message?, meta?)`
- `unprocessableEntity(message?, errors?, meta?)`
- `tooManyRequests(message?, meta?)`
- `error(message?, meta?)`

### Advanced Helpers

- `custom({ success, status_code, message, data, errors, meta })`
- `send(res, payload)`
- `isSuccessStatus(statusCode)`
- `isErrorStatus(statusCode)`
- `paginationMeta({ page, limit, total, total_pages? })`
- `mergeMeta(...metaObjects)`

### Exported Types

- `ApiResponse`
- `BaseResponse`
- `SuccessResponse`
- `ErrorResponse`
- `CustomResponseInput`
- `Meta`
- `MetaValue`
- `PaginationDetails`
- `PaginationMetaInput`
- `ExpressLikeResponse`
- `ResponseDispatcher`

## Express Usage

```ts
import { notFound, ok, send } from '@abdullah/api-response-kit';

export async function getUser(req, res) {
  const user = await findUserById(req.params.id);

  if (!user) {
    return send(res, notFound('User not found'));
  }

  return send(res, ok(user, { request_id: req.id }));
}
```

`send()` uses `res.status(...).json(...)` for standard responses and `res.status(204).send()` for `noContent()` payloads.

## Custom Response Example

```ts
import { custom } from '@abdullah/api-response-kit';

const payload = custom({
  success: false,
  status_code: 409,
  message: 'Slug already exists',
  errors: [{ field: 'slug', code: 'duplicate' }],
  meta: { request_id: 'req_409' },
});
```

## Pagination Example

```ts
import { mergeMeta, ok, paginationMeta } from '@abdullah/api-response-kit';

const meta = mergeMeta(paginationMeta({ page: 2, limit: 25, total: 87 }), {
  request_id: 'req_page_2',
});

const payload = ok(
  [
    { id: 'u_1', name: 'Ada' },
    { id: 'u_2', name: 'Linus' },
  ],
  meta
);
```

## TypeScript Usage Example

```ts
import type { SuccessResponse } from '@abdullah/api-response-kit';
import { ok } from '@abdullah/api-response-kit';

type User = {
  id: string;
  name: string;
};

const payload: SuccessResponse<User, 200> = ok({
  id: 'u_123',
  name: 'Ada Lovelace',
});
```

## Error Response Examples

```ts
import {
  badRequest,
  tooManyRequests,
  unprocessableEntity,
} from '@abdullah/api-response-kit';

badRequest('Missing fields', [{ field: 'email' }]);
unprocessableEntity('Invalid input', { email: ['Already used'] });
tooManyRequests();
```

## Development Scripts

- `npm run clean`
- `npm run build`
- `npm run test`
- `npm run test:watch`
- `npm run lint`
- `npm run format`
- `npm run typecheck`

## Design Notes

- Returns plain serializable objects.
- Never mutates caller input.
- Omits `undefined` keys from output.
- Keeps the public API intentionally small.
- Treats invalid usage as a developer error with explicit exceptions.

## Publishing Notes

- The package is scoped and intended for public npm publishing: `@abdullah/api-response-kit`.
- Build output is generated into `dist/`.
- Declaration files are emitted alongside the ESM and CommonJS builds.
- `prepublishOnly` runs clean, lint, typecheck, tests, and build before publishing.

## License

MIT
