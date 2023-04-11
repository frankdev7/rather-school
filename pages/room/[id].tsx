import Head from 'next/head'
import { GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Student, StudentsByRoom } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/PageTitle'
import { Container, Grid } from '@mui/material'
import BasicCard from '../components/BasicCard'
import { getStudentsByRoom } from '../api/utils'
import { createTheme, ThemeProvider, } from '@mui/material/styles';
import { ratherThemeOptions } from '../../ratherThemeOptions';

const theme = createTheme(ratherThemeOptions);

interface Props {
  students: Student[];
}

export default function RoomPage({ students }: Props) {
  const router = useRouter();
  const { name, description } = router.query as { name: string, description: string };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Rather School App Room </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main>
        <PageTitle title={name} description={description} />
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {students &&
              students.map((student) => {
                return (
                  <Grid item key={student.id} xs={12} sm={6} md={4}>
                    <Link href={{ pathname: "/student/[id]", query: { id: student.id, name: student.name, surname: student.surname } }}>
                      <BasicCard id={student.id} title={student.name} description={student.surname} textButton="Get Relationships" />
                    </Link>
                  </Grid>
                )
              })
            }
          </Grid>
        </Container>
      </main >
    </ThemeProvider>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }:
  GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> => {
  const { id } = params as { id: string };
  const studentsByRoom: StudentsByRoom = await getStudentsByRoom(id);
  return {
    props: {
      students: studentsByRoom.students
    }
  };
}

