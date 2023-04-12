import { Room, Student } from "@/types";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface Props {
  title: string;
  open: boolean;
  editingStudent: Student | null;
  setEditingStudent: (student: Student) => void;
  handleCloseStudentModal: () => void;
  handleSave: (student: Student) => Promise<void>;
}

export default function StudentModal({ title, open, editingStudent, handleCloseStudentModal, setEditingStudent, handleSave }: Props) {
  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseStudentModal}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
          <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
            {title}
          </Typography>
          <TextField
            label="Name"
            value={editingStudent?.name || ''}
            onChange={(event) => {
              if (editingStudent)
                setEditingStudent({
                  ...editingStudent, name: event.target.value,
                  surname: ""
                })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Surname"
            value={editingStudent?.surname || ''}
            onChange={(event) => {
              if (editingStudent)
                setEditingStudent({ ...editingStudent, surname: event.target.value })
            }}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleCloseStudentModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={
              () => {
                if (editingStudent)
                  handleSave(editingStudent)
              }}
              disabled={!editingStudent?.name || !editingStudent?.surname}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}