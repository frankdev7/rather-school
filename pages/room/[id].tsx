import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Room, RoomStudents, Student, StudentRelationship, StudentsByRoom } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import { Container, Grid } from '@mui/material'
import BasicCard from '../components/BasicCard'
import { getStudentsByRoom } from '../api/utils'

const inter = Inter({ subsets: ['latin'] })

interface Props {
  students: Student[];
}

export default function RoomPage({ students }: Props) {
  const router = useRouter();
  const { name, description } = router.query as { name: string, description: string };

  return (
    <>
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
    </>
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
  console.log("PROPS: ", studentsByRoom)
  return {
    props: {
      students: studentsByRoom.students
    }
  };
}

