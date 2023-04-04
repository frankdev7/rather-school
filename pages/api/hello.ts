// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Room } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Rooms from './rooms.json';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}

export const getRooms = async (): Promise<
  Room[]
> => {
  let rooms: Room[] = [];
  Rooms.forEach(room => {
    rooms.push({
      id: room.id,
      name: room.name,
      description: room.description
    })
  });

  return rooms;
};