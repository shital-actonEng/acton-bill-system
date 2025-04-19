"use client";
import { Autocomplete, Box, Button, Container, Divider, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import {Person4 , Search , Add } from "@mui/icons-material";
import AddEditReferral from "@/components/AddEditReferral";

const ReferralDashboard = () => {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchData, setSearchData] = useState("");

  // Sample referral data (this should come from API in a real-world app)
  const demoData = [
    {
      id: 1,
      doctorName: "Shital Konduskar",
      email: "shital@gmail.com",
      medicalDegree: "M.D",
      referrelBonusPercentage : "0",
      referrelBonus: "0",
      address: "27A sector , Pradhikaran-Akurdi , pune",
      phone: "1234567898",
      prn: "ac1235gr"
    },
    {
      id: 2,
      doctorName: "Tejas Bambare",
      email: "tejas@gmail.com",
      medicalDegree: "M.S",
      referrelBonusPercentage : "0",
      referrelBonus: "10000",
      address: "27A sector , Pradhikaran-Akurdi , pune",
      phone: "1234567898",
      prn: "ac1235gr"
    },
    {
      id: 3,
      doctorName: "Nisha Jadhav",
      email: "nisha@gmail.com",
      medicalDegree: "M.B.B.S",
      referrelBonusPercentage : "0",
      referrelBonus: "0",
      address: "Kolhapur",
      phone: "1234567898",
      prn: "ac1235gr"
    },
    {
      id: 4,
      doctorName: "Shital Konduskar",
      email: "doctor@gmail.com",
      medicalDegree: "B.H.M.S",
      referrelBonusPercentage : "0",
      referrelBonus: "0",
      address: "27A sector , Pradhikaran-Akurdi , pune",
      phone: "7888134950",
      prn: "ac1235gr"
    },
    {
      id: 5,
      doctorName: "Shital Bambare",
      email: "doctor@gmail.com",
      medicalDegree: "B.A.M.S",
      referrelBonusPercentage : "0",
      referrelBonus: "0",
      address: "27A sector , Pradhikaran-Akurdi , pune",
      phone: "1234567898",
      prn: "ac1235gr"
    },
  ];

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
    console.log("search data is...", val);
    setSearchData(val);
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
                onChange={(e, newValue) => handlesearchData(newValue)}
                size="small"
                className="w-full md:w-1/2"
                getOptionLabel={(option) => option.doctorName}
                isOptionEqualToValue={(option, value) => option.doctorName === value.doctorName}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {`${option.doctorName} - ${option.medicalDegree}`}
                  </li>
                )}
                filterOptions={(options, state) => {
                  const searchInput = state.inputValue.toLowerCase().trim();
                  return options.filter((option) => {
                    const nameMatch = option.doctorName.toLowerCase().includes(searchInput);
                    const phoneMatch = option.medicalDegree.includes(searchInput);
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
                referralData={selectedReferral ?? { id: null, doctorName: "", email: "", medicalDegree: "", prn: "", mobileNum: "", address: "" }}
              />
            ) : (
              <Typography className="font-semibold text-base" align="center">
                Search for a Physician or click   "Add New Physician"   to create a new record.
              </Typography>
            )}
        </Paper>
      </Container>
    </div>
  );
};

export default ReferralDashboard;
