// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRoomsTable } from './utils'
import { Room } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room[]>
) {

  const rooms = await getRoomsTable();
  res.status(200).json(rooms)
}

