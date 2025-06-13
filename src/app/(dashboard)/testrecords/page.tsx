
"use client";
import { Autocomplete, Box, Button, Container, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Vaccines, Save, Clear, DeleteOutline } from '@mui/icons-material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useForm, Controller } from 'react-hook-form';
import { addTest, getTest, updateTest } from '@/express-api/testRecord/page';
import { useBranchStore } from '@/stores/branchStore';
import { getModalities } from '@/express-api/modalities/page';

type Test = {
  pk: number;
  modality: string;
  body_part: string;
  protocol: string;
  price: string;
  diagnostic_centre_fk: number;
  modality_type_fk: number;
  meta_details: {
    gst: string;
    discount_min_range: string;
    discount_max_range: string;
    referrel_bonus: string;
    referrel_bonus_percentage: string;
  };
  deleted: boolean;
};

type Modality = {
  pk: number;
  name: string;
  description: string;
}


const TestRecords = () => {
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      modality: '',
      bodyPart: '',
      test: '',
      price: '',
      gst: '0',
      referrelBonusPercentage: '',
      referrelBonus: '',
      discountMinRange: '',
      discountMaxRange: ''
    }
  });

  // const [modality, setModality] = useState("");
  const [testData, setTestData] = useState<Test[]>([]);
  const [filteredModality, setFilteredModality] = useState<{ id: number, label: string }[]>([]);
  const [uniqueModality, setUniqueModality] = useState<Modality[]>([]);
  const [selectedModality, setSelectedModality] = useState("");
  const [bodyPartValue, setBodyPartValue] = useState("");
  const [selectedTest, setSelectedTest] = useState<Test>()
  const branch = useBranchStore((state) => state.selectedBranch);
  const [testOptions, setTestOptions] = useState<Test[]>([]);
  const [isTestCheck, setIsTestCheck] = useState(false);
  let foundTest: Test | undefined;

  const gstItem = [0, 5, 12, 18, 28];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultTest = await getTest();
        const resultModalities = await getModalities();

        const uniqueModalityFiltered: Modality[] = Array.from(
          new Map(resultModalities.map((item: Modality) => [item.description, item])).values()
        ) as Modality[];

        setUniqueModality(uniqueModalityFiltered);

        if (!branch) return;
        const filteredResult = resultTest.filter((item: Test) =>
          item.diagnostic_centre_fk === branch.pk && item.deleted === null
        );

        setTestOptions(filteredResult);
        setTestData(filteredResult);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };
    fetchData();
  }, [branch])


  const handleModality = (selectmodality: string | null) => {
    if (selectmodality === null) {
       setTestOptions(testData);
       setSelectedModality("");
      return;
    }
    setSelectedModality(selectmodality);
    const selectedModalityObj = uniqueModality.find((m) => m.description.toLowerCase() === selectmodality.toLowerCase());

     const filterTest = testData.filter((t) => t.modality_type_fk === selectedModalityObj?.pk)
    const uniqueBodyParts = filterTest.map((item, index) => ({
        id: index,
        label: item.body_part,
      }))
    setFilteredModality(uniqueBodyParts);

    setTestOptions(filterTest);
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

  const handleTest = (e: any, test: any) => {
    setSelectedTest(test);
    foundTest = testOptions.find((t) => t.protocol == test)
    if (foundTest) {
        const modalityFound = uniqueModality.find((m) => m.pk === foundTest?.modality_type_fk )
      setSelectedTest(foundTest);
      // Set values in form from found test
      setValue('test', foundTest.protocol);
      setValue('modality', modalityFound?.description || '');
      setValue('bodyPart', foundTest.body_part);
      setValue('price', foundTest.price);
      setValue('gst', foundTest.meta_details.gst);
      setValue('referrelBonus', foundTest.meta_details.referrel_bonus);
      setValue('referrelBonusPercentage', foundTest.meta_details.referrel_bonus_percentage);
      setValue('discountMinRange', foundTest.meta_details.discount_min_range);
      setValue('discountMaxRange', foundTest.meta_details.discount_max_range);

      // Update Modality & Body Part UI selections
      // setModality(foundTest.modality);
      setBodyPartValue(foundTest.body_part);
      setSelectedModality(modalityFound?.description || "");
      setIsTestCheck(true)
    } else {
      // If user types a new test not in options
      setSelectedTest({ protocol: test } as Test);
      setValue('test', test);
      setIsTestCheck(false)
    }

  }

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
    setSelectedModality("");
    // setModality("");

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
    const selectedModalityObj = uniqueModality.find((m) => m.description.toLowerCase() === selectedModality.toLowerCase());
    if (data) {
      const payload = {
        // modality: selectedModality,
        body_part: data.bodyPart,
        protocol: data.test,
        price: data.price,
        meta_details: {
          gst: data.gst,
          discount_min_range: data.discountMinRange,
          discount_max_range: data.discountMaxRange,
          referrel_bonus: data.referrelBonus,
          referrel_bonus_percentage: data.referrelBonusPercentage
        },
        diagnostic_centre_fk: branch?.pk,
        modality_type_fk: selectedModalityObj?.pk
      }
      console.log("payload is...", payload);
      addTest(payload);
    }
    handleClear();
  };

  const handleDelete = () => {
    if (!selectedTest) return;

    const updatedTest: Test = {
      ...selectedTest,
      deleted: true,
    };
    console.log("found delete test is...", updatedTest);
    updateTest(updatedTest);
    handleClear();
    setIsTestCheck(false);
  }

  const watchReferrelBonusPercentage = watch('referrelBonusPercentage');
  const watchReferrelBonus = watch('referrelBonus');
  const watchPrice = watch('price');

  const calculateBonusInAmount = () => {
    const price = Number(watchPrice);
    const bonusPercentage = Number(watchReferrelBonusPercentage);
    const referrelBonusAmount = (price * bonusPercentage) / 100;
    setValue('referrelBonus', referrelBonusAmount.toString());
  }

  const calculateBonusInPercentage = () => {
    const price = Number(watchPrice);
    const referrelBonusAmount = Number(watchReferrelBonus);
    if (price !== 0) {
      const bonusPercentage = (referrelBonusAmount * 100) / price;
      setValue('referrelBonusPercentage', bonusPercentage.toString());
    }
  }

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
            // options={uniqueModality}
            // value={selectedModality || null}
            options={uniqueModality.map((m) => m.description)}
            value={selectedModality}
            onChange={(e, newValue) => handleModality(newValue)}
            size="small"
            className="w-full md:w-1/2"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Modality"
                variant="outlined"
                required
              />
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
              value={bodyPartValue || null}
              onChange={(e, newValue) => handleBodyParts(newValue)}
              onInputChange={(e, newValue) => handleBodyParts(newValue)}
              size="small"
              className="w-full md:w-11/12"
              renderOption={(props, option, { index }) => (
                <li {...props} key={`${option.label}-${index}`}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Body parts" variant="outlined" />
              )}
            />

            {/* Select Test */}
            <Autocomplete
              freeSolo
              disablePortal
              options={testOptions.map((test) => test.protocol)}
              value={selectedTest?.protocol}
              className="w-full md:w-11/12"
              onChange={(e, newValue) => handleTest(e, newValue)}
              onInputChange={(e, newValue) => handleTest(e, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Test"
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <div className='flex flex-wrap gap-4'>
              {/* Price */}
              <Controller
                name="price"
                control={control}
                rules={{ required: "Price is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enter Price"
                    variant="outlined"
                    size="small"
                    type="number"
                    className="w-full md:w-[45%]"
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
                  <FormControl size="small" className="w-full md:w-[45%]">
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
                    onBlur={calculateBonusInAmount}
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
                    onBlur={calculateBonusInPercentage}
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
              {
                isTestCheck ?
                  <Button color='error' variant='outlined' type="button" onClick={handleDelete} startIcon={<DeleteOutline />}>Delete Current Test</Button>
                  : <Button color='success' variant='outlined' type="submit" startIcon={<Save />}>Save</Button>

              }
              <Button color='error' variant='outlined' onClick={handleClear} startIcon={<Clear />}>Cancel</Button>
            </div>
          </form>
        </Paper>
      </Paper>
    </Container>
  );
};

export default TestRecords;

