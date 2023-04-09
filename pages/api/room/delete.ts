// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRoomsTable } from '../utils'
import { Room } from '@/types';
import fs from 'fs'
import path from 'path';
import { RoomTableJSON } from '../constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };

    const rooms: Room[] = await getRoomsTable();
    const roomIndex = rooms.findIndex((room) => room.id === id)
    if (roomIndex === -1) {
      res.status(404).json({ message: `Room with ID ${id} not found` })
    } else {
      rooms.splice(roomIndex, 1);
      const filePath = path.join(process.cwd(), 'pages/api/mocks', RoomTableJSON);
      fs.writeFileSync(filePath, JSON.stringify(rooms))
      res.status(200).json({ message: 'Room Deleted' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

