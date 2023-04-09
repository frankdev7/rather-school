export interface Room {
  id: string;
  name: string;
  description: string;
}

export interface StudentRoomTable {
  id: string;
  studentId: string;
  roomId: string;
}

export interface StudentRelationshipTable {
  id: string;
  student1Id: string;
  student2Id: string;
  relationshipType: string;
}

export interface StudentRoom {
  id: string;
  student: Student;
  room: Room;
}

export interface StudentRoomDetail {
  id: string;
  name: string;
  surname: string;
  roomName: string;
}

export interface RoomStudents {
  id: string;
  students: Student[];
}

export interface Student {
  id: string;
  name: string;
  surname: string;
}

export interface StudentsByRoom {
  roomId: string;
  students: Student[];
}
export interface StudentRelationship {
  id: string;
  name: string;
  surname: string;
  relationships: Relationship[];
}

export interface Relationship {
  id: string,
  student: Student;
  relationshipType: string;
}

export interface RoomColumn {
  id: 'id' | 'name' | 'description';
  label: string;
  minWidth?: number;
  align?: 'right';
}
export interface StudentRoomColumn {
  id: 'id' | 'name' | 'surname' | 'roomName';
  label: string;
  minWidth?: number;
  align?: 'right';
}