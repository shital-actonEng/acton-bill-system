"use client";
import { Autocomplete, Box, Button, Container, Divider, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import {Person4 , Search , Add } from "@mui/icons-material";
import AddEditReferral from "@/components/AddEditReferral";
import { getReferrer } from "@/express-api/referrer/page";

type referrer ={
  pk : number , 
  name : string,
  meta_details : {
    email: string,
      medicalDegree: string,
      referrelBonusPercentage : string,
      referrelBonus: string,
      address: string,
      phone: string,
      prn: string
  }
}

const ReferralDashboard = () => {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [open , setOpen] = useState(false);
  const [loading , setLoading] = useState(false);
  const [demoData , setDemoData] = useState<referrer[]>([]);
  
  // Handle editing an existing patient
  const handleEditReferral = (referral: any) => {
    setSelectedReferral(referral);
    setIsFormOpen(true);
  };

  // Handle adding a new patient
  const handleAddReferral = () => {
    setSelectedReferral(null); // Ensure form is empty for a new patient
    setIsFormOpen(true);
  };

  const handlesearchData = (val: any) => {
    setSearchData(val);
  }
 
  const handleLoadData = async()=>{
    if(demoData.length === 0 && !loading){
      try {
        setLoading(true);
        const data = await getReferrer();
        setDemoData(data);
      } catch (error) {
        console.log("Failed to load referreral data" , error);
      }
      finally{
        setLoading(false);
      }
    }
  }

  const handleSearchReferrel = () => {
    if (searchData) {
      handleEditReferral(searchData);
    } else {
      alert("No Referral found!");
    }
  };

  return (
    <div>
      <Container disableGutters>
        {/* Header Section */}
        <Box className="flex flex-wrap justify-between mb-4">
          <Box className="flex">
            <Person4 fontSize="medium" color="info" className="mt-1" />
            <Typography variant="h5" align="right" className="ml-2 mb-1 font-extrabold" color="info">
              Initiate New Referrel
            </Typography>
          </Box>
          <Button startIcon={<Add />} variant="contained" color="primary" onClick={handleAddReferral}>
            Add New Physician
          </Button>
        </Box>

        {/* Search & Form Section */}
        <Paper className="md:px-8 py-6 px-4">
            <div className="flex flex-wrap gap-6">
              {/* Select Referrel to search its data */}
              <Autocomplete
                disablePortal
                id="combo-box-modality"
                options={demoData}
                // value={modality}
                open = {open}
                loading={loading}
                onOpen={()=>{
                  setOpen(true)
                  handleLoadData()
                }}
                onClose={()=>{
                  setOpen(false)
                }}
                onChange={(e, newValue) => handlesearchData(newValue)}
                size="small"
                className="w-full md:w-1/2"
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                renderOption={(props, option) => (
                  <li {...props} key={option.pk}>
                    {`${option.name} - ${option.meta_details.medicalDegree}`}
                  </li>
                )}
                filterOptions={(options, state) => {
                  const searchInput = state.inputValue.toLowerCase().trim();
                  return options.filter((option) => {
                    const nameMatch = option.name.toLowerCase().includes(searchInput);
                    const phoneMatch = String(option.meta_details.phone).includes(searchInput);
                    return nameMatch || phoneMatch;
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined"
                    placeholder="Search"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                   
                  />
                )}
              />
              <Button startIcon={<Search />} variant="outlined" onClick={handleSearchReferrel}>
                Search Referrel
              </Button>
            </div>

            <Divider className="my-6" />

            {/* Conditionally Render Add/Edit Form */}
            {isFormOpen ? (
              <AddEditReferral
                referralData={selectedReferral}
              />
            ) : (
              <Typography className="font-semibold text-base" align="center">
                {'Search for a Physician or click   "Add New Physician"   to create a new record.'}
              </Typography>
            )}
        </Paper>
      </Container>
    </div>
  );
};

export default ReferralDashboard;
