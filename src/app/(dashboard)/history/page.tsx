import PatientHistoryTable from '@/components/PatientHistoryTable'
import { Box, Container, Paper, Typography } from '@mui/material'
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import React from 'react'

const History = () => {
  return (
    <Container disableGutters>
    <Box className="flex justify-between mb-4">
      <Box className="flex">
        <ManageHistoryIcon fontSize='medium' color='info' />
        <Typography variant='h5' align='right' className='ml-2 mb-1 font-extrabold' color='info'>Clinical History Overview</Typography>
      </Box>
    </Box>
    {/* <Paper> */}
    <Paper>  
        <PatientHistoryTable />
    </Paper>
    {/* </Paper> */}
  </Container>
  )
}

export default History
