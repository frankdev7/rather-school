import { Box, Button, Container, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Room, RoomColumn } from "@/types";
import axios from "axios";
import { RoomModal } from "./RoomModal";
import { v4 as uuidv4 } from 'uuid';
import { EDIT, SAVE } from "./util";

export default function RoomsTable() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rooms, setRooms] = useState<Room[]>();
  const [editingRoom, setEditingRoom] = useState<Room>(null);
  const [action, setAction] = useState<string>("");

  const columns: readonly RoomColumn[] = [
    { id: 'id', label: 'Code', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'description', label: 'Description', minWidth: 120 },
  ];

  useEffect(() => {
    getRooms();
  }, []);

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
    setEditingRoom({ id: '', name: '', description: '' });
  }

  const handleOpenEditRoomModal = (room: Room) => {
    setAction(EDIT);
    setEditingRoom(room);
  };

  const handleCloseRoomModal = () => {
    setAction("");
    setEditingRoom(null);
  };

  const handleEdit = async (editedRoom: Room) => {
    await axios.put("/api/room/edit?id=" + editedRoom.id, editedRoom);
    handleCloseRoomModal();
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id === editedRoom.id) {
        return editedRoom;
      } else {
        return room;
      }
    }));
  }

  const handleSave = async (newRoom: Room) => {
    newRoom.id = uuidv4();
    await axios.post("/api/room/add", newRoom);
    handleCloseRoomModal();
    setRooms(prevRooms => [...prevRooms, newRoom]);
  }

  const handleDelete = async (id: string) => {
    await axios.delete("/api/room/delete?id=" + id);
    handleCloseRoomModal();
    setRooms(prevRooms =>
      prevRooms.filter(room => room.id !== id)
    );
  }

  return (
    <Container sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth="lg">

      <Typography variant="h4" gutterBottom>
        Rooms
      </Typography>

      <Button variant="outlined" startIcon={<AddIcon />} sx={{ my: 4 }} onClick={() => handleOpenAddModal()}>
        Add
      </Button>

      {rooms &&
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
                {rooms
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((room, i) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={room.id}>
                        {columns.map((column) => {
                          const value = room[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenEditRoomModal(room)}>
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(room.id)}>
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
            count={rooms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      }
      <RoomModal
        title="Edit Room"
        open={action === EDIT}
        editingRoom={editingRoom}
        setEditingRoom={setEditingRoom}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleEdit}
      />
      <RoomModal
        title="Add Room"
        open={action === SAVE}
        editingRoom={editingRoom}
        setEditingRoom={setEditingRoom}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleSave}
      />
    </Container>
  );
}