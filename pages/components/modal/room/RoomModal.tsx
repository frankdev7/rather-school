import { Room } from "@/types";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface Props {
  title: string;
  open: boolean;
  editingRoom: Room | null;
  setEditingRoom: (room: Room) => void;
  handleCloseRoomModal: () => void;
  handleSave: (room: Room) => Promise<void>;
}

export default function RoomModal({ title, open, editingRoom, handleCloseRoomModal, setEditingRoom, handleSave }: Props) {
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
            value={editingRoom?.name || ''}
            onChange={(event) => {
              if (editingRoom)
                setEditingRoom({ ...editingRoom, name: event.target.value })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editingRoom?.description || ''}
            onChange={(event) => {
              if (editingRoom)
                setEditingRoom({ ...editingRoom, description: event.target.value })
            }}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleCloseRoomModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={
              () => {
                if (editingRoom)
                  handleSave(editingRoom)
              }}
              disabled={!editingRoom?.name || !editingRoom?.description}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}