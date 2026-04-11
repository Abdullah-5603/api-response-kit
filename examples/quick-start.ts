import { ok } from '../src';

const payload = ok(
  {
    user: {
      id: 'u_123',
      name: 'Ada Lovelace',
    },
  },
  { request_id: 'req_123' }
);

console.log(payload);
