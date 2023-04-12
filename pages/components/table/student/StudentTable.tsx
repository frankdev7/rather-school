import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Student, StudentColumn } from "@/types";
import axios from "axios";
import Constants from "../../../../util";
import { API_STUDENTS, BASE } from "@/routes";
import StudentModal from "../../modal/student/StudentModal";

export default function StudentTable() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [action, setAction] = useState<string>("");

  const columns: readonly StudentColumn[] = [
    { id: 'id', label: 'Code', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'surname', label: 'Surname', minWidth: 120 },
  ];

  useEffect(() => {
    getStudents();
  }, []);

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
    setEditingStudent({ _id: '', name: '', surname: '' });
  }

  const handleOpenEditStudentModal = (student: Student) => {
    setAction(Constants.EDIT);
    setEditingStudent(student);
  };

  const handleCloseStudentModal = () => {
    setAction("");
    setEditingStudent(null);
  };

  const handleEdit = async (editedStudent: Student) => {
    await axios.put(BASE + API_STUDENTS + editedStudent._id, {
      name: editedStudent.name,
      surname: editedStudent.surname
    });
    handleCloseStudentModal();
    setStudents(prevStudents => prevStudents.map(student => {
      if (student._id === editedStudent._id) {
        return editedStudent;
      } else {
        return student;
      }
    }));
  }

  const handleSave = async (newStudent: Student) => {
    const studentResponse = await axios.post(BASE + API_STUDENTS, {
      name: newStudent.name,
      surname: newStudent.surname
    });
    handleCloseStudentModal();
    setStudents(prevStudents => [...prevStudents, studentResponse.data]);
  }

  const handleDelete = async (id: string) => {
    await axios.delete(BASE + API_STUDENTS + id);
    handleCloseStudentModal();
    setStudents(prevStudents =>
      prevStudents.filter(student => student._id !== id)
    );
  }

  return (
    <Container sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth="lg">

      <Typography variant="h4" gutterBottom>
        Students
      </Typography>

      <Button variant="outlined" startIcon={<AddIcon />} sx={{ my: 4 }} onClick={() => handleOpenAddModal()}>
        Add
      </Button>

      {students &&
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
                {students
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student, i) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={student._id}>
                        <TableCell align="left">
                          {i + 1}
                        </TableCell>
                        <TableCell align="left">
                          {student.name}
                        </TableCell>
                        <TableCell align="left">
                          {student.surname}
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenEditStudentModal(student)}>
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(student._id)}>
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
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      }
      <StudentModal
        title="Edit Student"
        open={action === Constants.EDIT}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
        handleCloseStudentModal={handleCloseStudentModal}
        handleSave={handleEdit}
      />
      <StudentModal
        title="Add Student"
        open={action === Constants.SAVE}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
        handleCloseStudentModal={handleCloseStudentModal}
        handleSave={handleSave}
      />
    </Container>
  );
}