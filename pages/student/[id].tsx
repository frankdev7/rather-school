import Head from 'next/head'
import { GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Relationship } from '@/types'
import { getStudentRelationships } from '../api/utils'
import { useRouter } from 'next/router'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/navbar/Navbar'
import { Container, Grid } from '@mui/material'
import BasicCard from '../components/BasicCard'
import { createTheme, ThemeProvider, } from '@mui/material/styles';
import { ratherThemeOptions } from '../../ratherThemeOptions';

const theme = createTheme(ratherThemeOptions);

interface Props {
  relationships: Relationship[];
}

export default function StudentPage({ relationships }: Props) {
  const router = useRouter();
  const { name, surname } = router.query as { name: string, surname: string };
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Create Next App Student</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        {
          name && surname &&
          <PageTitle title={name} description={surname} />
        }
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {
              relationships && relationships.map((relationship) => {
                return (
                  <Grid item key={relationship.id} xs={12} sm={6} md={4}>
                    <BasicCard
                      id={relationship.id}
                      title={`${relationship.student.name}, ${relationship.student.surname}`}
                      description={relationship.relationshipType}
                      textButton="" />
                  </Grid>
                )
              })
            }
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> => {
  const { id } = params as { id: string };
  const relationships: Relationship[] = await getStudentRelationships(id);
  return {
    props: {
      relationships
    }
  };
}

