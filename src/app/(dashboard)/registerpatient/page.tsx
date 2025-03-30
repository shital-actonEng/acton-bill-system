import { Box, Button, Container, Paper, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import RegisterPatientForm from '@/components/RegisterPatientForm';

const registerpatient = () => {
  return (
    <Container disableGutters>
        <Box className="flex justify-between mb-4">
          <Box className="flex text-gray-600">
            <DriveFileRenameOutlineIcon fontSize='medium' />
            <Typography variant='h5' align='right' className='ml-2 font-extrabold'>New Patient</Typography>
          </Box>
          {/* <Link href="/registerpatient" >
            <Button color='success' variant='contained' startIcon={<AddIcon />} > Register Patient </Button>
          </Link> */}
        </Box>
        <Paper className='h-[450] overflow-auto custom-scrollbar' >
            <RegisterPatientForm />
        </Paper>
     </Container>
    
  )
}

export default registerpatient