import { Room, Student, StudentRoom } from "@/types";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

interface Props {
  title: string;
  open: boolean;
  handleCloseRoomModal: () => void;
  handleSave: (studentId: string, roomId: string) => Promise<void>;
  rooms: Room[];
  room: string;
  students: Student[];
  student: string;
  handleSelectStudentChange: (event: SelectChangeEvent) => void;
  handleSelectRoomChange: (event: SelectChangeEvent) => void;
}

export default function StudentRoomModal({
  title,
  open,
  handleCloseRoomModal,
  handleSave,
  rooms,
  room,
  students,
  student,
  handleSelectStudentChange,
  handleSelectRoomChange
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
          <FormControl sx={{ mt: 2, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Student</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={student}
              label="Student"
              onChange={handleSelectStudentChange}
            >
              {
                students && students.map(student => (
                  <MenuItem key={student._id} value={student._id}>{student.name} {student.surname}</MenuItem>

                ))
              }
            </Select>
          </FormControl>
          <br></br>
          <FormControl sx={{ mt: 2, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Room</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={room}
              label="Room"
              onChange={handleSelectRoomChange}
            >
              {
                rooms && rooms.map(room => (
                  <MenuItem key={room._id} value={room._id}>{room.name}</MenuItem>

                ))
              }
            </Select>
          </FormControl>
          <br></br>
          <br></br>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleCloseRoomModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleSave(student, room)}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}