import { Box, Button, Container, Paper, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import RegisterPatientForm from '@/components/RegisterPatientForm';

const registerpatient = () => {
  return (
    <Container disableGutters>
        <Box className="flex justify-between mb-4">
          <Box className="flex">
            <DriveFileRenameOutlineIcon fontSize='medium' color='info' />
            <Typography variant='h5' align='right' className='ml-2 font-extrabold' color='info'>New Patient</Typography>
          </Box>
        </Box>
        <Paper>
            <RegisterPatientForm />
        </Paper>
     </Container>
    
  )
}

export default registerpatient