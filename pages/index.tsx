import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { GetStaticProps, GetStaticPropsResult } from 'next'
import { Room } from '@/types'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BasicCard from './components/BasicCard'
import { Box, Container, Grid, Typography } from '@mui/material'
import PageTitle from './components/PageTitle'
import axios from 'axios'
import { getRooms } from './api/utils'
const inter = Inter({ subsets: ['latin'] })

interface Props {
  rooms: Room[];
}

export default function Index({ rooms }: Props) {

  return (
    <>
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
                      <BasicCard id={room.id} title={room.name} description={room.description} textButton="Get Students"/>
                    </Link>
                  </Grid>
                )
              })
            }
          </Grid>
        </Container>
      </main >
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (): Promise<GetStaticPropsResult<Props>> => {
  const rooms = await getRooms();
  console.log(rooms)

  return {
    props: {
      rooms
    }
  };
}

