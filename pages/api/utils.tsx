import { Relationship, Room, RoomStudents, Student, StudentsByRoom, StudentRelationship, StudentRoomTable, StudentRoom } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as RoomTableJSON from './mocks/RoomTable.json';
import * as StudentTableJSON from './mocks/StudentTable.json';
import * as StudentRoomTableJSON from './mocks/StudentRoomTable.json';
import * as RelationshipsJSON from './mocks/studentRelationships.json';
import * as StudentsByRoomJSON from './mocks/studentsByRoom.json';
import * as StudentRoomsResponseJSON from './mocks/studentRoomsResponse.json';

export const getRoomsTable = async (): Promise<
  Room[]
> => {
  let rooms: Room[] = [];
  RoomTableJSON.forEach(room => {
    rooms.push({
      id: room.id,
      name: room.name,
      description: room.description
    })
  });

  return rooms;
};

export const getStudentRoomTable = async (): Promise<
  StudentRoomTable[]
> => {
  let studentsRoom: StudentRoomTable[] = [];
  StudentRoomTableJSON.forEach(studentRoom => {
    studentsRoom.push({
      id: studentRoom.id,
      studentId: studentRoom.studentId,
      roomId: studentRoom.roomId
    })
  });

  return studentsRoom;
};

export const getStudents = async (): Promise<
  StudentRoom[]
> => {
  let roomStudents: StudentRoom[] = [];
  const studentRoomTable: StudentRoomTable[] = await getStudentRoomTable();

  studentRoomTable.forEach(studentRoom => {
    const studentIndex = StudentTableJSON.findIndex((student) => student.id === studentRoom.studentId);
    const roomIndex = RoomTableJSON.findIndex((room) => room.id === studentRoom.roomId);

    roomStudents.push({
      id: studentRoom.id,
      student: StudentTableJSON[studentIndex],
      room: RoomTableJSON[roomIndex]
    })
  });

  return roomStudents;
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

export const getStudentsByRoom = async (roomId: string): Promise<StudentsByRoom> => {
  return {
    roomId: StudentsByRoomJSON.roomId,
    students: StudentsByRoomJSON.students
  };
};