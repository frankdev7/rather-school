// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudentRoomTable } from './utils'
import { Room, Student, StudentRoomTable } from '@/types';
import fs from 'fs'
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const { id } = req.query as { id: string };
    const { student, roomId } = req.body as { student: Student, roomId: string };

    const studentRoomTable: StudentRoomTable[] = await getStudentRoomTable();
    const studentRoomIndex = studentRoomTable.findIndex((studentRoom) => studentRoom.id === id)
    if (studentRoomIndex === -1) {
      res.status(404).json({ message: `Room with ID ${id} not found` })
    } else {
      const updatedStudentRoom = { ...studentRoomTable[studentRoomIndex], roomId }
      studentRoomTable[studentRoomIndex] = updatedStudentRoom;
      const filePath = path.join(process.cwd(), 'pages/api/mocks', 'StudentRoomTable.json');
      fs.writeFileSync(filePath, JSON.stringify(studentRoomTable))
      res.status(200).json(updatedStudentRoom)
    }
    res.status(200).json(req.body)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

