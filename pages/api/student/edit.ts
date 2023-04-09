// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudentRoomTable, getStudentTable } from '../utils'
import { Room, Student, StudentRoomTable } from '@/types';
import fs from 'fs'
import path from 'path';
import { StudentTableJSON } from '../constants';
import { StudentRoomTableJSON } from '../constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const { id } = req.query as { id: string };
    const { student, roomId } = req.body as { student: Student, roomId: string };

    const studentRoomTable: StudentRoomTable[] = await getStudentRoomTable();
    const studentRoomIndex = studentRoomTable.findIndex((studentRoom) => studentRoom.id === id);

    const studentTable: Student[] = await getStudentTable();
    const studentIndex = studentTable.findIndex((studentItem) => studentItem.id === student.id);

    if (studentRoomIndex === -1)
      return res.status(404).json({ message: `Room with ID ${id} not found` });

    if (studentIndex === -1)
      return res.status(404).json({ message: `Student with ID ${student.id} not found` });

    const updatedStudent = { ...studentTable[studentIndex], name: student.name, surname: student.surname };
    studentTable[studentIndex] = updatedStudent;
    const filePathStudentTable = path.join(process.cwd(), 'pages/api/mocks', StudentTableJSON);
    fs.writeFileSync(filePathStudentTable, JSON.stringify(studentTable))

    const updatedStudentRoom = { ...studentRoomTable[studentRoomIndex], roomId }
    studentRoomTable[studentRoomIndex] = updatedStudentRoom;
    const filePathStudentRoomTable = path.join(process.cwd(), 'pages/api/mocks', StudentRoomTableJSON);
    fs.writeFileSync(filePathStudentRoomTable, JSON.stringify(studentRoomTable))

    return res.status(200).json({ id, student: updatedStudent, roomId })

  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

