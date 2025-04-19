"use client";
import { Autocomplete, Box, Button, Container, Divider, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import {Person4 , Search , Add} from "@mui/icons-material";
import AddEditPatient from "@/components/AddEditPatient";

const PatientDashboard = () => {
  // Sample patient data (this should come from API in a real-world app)
  const demoData = [
    {
      id: 1,
      patientName: "Shital Konduskar",
      birthDate: "1999-05-15", 
      email : "shital@gmail.com",
      phone: 1234567898,
      abhaId : "12345fGH",
      age: 25,
      gender : "Female",
      address: "27A sector , Pradhikaran-Akurdi , Pune",
    },
    {
      id: 2,
      patientName: "Rahul Desai",
      birthDate: "1999-05-15", 
      email : "rahul@gmail.com",
      phone: 1234567898,
      abhaId : "12345fGH",
      age: 25,
      gender : "Female",
      address: "27A sector , Pradhikaran-Akurdi , Pune",
    },
    {
      id: 3,
      patientName: "Shital Konduskar",
      birthDate: "1999-05-15", 
      email : "shital.konduskar@gmail.com",
      phone: 7888134950,
      abhaId : "12345fGH",
      age: 25,
      gender : "Female",
      address: "27A sector , Pradhikaran-Akurdi , Pune",
    },
    {
      id: 4,
      patientName: "Advik Kulkarni",
      birthDate: "2022-05-15", 
      email : "advik@gmail.com",
      phone: 1234567898,
      abhaId : "12345fGH",
      age: 3,
      gender : "Female",
      address: "27A sector , Pradhikaran-Akurdi , Pune",
    },
    {
      id: 5,
      patientName: "Suraj ingale",
      birthDate: "2000-06-11", 
      email : "suraj@gmail.com",
      phone: 1234567898,
      abhaId : "12345fGH",
      age: 25,
      gender : "Female",
      address: "27A sector , Pradhikaran-Akurdi , Pune",
    },
    {
      id: 6,
      patientName: "Priyanka Wagh",
      birthDate: "1999-05-15", 
      email : "priyanka@gmail.com",
      phone: 1234567898,
      abhaId : "12345fGH",
      age: 25,
      gender : "Female",
      address: "27A sector , Pradhikaran-Akurdi , Pune",
    },
  ];

  // State to track the selected patient (edit mode) or a new patient (add mode)
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchData, setSearchData] = useState("");

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
    console.log("search data is...", val);
    setSearchData(val);
  }

  const handleSearchPatient = () => {
   if (searchData) {
     handleEditPatient(searchData);
   } else {
     alert("No Referral found!");
   }
 };

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
                              onChange={(e, newValue) => handlesearchData(newValue)}
                              size="small"
                              className="w-full md:w-1/2"
                              getOptionLabel={(option) => option.patientName}
                              isOptionEqualToValue={(option, value) => option.patientName === value.patientName}
                              renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                  {`${option.patientName}   ( ${option.phone} )`}
                                </li>
                              )}
                              filterOptions={(options, state) => {
                                const searchInput = state.inputValue.toLowerCase().trim();
                                return options.filter((option) => {
                                  const nameMatch = option.patientName.toLowerCase().includes(searchInput);
                                  const phoneMatch = String(option.phone).includes(searchInput);
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
                patientData={selectedPatient ?? { id: null, patientName: "", age: 0, email : "", mobileNum: "", abhaId:"", address: ""  , birthdate : ""}}
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
