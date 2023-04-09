// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudents, getStudentsByRoom } from './utils'
import { Room, StudentRoom, Student, StudentsByRoom } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const studentsRoom: StudentRoom[] = await getStudents();
    res.status(200).json(studentsRoom);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

