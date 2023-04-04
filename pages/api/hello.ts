// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Relationship, Room, RoomStudents, Student, StudentRelationship } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as RoomsJSON from './rooms.json';
import * as StudentJSON from './student.json';
import * as StudentsJSON from './students.json';
import * as RelationshipsJSON from './studentRelationships.json';
import * as StudentRooms from './studentRooms.json';

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
  RoomsJSON.forEach(room => {
    rooms.push({
      id: room.id,
      name: room.name,
      description: room.description
    })
  });

  return rooms;
};

export const getStudentRelationships = async (studentId: string): Promise<Relationship[]> => {
  let relationships: Relationship[] = [];

  RelationshipsJSON.forEach(relationship => {
    relationships.push({
      id: relationship.id,
      student: {
        id: relationship.student.id,
        name: relationship.student.name,
        surname: relationship.student.surname
      },
      relationshipType: relationship.relationshipType
    });
  });


  return relationships;
};

export const getStudentsFromRoom = async (roomId: string): Promise<Student[]> => {
  let students: Student[] = [];

  StudentsJSON.forEach(student => {
    students.push({
      id: student.id,
      name: student.name,
      surname: student.surname
    });
  });

  return students;
};