// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudentsByRoom } from './utils'
import { Room, Student, StudentsByRoom } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StudentsByRoom>
) {

  const { id } = req.query as { id: string };
  const students = await getStudentsByRoom(id);
  res.status(200).json(students)
}

