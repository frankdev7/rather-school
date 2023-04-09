import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


interface Props {
  id: string;
  title: string;
  description: string;
  textButton: string;
}

export default function BasicCard({ id, title, description, textButton }: Props) {
  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      {
        textButton !== "" &&
        <CardActions>
          <Button
            size="small"
          >{textButton}
          </Button>
        </CardActions>
      }
    </Card>
  );
}