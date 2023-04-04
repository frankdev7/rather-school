export interface Room {
  id: string;
  name: string;
  description: string;
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
