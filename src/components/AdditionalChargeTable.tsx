import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CurrencyRupee, AddCircle, DeleteOutline } from '@mui/icons-material'
import { useBillingStore } from '@/stores/billingStore';

const AdditionalChargeTable = () => {
    const [additionalCharges, setAdditionalCharges] = useState(0);
    const [gstTaxAdditional, setGstTaxAdditional] = useState(0);
    const [description, setDescription] = useState("");
    const gstItem = [0, 5, 12, 18, 28]
     const {isDisabled , updateState } = useBillingStore();
     const additionalChargeTable = useBillingStore((state) => state.additionalChargeTable);
     const totalAdditionalCharges = useBillingStore((state) => state.totalAdditionalCharges);

    const handleAdditionalCharges = (e: any) => {
        const charges = Number(e.target.value);
        setAdditionalCharges(charges);
    }

    const addChargesToTable = () => {
        const total = additionalCharges + (additionalCharges * gstTaxAdditional / 100)
        
        const nextId = additionalChargeTable.length > 0 ? additionalChargeTable[additionalChargeTable.length - 1].id + 1 : 1
            const newEntry = {
                id: nextId,
                additionalCharges: additionalCharges,
                gst: gstTaxAdditional,
                description: description,
                subtTotalCharges: total
            };
        
        updateState({additionalChargeTable : [...additionalChargeTable , newEntry] })
        updateState({totalAdditionalCharges : totalAdditionalCharges + total })
        
        clearCharges();
    }

    const clearCharges = () => {
        setAdditionalCharges(0);
        setDescription("");
        setGstTaxAdditional(0);
    }

    const deleteCharges = (data: any) => {
        const total = additionalCharges - (additionalCharges * gstTaxAdditional / 100)
        updateState({totalAdditionalCharges : totalAdditionalCharges - Number(data?.subtTotalCharges)})
        const updateData = additionalChargeTable.filter((item) => item.id !== data.id )
        updateState({ additionalChargeTable : updateData });
    }

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    return (
        <>
            <div className='flex flex-wrap gap-4  w-full md:w-2/3'>
                <TextField
                    id="additionalCharges"
                    label="Additional Charges"
                    // type='number'
                    disabled = {isDisabled}
                    autoComplete='off'
                    size='small'
                    placeholder='Additional Charges (if any)'
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CurrencyRupee fontSize='small' />
                                </InputAdornment>
                            ),
                        },
                    }}
                    variant="outlined"
                    className='w-full md:w-[45%]'
                    value={additionalCharges}
                    onChange={handleAdditionalCharges}
                />

                {/*  Tax Or GST */}
                <FormControl size="small" className='w-full md:w-[45%]'>
                    <InputLabel id="GST">GST(%)</InputLabel>
                    <Select
                        labelId="GST"
                        id="GST"
                        disabled = {isDisabled}
                        value={gstTaxAdditional}
                        label="GST"
                        name='gst'
                        onChange={(e) => setGstTaxAdditional(Number(e.target.value))}
                        size='small'
                    >
                        {
                            gstItem.map((item, index) =>
                                <MenuItem key={index} value={item}>
                                    {item}
                                </MenuItem>
                            )
                        }
                    </Select>
                </FormControl>

                {/* Description */}
                <TextField id="descriptionAdditinalCharges" label="Description" variant="outlined"
                    size='small' color='primary' autoComplete="off" className='w-11/12'
                    name='descriptionAdditinalCharges'
                    value={description}
                    disabled = {isDisabled}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Tooltip title="Add Data To Table" placement="right" arrow>
                    <IconButton aria-label="Add" color='primary' className='pb-6'
                        onClick={addChargesToTable} >
                        <AddCircle />
                    </IconButton>
                </Tooltip>
            </div>
            {/* </Paper> */}

            {/* Additional charges table */}
            {/* Tests and price tabe */}
            <TableContainer className='mt-5'>
                <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                    <TableHead>
                        <TableRow>
                            <TableCell className="font-semibold">Description</TableCell>
                            <TableCell className="font-semibold">Charges</TableCell>
                            <TableCell className="font-semibold">GST(%)</TableCell>
                            <TableCell className="font-semibold">Sub Total</TableCell>
                            <TableCell className="font-semibold"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {additionalChargeTable.map((data, index) => (
                            <TableRow key={data.id}>
                                <TableCell className='py-0'>
                                    {data.description}
                                </TableCell>
                                <TableCell className='py-0'>{data.additionalCharges}</TableCell>
                                <TableCell className='py-0'>
                                    {data.gst}
                                </TableCell>
                                <TableCell className='py-0'>
                                    {data.subtTotalCharges}
                                </TableCell>
                                <TableCell className='py-0'>
                                    <IconButton aria-label="delete" onClick={() => deleteCharges(data)}>
                                        <DeleteOutline color='error' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={3} className='font-bold' align='right'>Total</TableCell>
                            <TableCell className='font-bold'>{ccyFormat(totalAdditionalCharges)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default AdditionalChargeTable
