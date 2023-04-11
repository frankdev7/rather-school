import { StudentRelationshipTable, Relationship, Room, RoomStudents, Student, StudentsByRoom, StudentRelationship, StudentRoomTable, StudentRoom } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as RoomTableJSON from './mocks/RoomTable.json';
import * as StudentTableJSON from './mocks/StudentTable.json';
import * as StudentRoomTableJSON from './mocks/StudentRoomTable.json';
import * as StudentRelationshipTableJSON from './mocks/StudentRelationshipTable.json';

export const getRoomsTable = async (): Promise<
  Room[]
> => {
  let rooms: Room[] = [];
  const roomTableJSON: Room[] = RoomTableJSON;

  roomTableJSON.forEach(room => {
    rooms.push({
      id: room.id,
      name: room.name,
      description: room.description
    })
  });

  return rooms;
};

export const getStudentTable = async (): Promise<
  Student[]
> => {
  let students: Student[] = [];
  const studentTableJSON: Student[] = StudentTableJSON;

  studentTableJSON.forEach(student => {
    students.push({
      id: student.id,
      name: student.name,
      surname: student.surname
    })
  });

  return students;
};

export const getStudentRoomTable = async (): Promise<
  StudentRoomTable[]
> => {
  let studentsRoom: StudentRoomTable[] = [];
  const studentRoomTableJSON: StudentRoomTable[] = StudentRoomTableJSON;

  studentRoomTableJSON.forEach(studentRoom => {
    studentsRoom.push({
      id: studentRoom.id,
      studentId: studentRoom.studentId,
      roomId: studentRoom.roomId
    })
  });

  return studentsRoom;
};

export const getStudentRelationshipTable = async (): Promise<
  StudentRelationshipTable[]
> => {
  let studentRelationshipTable: StudentRelationshipTable[] = [];
  const studentRelationshipTableJSON: StudentRelationshipTable[] = StudentRelationshipTableJSON;

  studentRelationshipTableJSON.forEach(studentRelationship => {
    studentRelationshipTable.push({
      id: studentRelationship.id,
      student1Id: studentRelationship.student1Id,
      student2Id: studentRelationship.student2Id,
      relationshipType: studentRelationship.relationshipType
    })
  });

  return studentRelationshipTable;
};

export const getStudents = async (): Promise<
  StudentRoom[]
> => {
  let roomStudents: StudentRoom[] = [];
  const studentRoomTable: StudentRoomTable[] = await getStudentRoomTable();
  const studentTableJSON: Student[] = StudentTableJSON;
  const roomTableJSON: Room[] = RoomTableJSON;

  studentRoomTable.forEach(studentRoom => {
    const studentIndex = studentTableJSON.findIndex((student) => student.id === studentRoom.studentId);
    const roomIndex = roomTableJSON.findIndex((room) => room.id === studentRoom.roomId);
    roomStudents.push({
      id: studentRoom.id,
      student: studentTableJSON[studentIndex],
      room: roomTableJSON[roomIndex]
    })
  });

  return roomStudents;
};

export const getStudentRelationships = async (studentId: string): Promise<Relationship[]> => {
  let relationships: Relationship[] = [];
  const studentRelationshipTableJSON: StudentRelationshipTable[] = StudentRelationshipTableJSON;
  const studentTableJSON: Student[] = StudentTableJSON;

  const studentRelationships: StudentRelationshipTable[] = studentRelationshipTableJSON.filter(
    studentRelationship => studentRelationship.student1Id === studentId);

  studentRelationships.forEach(studentRelationship => {
    const studentFound: Student | undefined = studentTableJSON.find(student => studentRelationship.student2Id === student.id);
    if (studentFound) {
      relationships.push({
        id: studentRelationship.id,
        student: studentFound,
        relationshipType: studentRelationship.relationshipType
      });
    }
  });

  return relationships;
};

export const getStudentsByRoom = async (roomId: string): Promise<StudentsByRoom> => {
  const studentRoomTableJSON: StudentRoomTable[] = StudentRoomTableJSON;
  const studentsRoom: StudentRoomTable[] = studentRoomTableJSON.filter(studentRoom => studentRoom.roomId === roomId);
  const studentTableJSON: Student[] = StudentTableJSON;

  let students: Student[] = [];
  studentsRoom.forEach(studentRoom => {
    const studentFound = studentTableJSON.find(student => studentRoom.studentId === student.id);
    if (studentFound)
      students.push(studentFound);
  });

  return {
    roomId: roomId,
    students: students
  };
};