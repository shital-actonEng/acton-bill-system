"use client"
import { Autocomplete, Box, Button, Card, Chip, Container, InputAdornment, ListItemIcon, ListItemText, MenuItem, Paper, Tab, Tabs, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Search,HowToReg, Payment, CurrencyRupee, Money, QrCodeScanner, AccountBalance, LocalAtm } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
// import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// import PaymentMode from './PaymentMode';
import Link from 'next/link';
import { getPatients } from '@/express-api/patient/page';
import TestPriceTable from './TestPriceTable';
import AdditionalChargeTable from './AdditionalChargeTable';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2, px: 1 }}>{children}</Box>}
        </div>
    );
}


function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const paymentMode = [
    {
        id: 1,
        PaymentMode: "Payment Mode(Default: Cash)",
        icon: <Money />,
    },
    {
        id: 2,
        PaymentMode: "UPI (Pay via any app)",
        icon: <QrCodeScanner />,
    },
    {
        id: 3,
        PaymentMode: "Credit/Debit card",
        icon: <Payment />
    },
    {
        id: 4,
        PaymentMode: "NET BANKING",
        icon: <AccountBalance />
    },
    {
        id: 5,
        PaymentMode: "CHEQUE",
        icon: <LocalAtm />
    }
]


type patient = {
    pk: number,
    name: string,
    mobile: string,
    meta_details: {
        abhaId: string,
        address: string,
        ageMonth: number,
        ageYear: number,
        birthDate: Date,
        email: string,
        gender: string
    }
}



