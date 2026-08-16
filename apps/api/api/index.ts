import { VercelRequest, VercelResponse } from '@vercel/node';
import { getServer } from '../src/main';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await getServer();
  server(req as any, res as any);
}