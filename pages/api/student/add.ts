// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRoomsTable, getStudentRoomTable, getStudentTable } from '../utils'
import { Room, Student, StudentRoomTable } from '@/types';
import fs from 'fs'
import path from 'path';
import { StudentTableJSON } from '../constants';
import { StudentRoomTableJSON } from '../constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { id, student, roomId } = req.body as { id: string, student: Student, roomId: string };

    const studentTable: Student[] = await getStudentTable();
    studentTable.push(student)
    const filePathStudentTable = path.join(process.cwd(), 'pages/api/mocks', StudentTableJSON);
    fs.writeFileSync(filePathStudentTable, JSON.stringify(studentTable))

    const studentRoomTable: StudentRoomTable[] = await getStudentRoomTable();
    studentRoomTable.push({ id, studentId: student.id, roomId })
    const filePathStudentRoomTable = path.join(process.cwd(), 'pages/api/mocks', StudentRoomTableJSON);
    fs.writeFileSync(filePathStudentRoomTable, JSON.stringify(studentRoomTable))

    res.status(200).json({ id, studentId: student.id, roomId })
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

