import Head from 'next/head'
import { GetStaticProps, GetStaticPropsResult } from 'next'
import { Room } from '@/types'
import Link from 'next/link'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import BasicCard from './components/BasicCard'
import { Container, Grid } from '@mui/material'
import PageTitle from './components/PageTitle'
import { getRoomsTable } from './api/utils'
import { createTheme, ThemeProvider, } from '@mui/material/styles'
import { ratherThemeOptions } from './theme/ratherThemeOptions'

const theme = createTheme(ratherThemeOptions);

interface Props {
  rooms: Room[];
}

export default function Index({ rooms }: Props) {

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Rather School App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <main>
        <PageTitle title="Room" description="rooms" />
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {
              rooms.map((room) => {
                return (
                  <Grid item key={room.id} xs={12} sm={6} md={4}>
                    <Link href={{ pathname: "/room/[id]", query: { id: room.id, name: room.name, description: room.description } }}>
                      <BasicCard id={room.id} title={room.name} description={room.description} textButton="Get Students" />
                    </Link>
                  </Grid>
                )
              })
            }
          </Grid>
        </Container>
      </main >
      <Footer />
    </ThemeProvider >
  )
}

export const getStaticProps: GetStaticProps<Props> = async (): Promise<GetStaticPropsResult<Props>> => {
  const rooms = await getRoomsTable();

  return {
    props: {
      rooms
    }
  };
}

