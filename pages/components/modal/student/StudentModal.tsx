import { Room, StudentRoom } from "@/types";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

interface Props {
  title: string;
  open: boolean;
  editingStudentRoom: StudentRoom | null;
  setEditingStudentRoom: (studentRoom: StudentRoom) => void;
  handleCloseRoomModal: () => void;
  handleSave: (room: any) => Promise<void>;
  rooms: Room[];
  room: string;
  handleRoomChange: (event: SelectChangeEvent) => void;
}

export default function StudentModal({
  title,
  open,
  editingStudentRoom,
  handleCloseRoomModal,
  setEditingStudentRoom,
  handleSave,
  rooms,
  room,
  handleRoomChange
}: Props) {

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseRoomModal}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
            {title}
          </Typography>
          <TextField
            label="Name"
            value={editingStudentRoom?.student.name || ''}
            onChange={(event) => {
              if (editingStudentRoom)
                setEditingStudentRoom({ ...editingStudentRoom, student: { ...editingStudentRoom.student, name: event.target.value } })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Surname"
            value={editingStudentRoom?.student.surname || ''}
            onChange={(event) => {
              if (editingStudentRoom)
                setEditingStudentRoom({ ...editingStudentRoom, student: { ...editingStudentRoom.student, surname: event.target.value } })
            }}
            fullWidth
            margin="normal"
          />

          <FormControl sx={{ mt: 2, minWidth: 150 }}>

            <InputLabel id="demo-simple-select-label">Room</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={room}
              label="Age"
              onChange={handleRoomChange}
            >
              {
                rooms && rooms.map(room => (
                  <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>

                ))
              }
            </Select>
          </FormControl>

          {/* <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Profile Image
            <input hidden accept="image/*" multiple type="file" />
          </Button> */}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleCloseRoomModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleSave(editingStudentRoom)} disabled={!editingStudentRoom?.student.name || !editingStudentRoom?.student.surname}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}