"use client"
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import React from 'react'
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid2';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Link from 'next/link';
import Billingtable from '@/components/Billingtable';


const paginationModel = { page: 0, pageSize: 5 };


const billingmodule = () => {

  return (
    <div>
      <Container disableGutters>
        <Box className="flex justify-between mb-4">
          <Box className="flex">
            <DescriptionIcon fontSize='medium' color='info' />
            <Typography variant='h5' align='right' className='ml-2 mb-1 font-extrabold' color='info'>Invoices</Typography>
          </Box>
          <Link href="/registerpatient" >
            <Button color='primary' variant='contained' startIcon={<AddIcon />} > Payment Breakdown </Button>
          </Link>
        </Box>
        {/* <Paper> */}
        <Paper>  
          <Billingtable />
        </Paper>
        {/* </Paper> */}
      </Container>
    </div>
  )
}

export default billingmodule