
"use client";
import { Autocomplete, Box, Button, Container, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Vaccines, Save, Clear } from '@mui/icons-material';
import jsonData from '../../../../data/testsData.json';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useForm, Controller } from 'react-hook-form';
import { addTest } from '@/express-api/testRecord/page';
import { useBranchStore } from '@/stores/branchStore';
import { useGetApiStore } from '@/stores/getApiStore';


const TestRecords = () => {
  const { control, handleSubmit, reset, watch, setValue,  formState: { errors } } = useForm({
    defaultValues: {
      modality: '',
      bodyPart: '',
      test: '',
      price: '',
      gst: '',
      referrelBonusPercentage: '',
      referrelBonus: '',
      discountMinRange: '',
      discountMaxRange: ''
    }
  });

  const [modality, setModality] = useState("");
  const [testData, setTestData] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
  const [filteredModality, setFilteredModality] = useState<{ id: number, label: string }[]>([]);
  const [uniqueModality, setUniqueModality] = useState<{ id: number, label: string }[]>([]);
  const [bodyPartValue, setBodyPartValue] = useState("");
  const branch = useBranchStore((state) => state.selectedBranch);
  // const {modalitiesData , fetchModalitiesData} = useGetApiStore()
  const modalitiesData = useGetApiStore((state) => state.modalitiesData);
const fetchModalitiesData = useGetApiStore((state) => state.fetchModalitiesData);

  const gstItem = [0, 5, 12, 18, 28];

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
    setUniqueModality(uniqueModalities);
    fetchModalitiesData();
  }, []);

    useEffect(() => {
    // console.log("modalities in test is...", modalitiesData);
  }, [modalitiesData]);

  const handleModality = (selectmodality: any) => {
    // console.log("new value is...", selectmodality);
    setModality(selectmodality);
    if (selectmodality === null) {
      return;
    }
    reset((prev) => ({
      ...prev,
      modality: selectmodality.label
    }));
    const modalities = testData.filter((test) =>
      test.modality.toLowerCase().includes(selectmodality.label.toLowerCase())
    );
    const uniqueBodyParts = modalities
      .filter((item, index, self) =>
        index === self.findIndex((t) => t.body_part === item.body_part)
      )
      .map((item, index) => ({
        id: index,
        label: item.body_part,
      }));
    setFilteredModality(uniqueBodyParts);
  };

  const handleBodyParts = (body_parts: any) => {
    if (body_parts === null) {
      return;
    }
    let selectedValue = '';
    if (typeof body_parts === 'string') {
      selectedValue = body_parts;
    } else if (body_parts.label) {
      selectedValue = body_parts.label;
    }
    reset((prev) => ({
      ...prev,
      bodyPart: selectedValue
    }));
  };

  const handleClear = () => {
    reset({
      modality: '',
      bodyPart: '',
      test: '',
      price: '',
      gst: '',
      referrelBonusPercentage: '',
      referrelBonus: '',
      discountMinRange: '',
      discountMaxRange: ''
    });
    setBodyPartValue("");
    setModality("");
  };

  const isValidPrice = (price: number) => {
    return price < 0 ? false : true;
  };

  const onSubmit = (data: any) => {
    const isPriceValid = isValidPrice(Number(data.price));

    if (!isPriceValid) {
      console.warn("Form validation failed");
      return;
    }
    // console.log("Test data is...", data);
    if(data){
      const payload = {
        modality : data.modality,
        body_part : data.bodyPart,
        protocol : data.test,
        price : data.price,
        meta_details : {
          gst : data.gst,
          discount_min_range : data.discountMinRange,
          discount_max_range : data.discountMaxRange,
          referrel_bonus : data.referrelBonus,
          referrel_bonus_percentage : data.referrelBonusPercentage
        } ,
        diagnostic_centre_fk : branch?.pk
      }
      addTest(payload);
    } 
    handleClear();
  };

  const watchReferrelBonusPercentage = watch('referrelBonusPercentage');
  const watchReferrelBonus = watch('referrelBonus');
  const watchPrice = watch('price');

  useEffect(() => {
    // If referrelBonusPercentage is set, update referrelBonus
    if (watchReferrelBonusPercentage && watchPrice) {
      const price = Number(watchPrice);
      const bonusPercentage = parseFloat(watchReferrelBonusPercentage);
      const referrelBonusAmount = (price * bonusPercentage) / 100;
      setValue('referrelBonus', referrelBonusAmount.toString());
    }
  }, [watchReferrelBonusPercentage, watchPrice, setValue]);

  useEffect(() => {
    // If referrelBonus is set, update referrelBonusPercentage
    if (watchReferrelBonus && watchPrice) {
      const price = Number(watchPrice);
      const referrelBonusAmount = parseFloat(watchReferrelBonus);
      if (price !== 0) {
        const bonusPercentage = (referrelBonusAmount * 100) / price;
        setValue('referrelBonusPercentage', bonusPercentage.toFixed(2));
      }
    }
  }, [watchReferrelBonus, watchPrice, setValue]);

  return (
    <Container disableGutters>
      <Box className="flex justify-between mb-4">
        <Box className="flex">
          <Vaccines fontSize='medium' color='info' className='mt-1' />
          <Typography variant='h5' align='right' className='ml-2 mb-1 font-extrabold' color='info'>Add Tests</Typography>
        </Box>
      </Box>

      <Paper className='md:px-8 py-6 px-4'>
        <div className="flex gap-6">
          {/* Select Modality */}
          <Autocomplete
            disablePortal
            id="combo-box-modality"
            options={uniqueModality}
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
        <Paper className='w-full md:w-2/3 py-6 md:px-8'>
          <Typography className='text-sm font-semibold mb-5' color='textDisabled'>Please fill test information here to Add tests </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full'>

            {/* Select Body Parts */}
            <Autocomplete
              disablePortal
              freeSolo
              id="combo-box-body-parts"
              options={filteredModality}
              value={bodyPartValue}
              onChange={(e, newValue) => handleBodyParts(newValue)}
              size="small"
              className="w-full"
              renderOption={(props, option, { index }) => (
                <li {...props} key={`${option.label}-${index}`}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Body parts" variant="outlined" />
              )}
            />

            <Controller
              name="test"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Tests"
                  size="small"
                  color="primary"
                  className="w-full"
                  autoComplete="off"
                />
              )}
            />

            <div className='flex flex-wrap gap-4'>
              {/* Price */}
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enter Price"
                    variant="outlined"
                    size="small"
                    type="number"
                    className="w-full md:w-6/12"
                    error={!!errors.price}
                    helperText={errors.price ? 'Enter a valid price' : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize='small' />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* GST */}
              <Controller
                name="gst"
                control={control}
                render={({ field }) => (
                  <FormControl size="small" className="w-full md:w-5/12">
                    <InputLabel id="GST">GST(%)</InputLabel>
                    <Select
                      {...field}
                      labelId="GST"
                      label="GST"
                    >
                      {gstItem.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            {/* Referral bonus */}
            <div className='flex flex-wrap gap-4'>
              <label className='mt-2 w-full md:w-1/4'>Enter Referral Bonus</label>
              <Controller
                name="referrelBonusPercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bonus(%)"
                    variant="outlined"
                    size="small"
                    className="w-1/2 md:w-1/4"
                    type="number"
                  />
                )}
              />
              <span className='mt-2'>OR</span>
              <Controller
                name="referrelBonus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bonus"
                    variant="outlined"
                    size="small"
                    className="w-1/2 md:w-1/4"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize='small' />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            {/* Discount range */}
            <div className='flex flex-wrap gap-4'>
              <label className='mt-2 w-full md:w-1/4'>Discount Range</label>
              <Controller
                name="discountMinRange"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Min Range(%)"
                    variant="outlined"
                    size="small"
                    className="w-1/2 md:w-1/4 md:mr-9"
                    type="number"
                  />
                )}
              />
              <Controller
                name="discountMaxRange"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Max Range(%)"
                    variant="outlined"
                    size="small"
                    className="w-1/2 md:w-1/4"
                    type="number"
                  />
                )}
              />
            </div>

            <div className='flex gap-4 mt-5'>
              <Button color='success' variant='outlined' type="submit" startIcon={<Save />}>Save</Button>
              <Button color='error' variant='outlined' onClick={handleClear} startIcon={<Clear />}>Cancel</Button>
            </div>
          </form>
        </Paper>
      </Paper>
    </Container>
  );
};

export default TestRecords;

