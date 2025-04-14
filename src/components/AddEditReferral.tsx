import { Button, Container, Divider, FormControlLabel, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const AddEditReferral = ({ referralData }: any) => {
    const [phone, setPhone] = useState("");

    const [form, setForm] = useState({
        doctorName: "",
        email: "",
        medicalDegree: "",
        referrelBonusPercentage: "",
        referrelBonus: "",
        address: "",
        phone: "",
        prn: ""
    })

    const [errors, setErrors] = useState({
        doctorName: {
            error: false,
            helperText: ''
        },
        email: {
            error: false,
            helperText: ''
        },
    })

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...form,
            [name]: value
        };

        setForm(updatedForm);
    }

    const handleClear = () => {
        setForm({
            doctorName: "",
            email: "",
            medicalDegree: "",
            referrelBonusPercentage: "",
            referrelBonus: "",
            address: "",
            phone: "",
            prn: ""
        })
        setPhone("");
    }

    const handleSubmit = () => {
        const newErrors = {
            doctorName: {
                error: form.doctorName.trim() === "",
                helperText: form.doctorName.trim() === "" ? "Enter doctor name" : ''
            },
            email: {
                error: !isValidEmail(form.email),
                helperText: !isValidEmail(form.email) ? "Enter valid mail id" : ""
            },
        }
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) {
            console.warn("Form validation failed:", newErrors);
            return;
        }
        console.log("Referral data is...", form);
        handleClear();
    }

    const handlePhone = (phoneNum: any) => {
        setPhone(phoneNum);
        setForm({ ...form, phone: phoneNum })
    }

    useEffect(() => {
        if (referralData) {
            setForm({
                doctorName: referralData.doctorName || "",
                email: referralData.email || "",
                medicalDegree: referralData.medicalDegree || "",
                referrelBonusPercentage: referralData.referrelBonusPercentage || "",
                referrelBonus: referralData.referrelBonus || "",
                address: referralData.address || "",
                phone: referralData.phone || "",
                prn: referralData.prn || ""
            })
        }
        console.log("referral data ...", form);
    }, [referralData])

    return (
        <>
            <Paper className='w-full md:w-2/3'>
                <Container className='py-6 md:px-8'>
                    <Typography className='text-sm font-semibold mb-4' color='textDisabled'>Please fill New Physician information here </Typography>
                    <div className='flex gap-4 justify-between' >
                        <div className='flex flex-col gap-4 w-full'>
                            {/* Doctor Name */}
                            <TextField id="doctorName"
                                label="Doctor's Name"
                                name='doctorName'
                                value={form.doctorName}
                                onChange={handleChange}
                                size='small'
                                color='primary'
                                className='w-full'
                                autoComplete='off'
                                required
                                error={errors.doctorName.error}
                                helperText={errors.doctorName.helperText} />

                            {/* Email */}
                            <TextField id="email"
                                label="Email address"
                                size='small'
                                color='primary'
                                className='w-full'
                                name='email'
                                autoComplete='off'
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email.error}
                                helperText={
                                    errors.email.helperText
                                } />

                            {/* Medical Degree */}
                            <TextField id="degree"
                                label="Medical Degree"
                                size='small'
                                color='primary'
                                className='w-full'
                                name='medicalDegree'
                                autoComplete='off'
                                value={form.medicalDegree}
                                onChange={handleChange} />

                            {/* Physician Registration Number (PRN)*/}
                            <TextField id="prn" label="Physician Registration Number (PRN)" variant="outlined"
                                size='small' color='primary' autoComplete="off" className='w-full'
                                name='prn' value={form.prn} onChange={handleChange}
                            />

                            {/* Mobile Number */}
                            <div className='w-full'>
                                <PhoneInput
                                    country={'in'}
                                    value={phone}
                                    onChange={(phone) => handlePhone(phone)}
                                    inputStyle={{ width: '100%' }}
                                    containerStyle={{ width: '100%' }}
                                />
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

                            {/* Communication Address */}
                            <TextField id="address" label="Address" variant="outlined"
                                size='small' color='primary' autoComplete="off" className='w-full'
                                multiline rows={2} name='address' value={form.address} onChange={handleChange}
                            />

                            <div className='flex gap-4 mt-5'>
                                <Button color='success' variant='outlined' onClick={handleSubmit}
                                    startIcon={<SaveIcon />} >Save</Button>
                                <Button color='error' variant='outlined' onClick={handleClear}
                                    startIcon={<ClearIcon />} >Cancel</Button>
                            </div>
                        </div>
                    </div>

                    <Divider className='my-6' />

                </Container>
            </Paper>
        </>
    )
}

export default AddEditReferral
