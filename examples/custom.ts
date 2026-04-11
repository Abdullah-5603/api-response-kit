import { custom } from '../src';

const payload = custom({
  success: false,
  status_code: 409,
  message: 'Email already exists',
  errors: [{ field: 'email', code: 'duplicate' }],
  meta: { request_id: 'req_456' },
});

console.log(payload);
