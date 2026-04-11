import { mergeMeta, ok, paginationMeta } from '../src';

const meta = mergeMeta(paginationMeta({ page: 2, limit: 20, total: 87 }), {
  request_id: 'req_789',
});

console.log(
  ok(
    [
      { id: 'u_1', name: 'Ada' },
      { id: 'u_2', name: 'Linus' },
    ],
    meta
  )
);
