'use client'
import { Button, Container, Divider, FormControlLabel, InputAdornment, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Save, Clear, CurrencyRupee } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useForm, Controller } from 'react-hook-form'
import { addReferrer, updateReferrer } from '@/express-api/referrer/page';

const AddEditReferral = ({ referralData }: any) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            doctorName: "",
            email: "",
            medicalDegree: "",
            referrelBonusPercentage: "",
            referrelBonus: "",
            address: "",
            phone: "",
            prn: ""
        }
    });

    const onSubmit = (formData: any) => {
        const data = {
            name: formData.doctorName,
            meta_details: {
                mobile: formData.phone,
                email: formData.email,
                medicalDegree: formData.medicalDegree,
                prn: formData.prn,
                bonusInPercentage: formData.referrelBonusPercentage,
                bonus: formData.referrelBonus,
                address: formData.address
            }
        }
        // addReferrer(data);

        if (referralData?.pk) {
            console.log("referrel pk is there...", referralData?.pk);
            const pk = referralData?.pk
            const dataWithPk = {
                ...data,
                pk: pk,
            };

            updateReferrer(dataWithPk);
        } else {
            addReferrer(data);
        }

        handleClear();
    };

    const handleClear = () => {
        reset({
            doctorName: "",
            email: "",
            medicalDegree: "",
            referrelBonusPercentage: "",
            referrelBonus: "",
            address: "",
            phone: "",
            prn: ""
        });
    }

    useEffect(() => {
        if (referralData) {
            const meta = referralData?.meta_details;
            if (meta) {
                reset({
                    doctorName: referralData.name || "",
                    email: meta.email || "",
                    medicalDegree: meta.medicalDegree || "",
                    referrelBonusPercentage: meta.bonusInPercentage || "",
                    referrelBonus: meta.bonus || "",
                    address: meta.address || "",
                    phone: meta.mobile || "",
                    prn: meta.prn || ""
                });
            }
        }
        else {
            reset({
                doctorName: "",
                email: "",
                medicalDegree: "",
                referrelBonusPercentage: "",
                referrelBonus: "",
                address: "",
                phone: "",
                prn: ""
            });
        }
    }, [referralData, reset]);

    return (
        <>
            <Paper className='w-full md:w-2/3 py-6 md:px-8'>
                <Typography className='text-sm font-semibold mb-4' color='textDisabled'>
                    Please fill New Physician information here
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 justify-between'>
                    <div className='flex flex-col gap-4 w-full'>

                        {/* Doctor Name */}
                        <Controller
                            name="doctorName"
                            control={control}
                            rules={{ required: "Doctor Name is required" }}
                            render={({ field }) => (
                                <TextField {...field}
                                    label="Doctor's Name"
                                    size='small'
                                    color='primary'
                                    className='w-full'
                                    autoComplete='off'
                                    error={!!errors.doctorName}
                                    helperText={errors.doctorName?.message}
                                />
                            )}
                        />

                        {/* Email */}
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address"
                                }
                            }}
                            render={({ field }) => (
                                <TextField {...field}
                                    label="Email address"
                                    size='small'
                                    color='primary'
                                    className='w-full'
                                    autoComplete='off'
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />

                        {/* Medical Degree */}
                        <Controller
                            name="medicalDegree"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field}
                                    label="Medical Degree"
                                    size='small'
                                    color='primary'
                                    className='w-full'
                                    autoComplete='off'
                                />
                            )}
                        />

                        {/* Physician Registration Number (PRN) */}
                        <Controller
                            name="prn"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field}
                                    label="Physician Registration Number (PRN)"
                                    size='small'
                                    color='primary'
                                    autoComplete='off'
                                    className='w-full'
                                />
                            )}
                        />

                        {/* Mobile Number */}
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    country={'in'}
                                    value={field.value}
                                    onChange={(phone) => field.onChange(phone)}
                                    inputStyle={{ width: '100%', backgroundColor: 'transparent' }}
                                    containerStyle={{ width: '100%' }}
                                />
                            )}
                        />

                        {/* Referral Bonus */}
                        <div className='flex flex-wrap gap-4'>
                            <label className='mt-2 w-full md:w-1/4'>Enter Referral Bonus</label>
                            <Controller
                                name="referrelBonusPercentage"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field}
                                        label="Bonus(%)"
                                        size='small'
                                        color='primary'
                                        className='w-1/2 md:w-1/4'
                                        autoComplete='off'
                                        type='number'
                                    />
                                )}
                            />

                            <span className='mt-2'>OR</span>

                            <Controller
                                name="referrelBonus"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field}
                                        label="Bonus"
                                        size='small'
                                        color='primary'
                                        className='w-1/2 md:w-1/4'
                                        autoComplete='off'
                                        type='number'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupee fontSize='small' />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Address */}
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field}
                                    label="Address"
                                    variant="outlined"
                                    size='small'
                                    color='primary'
                                    autoComplete='off'
                                    className='w-full'
                                    multiline
                                    rows={2}
                                />
                            )}
                        />

                        {/* Buttons */}
                        <div className='flex gap-4 mt-5'>
                            <Button color='success' variant='outlined' type='submit'
                                startIcon={<Save />}>Save</Button>
                            <Button color='error' variant='outlined' type='button' onClick={handleClear}
                                startIcon={<Clear />}>Cancel</Button>
                        </div>

                    </div>
                </form>

                <Divider className='my-6' />
            </Paper>
        </>
    )
}

export default AddEditReferral