const RegisterPatientForm = () => {
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [selectPaymentMode, setSelectPaymentMode] = useState("");
    const [additionalCharges, setAdditionalCharges] = useState(0);
    const [gstTaxAdditional, setGstTaxAdditional] = useState(0);
    const [description, setDescription] = useState("");
    const [totalBillingAmount, setTotalBillingAmount] = useState(0);
    const [totalAdditionalCharges, setTotalAdditionalCharges] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openPatient, setOpenPatient] = useState(false);
    const [patientData, setPatientData] = useState<patient[]>([]);
    const [searchPatient, setSearchPatient] = useState<patient | null>(null);
    const [additionalChargeTable, setAdditionalChargeTable] = useState<{ id: number; additionalCharges: string; gst: number; description: string; subtTotalCharges: number }[]>([]);

    // const handleTestTable = (test: any) => {
    //     if (test === null) {
    //         // Clear the selected modality and filtered data when the input is cleared
    //         // setSelectedTest('');
    //         return;
    //     }
    //     // const items = test.label;
    //     const item = testData.find((option) => option.protocol === test.label);
    //     if (!item) {
    //         console.log("Item not found...")
    //         return;
    //     }
    //     setTestTableData((prevData) => {
    //         const newId = prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 1;
    //         const newName = item.protocol;
    //         const newPrice = item.price;
    //         const aggregateDueVal = Number(item.price);
    //         return [...prevData, { id: newId, name: newName, price: newPrice, aggregateDue: aggregateDueVal }]
    //     }
    //     );
    //     // setSelectedTest(test.name);
    //     // setSubTotalPrice((prevTotal) => prevTotal + Number(item.price));
    //     // setTotalBill(subTotalPrice + subTotalAmount + totalTax);
    // }

    // const deleteTest = (deletedData: any) => {
    //     const gst = deletedData.gst * deletedData.price / 100
    //     setTestTableData((data) => data.filter((item) => item.id !== deletedData.id))
    //     setSubTotalPrice((prevTotal) => prevTotal - deletedData.price - gst);
    // }

    // const handleModality = (selectmodality: any) => {
    //     const modalities = testData.filter((test) =>
    //         test.modality.toLowerCase().includes(selectmodality.label.toLowerCase())
    //     )
    //     // for filtered and unique body parts according to modality
    //     const uniqueBodyParts = modalities
    //         .filter((item, index, self) =>
    //             index === self.findIndex((t) => t.body_part === item.body_part)
    //         )
    //         .map((item, index) => ({
    //             id: index,
    //             label: item.body_part,
    //         }));
    //     setUniqueBodyParts(uniqueBodyParts);
    // }

    // const handleBodyParts = (body_parts: any) => {
    //     const body_part = testData.filter((test) =>
    //         test.body_part.toLowerCase().includes(body_parts.label.toLowerCase())
    //     )
    //     setSelectedTest(body_part);
    // };

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    // const uniqueModalities = useMemo(() => {
    //     console.time("modalities");
    //     const result = getUniqueOptions(jsonData, "modality");
    //     console.timeEnd("modalities");
    //     return result;
    // }, [jsonData]);

    // const uniqueBodyPart = useMemo(() => {
    //     console.time("bodyParts");
    //     const result = getUniqueOptions(jsonData, "body_part");
    //     console.timeEnd("bodyParts");
    //     return result;
    // }, [jsonData]);

    // useEffect(() => {
    //     setTestData(jsonData);
    //     setUniqueModality(uniqueModalities)
    //     setUniqueBodyParts(uniqueBodyPart)
    //     //Tests 
    //     setSelectedTest(jsonData);
    // }, [jsonData, uniqueModalities, uniqueBodyPart])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const proceedToBill = () => {
        setTabValue(1);
        setTotalBillingAmount((prev) => prev + additionalCharges);
        setBalanceRemaining((prev) => prev + additionalCharges);
    }

    // const handleConsessionChange = (id: number, e: any) => {
    //     const value = e.target.value;

    //     setTestTableData((prevData) =>
    //         prevData.map((item) =>
    //             item.id === id ? { ...item, consession: Number(value), aggregateDue: (item.price - (item.price * Number(value) / 100)) } : item // Update only the matching row
    //         )
    //     );
    // };

    // const handleGstChange = (id: number, e: any) => {

    // }

    // const handleCommentChange = (id: number, event: any) => {
    //     const updatedData = testTableData.map((item) =>
    //         item.id === id ? { ...item, comment: event.target.value } : item
    //     );
    //     setTestTableData(updatedData);
    // };

    // const handleAdditionalCharges = (e: any) => {
    //     const charges = Number(e.target.value);
    //     setAdditionalCharges(charges);
    // }

    // const addChargesToTable = () => {
    //     const total = additionalCharges + (additionalCharges * gstTaxAdditional / 100)
    //     setAdditionalChargeTable((prev) => {
    //         const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1
    //         const newEntry = {
    //             id: nextId,
    //             additionalCharges: additionalCharges,
    //             gst: gstTaxAdditional,
    //             description: description,
    //             subtTotalCharges: total
    //         };
    //         return [...prev, newEntry]
    //     })

    //     setTotalAdditionalCharges((prev) => prev + total);
    //     clearCharges();
    // }

    // const clearCharges = () => {
    //     setAdditionalCharges(0);
    //     setDescription("");
    //     setGstTaxAdditional(0);
    // }

    // const deleteCharges = (data: any) => {
    //     const total = additionalCharges - (additionalCharges * gstTaxAdditional / 100)
    //     setTotalAdditionalCharges((prev) => prev - Number(data.subtTotalCharges));
    //     setAdditionalChargeTable((items) => items.filter((item) => item.id !== data.id))
    // }

    // useEffect(() => {
    //     const newTotal = testTableData.reduce(
    //         (sum, item) => sum + item.aggregateDue,
    //         0
    //     );
    //     setSubTotalPrice(newTotal);
    //     // setTotalBill(newTotal + subTotalAmount + totalTax);
    //     setTotalBillingAmount(newTotal + totalAdditionalCharges);
    //     setBalanceRemaining(newTotal + totalAdditionalCharges);

    //     const marks = performance.getEntriesByName("table-render-start");
    //     if (marks.length > 0) {
    //         performance.mark("table-render-end");
    //         performance.measure("table-render-time", "table-render-start", "table-render-end");

    //         const measure = performance.getEntriesByName("table-render-time")[0];
    //         console.log(`Table render time: ${measure.duration.toFixed(2)}ms`);

    //         // Clean up
    //         performance.clearMarks();
    //         performance.clearMeasures();
    //     }
    // }, [testTableData]);

    useEffect(() => {
        setBalanceRemaining((prev) => prev - amountPaid);
    }, [amountPaid])


    const loadPatientData = async () => {
        try {
            setLoading(true);
            const result = await getPatients();
            setPatientData(result);
        } catch (error) {
            console.log("failed to load patient data")
        }
        finally {
            setLoading(false);
        }
    }
    const patientsearchData = (val: any) => {
        setSearchPatient(val);
    }

    performance.mark("table-render-start");
    return (
        <>
            <Container className='pb-6 px-4'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Register and payment mode"
                        textColor="primary"
                        indicatorColor="primary" >
                        <Tab label="Billing Details" {...a11yProps(0)} icon={<HowToReg />} iconPosition="start" />
                        <Tab label="Payment" {...a11yProps(1)} icon={<Payment />} iconPosition="start" />
                        {/* <Tab label="Payment Mode"  {...a11yProps(1)} icon={<CurrencyRupeeIcon />} iconPosition="start" disabled /> */}
                    </Tabs>
                </Box>

                {/* Patient Information pannel */}
                <CustomTabPanel value={tabValue} index={0}>
                    <div className='flex grid-cols-3 gap-4' >
                        {/* Select Patient to search its data */}
                        <Autocomplete
                            disablePortal
                            id="combo-box-modality"
                            options={patientData}
                            // value={modality}
                            open={openPatient}
                            loading={loading}
                            onOpen={() => {
                                setOpenPatient(true)
                                loadPatientData()
                            }}
                            onClose={() => {
                                setOpenPatient(false)
                            }}
                            onChange={(e, newValue) => patientsearchData(newValue)}
                            size="small"
                            className="w-full md:w-1/2"
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            renderOption={(props, option) => (
                                <li {...props} key={option.pk}>
                                    {`${option.name}   (${option.mobile})`}
                                </li>
                            )}
                            filterOptions={(options, state) => {
                                const searchInput = state.inputValue.toLowerCase().trim();
                                return options.filter((option) => {
                                    const nameMatch = option.name.toLowerCase().includes(searchInput);
                                    const phoneMatch = String(option.mobile).includes(searchInput);
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
                    </div>

                    <Divider className='my-6 '>
                    </Divider>

                    <Paper className='w-full py-6 md:px-8'>
                        {/* Basic Information */}
                        <div className='w-2/3 md:w-1/3'>
                            {
                                searchPatient == null ?
                                (
                                    <>
                                        <Typography className="font-semibold text-sm">
                                            Search  for a patient for bill record.
                                        </Typography>
                                    </>
                                )
                                    : 
                                    (<> <Typography className='text-sm font-semibold mb-3'> {searchPatient?.name} </Typography>
                                        <Typography className='text-sm mb-3' >Age :  {searchPatient?.meta_details.ageYear} </Typography>
                                        <Typography className='text-sm mb-3' > {searchPatient?.meta_details.address} </Typography>
                                        <Typography className='text-sm mb-3'> mobile : <span className='font-bold'> {searchPatient?.mobile} </span> </Typography>
                                    </>)

                            }

                        </div>

                        <TestPriceTable />
                    </Paper>

                    {/* Additional charges */}
                    <Paper className='w-full mt-5 py-6 md:px-8'>
                        {/* <div className='flex flex-wrap gap-4  w-full md:w-2/3'> */}
                            {/* <TextField
                                id="additionalCharges"
                                label="Additional Charges"
                                type='number'
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
                            /> */}

                            {/*  Tax Or GST */}
                            {/* <FormControl size="small" className='w-full md:w-[45%]'>
                                <InputLabel id="GST">GST(%)</InputLabel>
                                <Select
                                    labelId="GST"
                                    id="GST"
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
                            </FormControl> */}

                            {/* Description */}
                            {/* <TextField id="descriptionAdditinalCharges" label="Description" variant="outlined"
                                size='small' color='primary' autoComplete="off" className='w-11/12'
                                name='descriptionAdditinalCharges'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Tooltip title="Add Data To Table" placement="right" arrow>
                                <IconButton aria-label="Add" color='primary' className='pb-6'
                                    onClick={addChargesToTable} >
                                    <AddCircle />
                                </IconButton>
                            </Tooltip> */}
                        {/* </div> */}
                        {/* </Paper> */}

                        {/* Additional charges table */}
                        {/* Tests and price tabe */}
                        {/* <TableContainer className='mt-5'>
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
                        </TableContainer> */}

                        <AdditionalChargeTable />

                        {/* Proceed to Billing details */}
                        <div className='mt-6'>
                            <Button variant="contained" onClick={proceedToBill}>Proceed To Bill</Button>
                        </div>
                    </Paper>

                </CustomTabPanel>

                {/* Billing Deatils custom pannel */}
                <CustomTabPanel value={tabValue} index={1}>
                    {/* Patient details for reference */}
                    <div className='flex'>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {searchPatient?.name} </Typography>
                    </div>

                    <Paper className='w-full md:w-2/3 mt-5 py-6 md:px-8'>
                        <div className='flex  flex-col  gap-4'>
                            <Typography color='' className='text-base' > <span > Test Charges : </span> <CurrencyRupee fontSize='small' /> {ccyFormat(subTotalPrice)}  </Typography>
                            <Typography color='' className='text-base'> Additional Charges : <CurrencyRupee fontSize='small' /> {ccyFormat(totalAdditionalCharges)} </Typography>
                            <Typography color='' className='text-base'> Billing Amount : <CurrencyRupee fontSize='small' /> {ccyFormat(totalBillingAmount)} </Typography>

                            {/* Amount paid */}
                            {/* <label className='mt-2 w-full md:w-1/4'>Amount paid</label> */}
                            <TextField id="amountPaid" label="Amount Paid" variant="outlined"
                                size='small' color='primary' autoComplete="off" className='w-full md:w-6/12 mt-4'
                                name='amountPaid'
                                value={amountPaid}
                                type='number'
                                onChange={(e) => setAmountPaid(Number(e.target.value))}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CurrencyRupee fontSize='small' />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <div className='flex flex-wrap gap-4'>
                                {/* Payment Mode */}
                                <Select
                                    labelId="payment_mode"
                                    id="payment_mode"
                                    value={selectPaymentMode}
                                    label="Payment Mode"
                                    onChange={(e) => setSelectPaymentMode(e.target.value)}
                                    className="w-full md:w-1/2"
                                    size="small"
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected === "") {
                                            return "Payment Mode";
                                        }
                                        return selected;
                                    }}
                                >
                                    {
                                        paymentMode.map((data, index) =>
                                            <MenuItem value={data.PaymentMode} key={index}>
                                                <ListItemIcon>{data.icon}</ListItemIcon>
                                                <ListItemText primary={data.PaymentMode} />
                                            </MenuItem>
                                        )
                                    }
                                </Select>

                                {/* Transaction Details */}
                                <TextField id="transactionDetails" label="Transaction details" variant="outlined"
                                    size='small' color='primary' autoComplete="off" className='w-full md:w-5/12'
                                />
                            </div>
                        </div>
                    </Paper>

                    <Divider className='mt-5' />
                    <div className='mt-6 flex justify-end gap-x-10 w-full'>
                        <Typography color='textDisabled' className='mt-3'> Balance Remaining : <CurrencyRupee fontSize='small' /> {ccyFormat(balanceRemaining)} </Typography>
                        <Link href="/registeredpatients" >
                            <Button variant="contained">Confirm & Proceed</Button>
                        </Link>
                    </div>
                </CustomTabPanel>

                {/* Billing Deatils custom pannel */}
                {/* <CustomTabPanel value={tabValue} index={2}>
                    <div className='flex gap-14'>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {patientName} </Typography>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Total Bill : {totalBill} </Typography>
                    </div>

                    <div>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Choose Payment Mode </Typography>
                    </div>
                    <PaymentMode />
                </CustomTabPanel> */}

            </Container>
        </>
    )
}

export default RegisterPatientForm