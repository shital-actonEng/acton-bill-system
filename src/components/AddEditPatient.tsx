import { Button, Container, Divider, FormControlLabel, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react'
import {Save , Clear} from '@mui/icons-material';
// import ClearIcon from '@mui/icons-material/Clear';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const AddEditPatient = ({ patientData }: any) => {
    const [phone, setPhone] = useState("");

    const [form, setForm] = useState<{
        patientName: string;
        birthDate: Dayjs | null;
        ageYear: number | null,
        ageMonth: number | null,
        email: string;
        phone: string;
        gender: string;
        address: string;
        abhaId: string;
    }>({
        patientName: "",
        birthDate: null,
        ageYear: null,
        ageMonth: null,
        email: "",
        phone: "",
        gender: "",
        address: "",
        abhaId: ""
    });


    const [errors, setErrors] = useState({
        patientName: {
            error: false,
            helperText: '',
        },
        email: {
            error: false,
            helperText: '',
        },
        ageMonth: {
            error: false,
            helperText: '',
        },
        ageYear: {
            error: false,
            helperText: '',
        }
    })


    const calculateAge = (birthDate: Dayjs | null): string | null => {
        if (!birthDate) return null;

        const today = dayjs();

        let years = today.year() - birthDate.year();
        let months = today.month() - birthDate.month();

        if (today.date() < birthDate.date()) {
            months--; // not a full month yet
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    };


    const handlechange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleDateChange = (newDate: any) => {
        const updatedBirthDate = newDate as Dayjs | null;
        const age = calculateAge(newDate); // "2 years, 3 months"
        const [years, months] = age.split(',').map(val => parseInt(val));

        setForm({
            ...form,
            birthDate: updatedBirthDate,
            ageYear: years,
            ageMonth: months
        });

    }

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidAgeMonth = (ageMonth: number) => {
        return ageMonth > 11 || ageMonth < 0 ? false : true
    }

    const isValidYear = (ageYear: number) => {
        return ageYear > 150 || ageYear < 0 ? false : true
    }

    const handleSubmit = () => {
        const newErrors = {
            patientName: {
                error: form.patientName.trim() === "",
                helperText: form.patientName.trim() === "" ? 'Patient Name is required' : "",
            },
            email: {
                error: !isValidEmail(form.email),
                helperText: !isValidEmail(form.email) ? 'Enter a valid email address' : "",
            },
            ageMonth: {
                error: !isValidAgeMonth(Number(form.ageMonth)),
                helperText: !isValidAgeMonth(Number(form.ageMonth)) ? 'Please enter a valid month (0–150).' : "",
            },
            ageYear: {
                error: !isValidYear(Number(form.ageYear)),
                helperText: !isValidYear(Number(form.ageYear)) ? 'Please enter a valid month (0–11).' : "",
            }
        }
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) {
            console.warn("Form validation failed:", newErrors);
            return;
        }
        handleClear();
    }

    const handleClear = () => {
        setForm({
            patientName: "",
            birthDate: null as dayjs.Dayjs | null,
            ageYear: null,
            ageMonth: null,
            phone: "",
            gender: "",
            address: "",
            email: "",
            abhaId: ""
        })

        setPhone("");
    }

    const handlePhone = (phoneNum: any) => {
        setPhone(phoneNum);
        setForm({ ...form, phone: phoneNum })
    }


    useEffect(() => {
        if (patientData) {
            setForm({
                patientName: patientData.patientName || "",
                birthDate: patientData.birthDate ? dayjs(patientData.birthDate) : null,
                ageYear: patientData.ageYear || "",
                ageMonth: patientData.ageMonth || "",
                phone: patientData.phone || "",
                gender: patientData.gender || "",
                address: patientData.address || "",
                email: patientData.email || "",
                abhaId: patientData.abhaId || ""
            })
        }
    }, [patientData])

    return (
        <>
            <Paper className='w-full md:w-2/3 py-6 md:px-8'>
                    <Typography className='text-sm font-semibold mb-5' color='textDisabled'>Please fill patient information here to Add new Patient </Typography>
                    
                    <div className='flex flex-col gap-4  w-full'>
                        {/* Name */}
                        <TextField id="patientName"
                            label="Patient's Name"
                            name='patientName'
                            value={form.patientName}
                            size='small'
                            color='primary'
                            className='w-full'
                            onChange={handlechange}
                            required
                            error={errors.patientName.error}
                            helperText={errors.patientName.helperText} />

                        {/* Email Address */}
                        <TextField id="email" label="Email Address" variant="outlined"
                            size='small' color='primary' autoComplete="off" className='w-full'
                            name='email' onChange={handlechange} value={form.email}
                            error={errors.email.error}
                            helperText={
                                errors.email.helperText}
                        />

                        <div className='flex flex-wrap gap-4'>
                        
                            <div className='w-full dark:bg-transparent'>
                                <PhoneInput
                                    country={'in'}
                                    value={phone}
                                    onChange={(phone) => handlePhone(phone)}
                                    inputStyle={{ width: '100%' , backgroundColor: 'transparent' }}
                                    containerStyle={{ width: '100%' }}
                                />
                            </div>

                            {/*  Abha ID */}
                            <TextField id="abhaId" label="Abha ID" variant="outlined"
                                size='small' color='primary' autoComplete="off" className='w-full'
                                name='abhaId' onChange={handlechange} value={form.abhaId}
                            />
                        </div>

                        {/* Birth Date */}
                        <div className='w-full'>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoItem>
                                    <DatePicker
                                        className='w-full'
                                        label="Birth Date"
                                        name='birthDate'
                                        onChange={handleDateChange}
                                        value={form.birthDate}
                                        slotProps={{
                                            textField: {
                                                size: 'small', // or 'medium'
                                            },
                                        }}
                                    //    value={birthDate}
                                    //    onChange={(newDate) => handleBirthdate(newDate)}
                                    />
                                </DemoItem>
                            </LocalizationProvider>
                        </div>

                        {/* Age */}
                        <div className='w-full flex gap-4 md:px-5'>
                            <label>Age : </label>
                            <TextField id="year" label="Year"
                                className='md:w-2/12' size='small'
                                color='primary' autoComplete="off"
                                type='number'
                                name='ageYear'
                                onChange={handlechange}
                                error={errors.ageYear.error}
                                helperText={errors.ageYear.helperText}
                                value={form.ageYear !== null && form.ageYear !== undefined ? form.ageYear : ""}
                            />
                            <TextField id="month" label="Month"
                                className='md:w-2/12' size='small'
                                color='primary' autoComplete="off"
                                type='number'
                                name='ageMonth'
                                onChange={handlechange}
                                error={errors.ageMonth.error}
                                helperText={errors.ageMonth.helperText}
                                value={form.ageMonth !== null && form.ageMonth !== undefined ? form.ageMonth : ""}
                            />
                        </div>
                        {/* </div> */}

                        {/* Gender */}
                        <div className='flex gap-4 justify-start'>
                            <label id="gender" className='pt-1 md:px-5'>Gender : </label>
                            <RadioGroup
                                row
                                aria-labelledby="gender"
                                name="gender"
                                value={form.gender}
                                onChange={handlechange}
                            >
                                <FormControlLabel value="female" control={<Radio size='small' />} label="Female" />
                                <FormControlLabel value="male" control={<Radio size='small' />} label="Male" />
                                <FormControlLabel value="other" control={<Radio size='small' />} label="Other" />
                            </RadioGroup>
                        </div>

                        {/* Address */}
                        <TextField id="address" label="Address" variant="outlined"
                            size='small' color='primary' autoComplete="off" className='w-full'
                            multiline rows={2} name='address' value={form.address}
                            onChange={handlechange}
                        />
                        <div className='flex flex-wrap gap-4 mt-5'>
                            <Button color='success' variant='outlined'
                                onClick={handleSubmit}
                                startIcon={<Save />}  >Save</Button>
                            <Button color='error' variant='outlined'
                                onClick={handleClear} startIcon={<Clear />} >Cancel</Button>
                        </div>
                        <div>
                        <Button color='primary' variant='outlined'
                            onClick={handleSubmit} 
                            startIcon={<Save />} 
                         > Save & Proceed To Transaction </Button>
                         </div>
                    </div>
                    <Divider className='my-6' />
            </Paper>
        </>
    )
}

export default AddEditPatient
