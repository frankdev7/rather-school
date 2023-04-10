// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRoomsTable, getStudentRelationshipTable, getStudentRelationships, getStudentRoomTable, getStudentTable } from '../utils'
import { Room, Student, StudentRelationshipTable, StudentRoom, StudentRoomTable } from '@/types';
import fs from 'fs'
import path from 'path';
import { StudentRelationshipTableJSON, StudentRoomTableJSON, StudentTableJSON } from '../constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };

    const students: Student[] = await getStudentTable();
    const studentRooms: StudentRoomTable[] = await getStudentRoomTable();
    const studentRelationships: StudentRelationshipTable[] = await getStudentRelationshipTable();

    const studentIndex = students.findIndex((student) => student.id === id)
    if (studentIndex === -1) {
      res.status(404).json({ message: `Student with ID ${id} not found` })
    } else {
      students.splice(studentIndex, 1);
      const filePath = path.join(process.cwd(), 'pages/api/mocks', StudentTableJSON);
      fs.writeFileSync(filePath, JSON.stringify(students))

      const updatedStudentRooms = studentRooms.filter((studentRoom) => studentRoom.studentId !== id);
      const studentRoomsFilePath = path.join(process.cwd(), 'pages/api/mocks', StudentRoomTableJSON);
      fs.writeFileSync(studentRoomsFilePath, JSON.stringify(updatedStudentRooms));

      const updatedStudentRelationhipsUpdated = studentRelationships.filter(studentRelationship =>
        studentRelationship.student1Id !== id ||
        studentRelationship.student2Id !== id);
      const studentRelationshipFilePath = path.join(process.cwd(), 'pages/api/mocks', StudentRelationshipTableJSON);
      fs.writeFileSync(studentRelationshipFilePath, JSON.stringify(updatedStudentRelationhipsUpdated));

      res.status(200).json({ message: 'Student Deleted' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

