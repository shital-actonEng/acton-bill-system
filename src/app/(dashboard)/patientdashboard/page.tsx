"use client";
import { Autocomplete, Box, Button, Container, Divider, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import {Person4 , Search , Add} from "@mui/icons-material";
import AddEditPatient from "@/components/AddEditPatient";
import { getPatients } from "@/express-api/patient/page";

type patient ={
  pk : number , 
  name : string,
  mobile : string,
  meta_details : {
    abhaId : string,
    address : string,
    ageMonth : number,
    ageYear : number,
    birthDate : Date,
    email : string,
    gender : string
  }
}

const PatientDashboard = () => {
 
  // State to track the selected patient (edit mode) or a new patient (add mode)
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [demoData , setDemoData] = useState<patient[]>([]);
  const [open , setOpen] = useState(false);
  const [loading , setLoading] = useState(false);

  // Handle editing an existing patient
  const handleEditPatient = (patient : any) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  // Handle adding a new patient
  const handleAddPatient = () => {
    setSelectedPatient(null); // Ensure form is empty for a new patient
    setIsFormOpen(true);
  };


  const handlesearchData = (val: any) => {
    setSearchData(val);
  }

  const handleSearchPatient = () => {
   if (searchData) {
     handleEditPatient(searchData);
   } else {
     alert("No Referral found!");
   }
 };

 const handleLoadData = async (value : any)=>{
    try{
      setLoading(true);
      const result = await getPatients(value);
    setDemoData(result);
    }
    catch(error){
      console.error("Failed to load patient data", error);
    }
    finally{
      setLoading(false);
    }  
 }

  return (
    <div>
      <Container disableGutters>
        {/* Header Section */}
        <Box className="flex flex-wrap justify-between mb-4">
          <Box className="flex  w-full md:w-1/2">
            <Person4 fontSize="medium" color="info" className="mt-1" />
            <Typography variant="h5" align="right" className="ml-2 mb-1 font-extrabold" color="info">
              Patient Info
            </Typography>
          </Box>
          <Button startIcon={<Add />} variant="contained" color="primary" onClick={handleAddPatient}>
            Add New Patient
          </Button>
        </Box>

        {/* Search & Form Section */}
        <Paper className="md:px-8">
          <Container className="py-6 px-4">
            <div className="flex gap-6 flex-wrap">

              {/* Select Patient to search its data */}
                            <Autocomplete
                              disablePortal
                              id="combo-box-modality"
                              options={demoData}
                              // value={modality}
                              open = {open}
                              loading = {loading}
                              // onOpen={()=>{
                              //   setOpen(true)
                              //   handleLoadData()
                              // }}

                               onInputChange={(event, value) => {
                                if (value.length >= 4) {
                                      setOpen(true)
                                 handleLoadData(value)
                                }
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
                                  {`${option.name}   (${option.mobile})`}
                                </li>
                              )}
                              filterOptions={(options, state) => {
                                const searchInput = state.inputValue.toLowerCase().trim();
                                return options.filter((option) => {
                                  const nameMatch = option.name.toLowerCase().includes(searchInput);
                                  const phoneMatch = String(option.mobile).includes(searchInput);
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

              <Button startIcon={<Search />} variant="outlined" onClick={handleSearchPatient}>
                Search Patient
              </Button>
            </div>

            <Divider className="my-6" />

            {/* Conditionally Render Add/Edit Form */}
            {isFormOpen ? (
              <AddEditPatient
                patientData={selectedPatient}
              />
            ) : (
              <Typography  className="font-semibold text-base" align="center">
                Search for a patient or click   "Add New Patient"   to create a new record.
              </Typography>
            )}
          </Container>
        </Paper>
      </Container>
    </div>
  );
};

export default PatientDashboard;
