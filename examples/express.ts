import { notFound, ok, send } from '../src';

type RequestLike = {
  params?: Record<string, string>;
};

type ResponseLike = {
  status(statusCode: number): {
    json(payload: unknown): unknown;
    send(): unknown;
  };
};

export function getUser(_req: RequestLike, res: ResponseLike): void {
  const user = { id: 'u_123', name: 'Ada Lovelace' };

  if (!user) {
    send(res, notFound('User not found'));
    return;
  }

  send(res, ok(user, { request_id: 'req_123' }));
}
