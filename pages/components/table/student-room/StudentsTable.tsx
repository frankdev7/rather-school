import { Button, Container, Modal, Paper, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Room, Student, StudentRoom, StudentRoomColumn } from "@/types";
import axios from "axios";
import Constants from "../../../../util";
import { API_ROOMS, API_STUDENTS, API_STUDENTS_ROOMS, API_STUDENTS_ROOMS_DETAIL, BASE } from "@/routes";
import StudentRoomModal from "../../modal/student-room/StudentRoomModal";

export default function StudentsRoomTable() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [studentsRoom, setStudentsRoom] = useState<StudentRoom[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<string>("");
  const [action, setAction] = useState<string>("");

  const columns: readonly StudentRoomColumn[] = [
    { id: 'id', label: 'Code', minWidth: 30 },
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'surname', label: 'Surname', minWidth: 120 },
    { id: 'roomName', label: 'Room', minWidth: 120 },
  ];

  useEffect(() => {
    getStudentsByRoom();
    getRooms();
    getStudents();
  }, []);

  const getStudentsByRoom = async () => {
    const responseStudentsRoomsResponse = await axios.get(BASE + API_STUDENTS_ROOMS_DETAIL);
    setStudentsRoom(responseStudentsRoomsResponse.data);
  }

  const getRooms = async () => {
    const roomsResponse = await axios.get(BASE + API_ROOMS);
    setRooms(roomsResponse.data);
  }

  const getStudents = async () => {
    const studentsResponse = await axios.get(BASE + API_STUDENTS);
    setStudents(studentsResponse.data);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenAddModal = () => {
    setAction(Constants.SAVE);
    setRoom(rooms[0]._id)
    setStudent(students[0]._id)
  }

  const handleCloseRoomModal = () => {
    setAction("");
  };

  const handleSave = async (studentId: string, roomId: string) => {
    const studentRoomResponse = await axios.post(BASE + API_STUDENTS_ROOMS, {
      studentId,
      roomId
    });
    handleCloseRoomModal();
    setStudentsRoom(prevStudentsRoom =>
      [...prevStudentsRoom, studentRoomResponse.data]
    )
  }

  const handleDelete = async (studentRoomId: string) => {
    await axios.delete(BASE + API_STUDENTS_ROOMS + studentRoomId);
    handleCloseRoomModal();
    setStudentsRoom(prevStudentsRoom =>
      prevStudentsRoom.filter(studentRoom => studentRoom._id !== studentRoomId)
    );
  }

  const handleSelectRoomChange = (event: SelectChangeEvent) => {
    setRoom(event.target.value);
  };

  const handleSelectStudentChange = (event: SelectChangeEvent) => {
    setStudent(event.target.value);
  };

  return (
    <Container sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth="lg">

      <Typography variant="h4" gutterBottom>
        Student Rooms
      </Typography>

      <Button variant="outlined" startIcon={<AddIcon />} sx={{ my: 4 }} onClick={() => handleOpenAddModal()}>
        Add
      </Button>

      {studentsRoom &&
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsRoom
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((studentRoom, i) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={studentRoom._id}>
                        <TableCell align="left">
                          {i + 1}
                        </TableCell>
                        <TableCell align="left">
                          {studentRoom.student.name}
                        </TableCell>
                        <TableCell align="left">
                          {studentRoom.student.surname}
                        </TableCell>
                        <TableCell align="left">
                          {studentRoom.room.name}
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(studentRoom._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={studentsRoom.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      }
      <StudentRoomModal
        title="Add Student Room"
        open={action === Constants.SAVE}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleSave}
        room={room}
        rooms={rooms}
        student={student}
        students={students}
        handleSelectStudentChange={handleSelectStudentChange}
        handleSelectRoomChange={handleSelectRoomChange}
      />
    </Container>
  );
}