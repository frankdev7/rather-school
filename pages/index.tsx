import Head from 'next/head'
import { Room } from '@/types'
import Link from 'next/link'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import BasicCard from './components/BasicCard'
import { Container, Grid } from '@mui/material'
import PageTitle from './components/PageTitle'
import { createTheme, ThemeProvider, } from '@mui/material/styles'
import { ratherThemeOptions } from '../ratherThemeOptions'
import axios from 'axios'
import { API_ROOMS, BASE } from '@/routes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const theme = createTheme(ratherThemeOptions);

export default function Index() {

  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    const roomsResponse = await axios.get(BASE + API_ROOMS);
    setRooms(roomsResponse.data);
  }

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
              rooms && rooms.map((room) => {
                return (
                  <Grid item key={room._id} xs={12} sm={6} md={4}>
                    <Link href={{ pathname: "/room/[page]", query: { page: room.name.toLowerCase(), id: room._id, name: room.name, description: room.description } }}>
                      <BasicCard id={room._id} title={room.name} description={room.description} textButton="Get Students" />
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
