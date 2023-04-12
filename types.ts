export interface Room {
  _id: string;
  name: string;
  description: string;
}

export interface StudentRoom {
  _id: string;
  student: Student;
  room: Room;
}
export interface Student {
  _id: string;
  name: string;
  surname: string;
}
export interface Relationship {
  _id: string,
  student1: Student;
  student2: Student;
  relationship: string;
}

export interface RoomColumn {
  id: 'id' | 'name' | 'description';
  label: string;
  minWidth?: number;
  align?: 'right';
}
export interface StudentColumn {
  id: 'id' | 'name' | 'surname';
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