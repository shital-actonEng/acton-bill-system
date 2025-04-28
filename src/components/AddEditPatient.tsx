'use client';

import { Button, Divider, FormControlLabel, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { Save, Clear } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { addPatient, updatePatient } from '@/express-api/patient/page';
import 'react-phone-input-2/lib/style.css';
import { useEffect } from 'react';

const PhoneInput = dynamic(() => import('react-phone-input-2'), {
  ssr: false,
  loading: () => <div>Loading phone input...</div>
});

type FormValues = {
  patientName: string;
  birthDate: Dayjs | null;
  ageYear: number | null;
  ageMonth: number | null;
  email: string;
  phone: string;
  gender: string;
  address: string;
  abhaId: string;
};

const AddEditPatient = ({ patientData }: any) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      patientName: '',
      birthDate: null,
      ageYear: null,
      ageMonth: null,
      email: '',
      phone: '',
      gender: '',
      address: '',
      abhaId: ''
    }
  });

  const calculateAge = (birthDate: Dayjs | null): { years: number, months: number } | null => {
    if (!birthDate) return null;
    const today = dayjs();
    let years = today.year() - birthDate.year();
    let months = today.month() - birthDate.month();
    if (today.date() < birthDate.date()) months--;
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const onSubmit = (data: FormValues) => {
    const payload = {
      name: data.patientName,
      mobile: data.phone,
      meta_details: {
        birthDate: data.birthDate,
        ageYear: data.ageYear,
        ageMonth: data.ageMonth,
        gender: data.gender,
        address: data.address,
        email: data.email,
        abhaId: data.abhaId
      }
    };

    if (patientData?.pk) {
      updatePatient(patientData.pk, payload);
    } else {
      addPatient(payload);
    }
    handleClear();
  };

  useEffect(() => {
    if (patientData) {
      const meta = patientData.meta_details || {};
      reset({
        patientName: patientData.name || '',
        birthDate: meta.birthDate ? dayjs(meta.birthDate) : null,
        ageYear: meta.ageYear || null,
        ageMonth: meta.ageMonth || null,
        phone: patientData.mobile || '',
        gender: meta.gender || '',
        address: meta.address || '',
        email: meta.email || '',
        abhaId: meta.abhaId || ''
      });
    }
    else{
        reset({
            patientName: '',
            birthDate: null,
            ageYear: null,
            ageMonth: null,
            email: '',
            phone: '',
            gender: '',
            address: '',
            abhaId: ''
        })
    }
  }, [patientData, reset]);

  const handleClear = () =>{
    reset({
        patientName: '',
        birthDate: null,
        ageYear: null,
        ageMonth: null,
        email: '',
        phone: '',
        gender: '',
        address: '',
        abhaId: ''
    })
  }

  return (
    <Paper className='w-full md:w-2/3 py-6 md:px-8'>
      <Typography className='text-sm font-semibold mb-5' color='textDisabled'>
        Please fill patient information here to Add new Patient
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

        {/* Patient Name */}
        <Controller
          name="patientName"
          control={control}
          rules={{ required: "Patient Name is required" }}
          render={({ field }) => (
            <TextField {...field} label="Patient's Name" size='small' error={!!errors.patientName} helperText={errors.patientName?.message} />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" }
          }}
          render={({ field }) => (
            <TextField {...field} label="Email Address" size='small' error={!!errors.email} helperText={errors.email?.message} />
          )}
        />

        {/* Phone */}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              country={'in'}
              value={field.value || ''}
              onChange={field.onChange}
              inputStyle={{ width: '100%', backgroundColor: 'transparent' }}
              containerStyle={{ width: '100%' }}
            />
          )}
        />

        {/* Abha ID */}
        <Controller
          name="abhaId"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Abha ID" size='small' />
          )}
        />

        {/* Birth Date */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem>
                <DatePicker
                  {...field}
                  label="Birth Date"
                  onChange={(newDate) => {
                    field.onChange(newDate);
                    const age = calculateAge(newDate);
                    if (age) {
                      setValue('ageYear', age.years);
                      setValue('ageMonth', age.months);
                    }
                  }}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </DemoItem>
            </LocalizationProvider>
          )}
        />

        {/* Age */}
        <div className='flex gap-4'>
          <label className='w-20'>Age : </label>

          <Controller
            name="ageYear"
            control={control}
            rules={{
              min: { value: 0, message: "Year must be positive" },
              max: { value: 150, message: "Year must be less than 150" }
            }}
            render={({ field }) => (
              <TextField {...field} label="Year" size='small' type="number" error={!!errors.ageYear} helperText={errors.ageYear?.message} className='md:w-2/12' />
            )}
          />

          <Controller
            name="ageMonth"
            control={control}
            rules={{
              min: { value: 0, message: "Month must be positive" },
              max: { value: 11, message: "Month must be less than 12" }
            }}
            render={({ field }) => (
              <TextField {...field} label="Month" size='small' type="number" error={!!errors.ageMonth} helperText={errors.ageMonth?.message} className='md:w-2/12' />
            )}
          />
        </div>

        {/* Gender */}
        <div className='flex gap-4'>
          <label id="gender" className='pt-1 w-20'>Gender : </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel value="female" control={<Radio size='small' />} label="Female" />
                <FormControlLabel value="male" control={<Radio size='small' />} label="Male" />
                <FormControlLabel value="other" control={<Radio size='small' />} label="Other" />
              </RadioGroup>
            )}
          />
        </div>

        {/* Address */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Address" size='small' multiline rows={2} />
          )}
        />

        {/* Buttons */}
        <div className='flex gap-4 mt-5'>
          <Button type="submit" color='success' variant='outlined' startIcon={<Save />}>Save</Button>
          <Button type="button" onClick={handleClear } color='error' variant='outlined' startIcon={<Clear />}>Cancel</Button>
        </div>

        <Button type="button" color='primary' variant='outlined' startIcon={<Save />}>
          Save & Proceed To Transaction
        </Button>

      </form>

      <Divider className='my-6' />
    </Paper>
  );
};

export default AddEditPatient;
