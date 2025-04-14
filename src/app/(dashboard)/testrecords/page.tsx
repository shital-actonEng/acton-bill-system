"use client"
import { Autocomplete, Box, Button, Container, Divider, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VaccinesIcon from '@mui/icons-material/Vaccines';
import jsonData from '../../../../data/testsData.json';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';


const TestRecords = () => {
  const [modality, setModality] = useState("");
  const [testData, setTestData] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
  const [filteredModality, setFilteredModality] = useState<{ id: number, label: string }[]>([]);
  const [uniqueModality, setUniqueModality] = useState<{ id: number, label: string }[]>([]);
  const [bodyPartValue, setBodyPartValue] = useState("");

  const [form, setForm] = useState<{
    modality: string;
    bodyPart: string;
    test: string;
    price: string,
    gst: string,
    referrelBonusPercentage : string ,
    referrelBonus: string,
    discountMinRange: string,
    discountMaxRange: string
  }>({
    modality: "",
    bodyPart: "",
    test: "",
    price: "",
    gst: "",
    referrelBonusPercentage : "" ,
    referrelBonus: "",
    discountMinRange: "",
    discountMaxRange: ""
  });

  const gstItem = [0 , 5, 12 , 18 , 28]

  const [errors, setErrors] = useState({
    price: {
      error: false,
      helperText: '',
    },

  });


  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value
    };
  
    if (name === "referrelBonusPercentage" && form.price) {
      const price = Number(form.price);
      const bonusPercentage = parseFloat(value);
      const referrelBonusAmount = (price * bonusPercentage) / 100;

      updatedForm.referrelBonus = referrelBonusAmount.toString();
    }

    if (name === "referrelBonus" && form.price) {
      const price = Number(form.price);
      const referrelBonusAmount = parseFloat(value);
      if(price != 0){
      const bonusPercentage = (referrelBonusAmount * 100)/price
      updatedForm.referrelBonusPercentage = parseFloat(bonusPercentage.toFixed(2)).toString();
      }
    }
  
    setForm(updatedForm);
  
  }

  const handleModality = (selectmodality: any) => {
    console.log("new value is..." , selectmodality)
    setModality(selectmodality);
    if (selectmodality === null) {
      // Clear the selected modality and filtered data when the input is cleared
      // setModality('');
      return;
    }
    setForm({ ...form, modality: selectmodality.label })
    const modalities = testData.filter((test) =>
      test.modality.toLowerCase().includes(selectmodality.label.toLowerCase())
    )
    // for filtered and unique body parts according to modality
    const uniqueBodyParts = modalities
      .filter((item, index, self) =>
        index === self.findIndex((t) => t.body_part === item.body_part)
      )
      .map((item, index) => ({
        id: index,
        label: item.body_part,
      }));

    setFilteredModality(uniqueBodyParts);
  }


  const handleBodyParts = (body_parts: any) => {
    if (body_parts === null) {
      return;
    }

    let selectedValue = '';
    console.log("body part is...", body_parts);
    if (typeof body_parts === 'string') {
      selectedValue = body_parts;
    } else if (body_parts.label) {
      selectedValue = body_parts.label;
    }

    setForm({ ...form, bodyPart: selectedValue })
    // setBodyPartValue()      
  };


  const handleClear = () => {
    console.log("clear")
    setForm({
      modality: "",
      bodyPart: "",
      test: "",
      price: "",
      gst: "",
      referrelBonusPercentage : "" ,
      referrelBonus: "",
      discountMinRange: "",
      discountMaxRange: ""
    })
    setBodyPartValue("");
    setModality("")
  }

  // Validation Code
  const isValidPrice = (price: number) => {
    return price < 0 ? false : true
  }

  const handleSubmit = () => {
    const isPriceValid = isValidPrice(Number(form.price));

    const newErrors = {
      price: {
        error: !isPriceValid,
        helperText: isPriceValid ? '' : 'Enter a valid price',
      }
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((field) => field.error)) {
      console.warn("Form validation failed:", newErrors);
      return;
    }
    console.log("patient data is...", form);
    handleClear();
  }


  useEffect(() => {
    setTestData(jsonData);
    const uniqueModalities = jsonData
    .filter((item, index, self) =>
      index === self.findIndex((t) => t.modality === item.modality)
    )
    .map((item, index) => ({
      id: index,
      label: item.modality,
    }));
    setUniqueModality(uniqueModalities)
  }, [])

  return (
    <Container disableGutters>
      <Box className="flex justify-between mb-4">
        <Box className="flex">
          <VaccinesIcon fontSize='medium' color='info' className='mt-1' />
          <Typography variant='h5' align='right' className='ml-2 mb-1 font-extrabold' color='info'>Add Tests</Typography>
        </Box>
      </Box>

      <Paper className='md:px-8'>
        <Container className="py-6 px-4">
          <div className="flex gap-6">
            {/* Select Modality  */}
            <Autocomplete
              disablePortal
              id="combo-box-modality"
              options={uniqueModality}
              // value={modality}
              onChange={(e, newValue) => handleModality(newValue)}
              size="small"
              className="w-full md:w-1/2"
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderOption={(props, option, { index }) => (
                <li {...props} key={`${option.label}-${index}`}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Modality" variant="outlined" required />
              )}
            />
           
          </div>

          <Divider className="my-6" />
          <Paper className='w-full md:w-2/3'>
            <Container className='py-6 md:px-8'>
              <Typography className='text-sm font-semibold mb-5' color='textDisabled'>Please fill test information here to Add tests </Typography>
              {/* <div className='flex gap-4 justify-between' > */}
              <div className='flex flex-col gap-4  w-full'>

                {/* Select Body Parts  */}
                <Autocomplete
                  disablePortal
                  freeSolo
                  id="combo-box-demo"
                  options={filteredModality}
                  value={bodyPartValue}
                  onChange={(e, newValue) => {
                    if (typeof newValue === 'string') {
                      setBodyPartValue(newValue); // when user types
                    } else if (newValue && newValue.label) {
                      setBodyPartValue(newValue.label); // when user selects from dropdown
                    } else {
                      setBodyPartValue('');
                    }
                    handleBodyParts(newValue);
                  }}
                  onInputChange={(e, newValue) => {
                    handleBodyParts(newValue);
                  }}
                  size="small"
                  className="w-full"
                  // getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  renderOption={(props, option, { index }) => (
                    <li {...props} key={`${option.label}-${index}`}>
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Body parts" variant="outlined" />
                  )}
                />

                <TextField id="test"
                  label="Enter Tests"
                  name='test'
                  value={form.test}
                  size='small'
                  color='primary'
                  className='w-full'
                  onChange={handleChange}
                  autoComplete='off'
                />

                <div className='flex flex-wrap gap-4'>
                  {/* price */}
                  <TextField id="price" label="Enter Price" variant="outlined"
                    size='small' color='primary' autoComplete="off" className='w-full md:w-6/12'
                    name='price' type='number'
                    value={form.price} onChange={handleChange}
                    error={errors.price.error}
                    helperText={errors.price.helperText}
                  />

                  {/*  Tax Or GST */}
                  <FormControl  size="small" className='w-full md:w-5/12'>
                   <InputLabel id="GST">GST%</InputLabel>
                  <Select
                    labelId="GST"
                    id="GST"
                    value={form.gst}
                    label="GST"
                    name='gst'
                    onChange={handleChange}
                    size='small'
                  >
                    {
                      gstItem.map((item , index)=>
                        <MenuItem key={index} value={item}>
                            {item}
                        </MenuItem>
                      )
                    }
                  </Select>
                  </FormControl>
                </div>

                 {/* Referrial bonus */}
                <div className='flex flex-wrap gap-4'>
                  <label className='mt-2 w-full md:w-1/4'>Enter Referrel Bonus</label>
                  <TextField id="referrelBonusPercentage" label="Bonus%" variant="outlined"
                    size='small' color='primary' autoComplete="off" className='w-1/2 md:w-1/4'
                    name='referrelBonusPercentage'
                    value={form.referrelBonusPercentage} onChange={handleChange}
                    type='number'
                  />
                  <span className='mt-2'>OR</span>
                  <TextField id="referrelBonus" label="Bonus" variant="outlined"
                    size='small' color='primary' autoComplete="off" className='w-1/2 md:w-1/4'
                    name='referrelBonus'
                    type='number'
                    value={form.referrelBonus} onChange={handleChange}
                  />
                </div>

                <div className='flex flex-wrap gap-4'>
                  <label className='mt-2 w-full md:w-1/4'>Discount Range  </label>
                  <TextField id="discountMinRange" label="Min Range" variant="outlined"
                    size='small' color='primary' autoComplete="off" className='w-1/2 md:w-1/4 md:mr-9'
                    name='discountMinRange' type='number'
                    value={form.discountMinRange} onChange={handleChange}
                  />
                  <TextField id="discountMaxRange" label="Max Range" variant="outlined"
                    size='small' color='primary' autoComplete="off" className='w-1/2 md:w-1/4'
                    name='discountMaxRange' type='number'
                    value={form.discountMaxRange} onChange={handleChange}
                  />
                </div>

                <div className='flex gap-4 mt-5'>
                  <Button color='success' variant='outlined' onClick={handleSubmit}
                    startIcon={<SaveIcon />} >Save</Button>
                  <Button color='error' variant='outlined'
                    onClick={handleClear} startIcon={<ClearIcon />}  >Cancel</Button>
                </div>
              </div>
            </Container>
          </Paper>
        </Container>

      </Paper>
    </Container>
  )
}

export default TestRecords
