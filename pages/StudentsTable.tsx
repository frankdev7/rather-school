import { Box, Button, Container, Modal, Paper, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Room, RoomColumn, Student, StudentRoom, StudentRoomColumn, StudentRoomDetail } from "@/types";
import axios from "axios";
import { RoomModal } from "./RoomModal";
import { v4 as uuidv4 } from 'uuid';
import { EDIT, SAVE } from "./util";
import { getStudentsByRoom } from "./api/utils";
import { StudentModal } from "./StudentModal";

export default function StudentsTable() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [studentsRoom, setStudentsRoom] = useState<StudentRoom[]>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<string>("");
  const [editingStudentRoom, setEditingStudentRoom] = useState<StudentRoom>(null);
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
  }, []);

  const getStudentsByRoom = async () => {
    const studentsRoomRs: StudentRoom[] = (await axios.get("/api/allstudents")).data;
    setStudentsRoom(studentsRoomRs);
  }


  const getRooms = async () => {
    const rooms = await axios.post("/api/rooms");
    setRooms(rooms.data);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenAddModal = () => {
    setAction(SAVE);
    setRoom(rooms[0].id)
    setEditingStudentRoom({ id: '', student: { id: '', name: '', surname: '' }, room: { id: room, name: '', description: '' } });
  }

  const handleOpenEditStudentRoomModal = (studentRoom: StudentRoom) => {
    setAction(EDIT);
    setEditingStudentRoom(studentRoom);
    setRoom(studentRoom.room.id)
  };

  const handleCloseRoomModal = () => {
    setAction("");
    setEditingStudentRoom(null);
  };

  const handleRoomChange = (event: SelectChangeEvent) => {
    setRoom(event.target.value);
  };

  const handleEdit = async (editedStudentRoom: StudentRoom) => {
    await axios.put("/api/student/edit?id=" + editedStudentRoom.id, {
      student: editedStudentRoom.student,
      roomId: room
    });
    const roomIndex = rooms.findIndex(roomItem => roomItem.id === room)
    handleCloseRoomModal();
    setStudentsRoom(prevStudentsRoom =>
      prevStudentsRoom.map(studentsRoom => {
        if (studentsRoom.id === editedStudentRoom.id) {
          return {
            id: studentsRoom.id,
            student: editedStudentRoom.student,
            room: rooms[roomIndex]
          };
        } else {
          return studentsRoom;
        }
      }));
  }

  const handleSave = async (newStudentRoom: StudentRoom) => {
    newStudentRoom.id = uuidv4();
    newStudentRoom.student.id = uuidv4();

    await axios.post("/api/student/add", {
      id: newStudentRoom.id,
      student: newStudentRoom.student,
      roomId: room
    });
    console.log(newStudentRoom)
    handleCloseRoomModal();
    // setStudentsRoom(prevStudentsRoom => [...prevStudentsRoom, newRoom]);
  }

  const handleDelete = async (studentId: string, studentRoomRelationshipId: string) => {
    await axios.delete("/api/deleteroom?id=" + studentId);
    await axios.delete("/api/deleteroom?id=" + studentRoomRelationshipId);
    handleCloseRoomModal();
    // setRooms(prevRooms =>
    //   prevRooms.filter(room => room.id !== id)
    // );
  }

  return (
    <Container sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth="lg">

      <Typography variant="h4" gutterBottom>
        Students
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
                      <TableRow hover role="checkbox" tabIndex={-1} key={studentRoom.id}>
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
                          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenEditStudentRoomModal(studentRoom)}>
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(studentRoom.student.id, studentRoom.id)}>
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
      <StudentModal
        title="Edit Student"
        open={action === EDIT}
        editingStudentRoom={editingStudentRoom}
        setEditingStudentRoom={setEditingStudentRoom}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleEdit}
        room={room}
        rooms={rooms}
        handleRoomChange={handleRoomChange}
      />
      <StudentModal
        title="Add Student"
        open={action === SAVE}
        editingStudentRoom={editingStudentRoom}
        setEditingStudentRoom={setEditingStudentRoom}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleSave}
        room={room}
        rooms={rooms}
        handleRoomChange={handleRoomChange}
      />
    </Container>
  );
}