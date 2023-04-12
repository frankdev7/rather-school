import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Room, RoomColumn } from "@/types";
import axios from "axios";
import Constants from "../../../../util";
import { API_ROOMS, BASE } from "@/routes";
import RoomModal from "../../modal/room/RoomModal";

export default function RoomTable() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
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
    const roomsResponse = await axios.get(BASE + API_ROOMS);
    setRooms(roomsResponse.data);
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
    setEditingRoom({ _id: '', name: '', description: '' });
  }

  const handleOpenEditRoomModal = (room: Room) => {
    setAction(Constants.EDIT);
    setEditingRoom(room);
  };

  const handleCloseRoomModal = () => {
    setAction("");
    setEditingRoom(null);
  };

  const handleEdit = async (editedRoom: Room) => {
    await axios.put(BASE + API_ROOMS + editedRoom._id, editedRoom);
    handleCloseRoomModal();
    setRooms(prevRooms => prevRooms.map(room => {
      if (room._id === editedRoom._id) {
        return editedRoom;
      } else {
        return room;
      }
    }));
  }

  const handleSave = async (newRoom: Room) => {
    const roomResponse = await axios.post(BASE + API_ROOMS, newRoom);
    handleCloseRoomModal();
    setRooms(prevRooms => [...prevRooms, roomResponse.data]);
  }

  const handleDelete = async (id: string) => {
    await axios.delete(BASE + API_ROOMS + id);
    handleCloseRoomModal();
    setRooms(prevRooms =>
      prevRooms.filter(room => room._id !== id)
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
                      <TableRow hover role="checkbox" tabIndex={-1} key={room._id}>
                        <TableCell align="left">
                          {i + 1}
                        </TableCell>
                        <TableCell align="left">
                          {room.name}
                        </TableCell>
                        <TableCell align="left">
                          {room.description}
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenEditRoomModal(room)}>
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(room._id)}>
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
        open={action === Constants.EDIT}
        editingRoom={editingRoom}
        setEditingRoom={setEditingRoom}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleEdit}
      />
      <RoomModal
        title="Add Room"
        open={action === Constants.SAVE}
        editingRoom={editingRoom}
        setEditingRoom={setEditingRoom}
        handleCloseRoomModal={handleCloseRoomModal}
        handleSave={handleSave}
      />
    </Container>
  );
}