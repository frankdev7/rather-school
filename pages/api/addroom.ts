// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRoomsTable } from './utils'
import { Room } from '@/types';
import fs from 'fs'
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { id, name, description } = req.body as { id: string, name: string, description: string };
    const room = { id, name, description };
    const rooms: Room[] = await getRoomsTable();
    rooms.push(room)
    const filePath = path.join(process.cwd(), 'pages/api/mocks', 'rooms.json');
    fs.writeFileSync(filePath, JSON.stringify(rooms))
    res.status(200).json(room)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

