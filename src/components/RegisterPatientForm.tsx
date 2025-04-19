"use client"
import { Alert, Autocomplete, Box, Button, Card, Chip, Container, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Paper, Popover, Radio, RadioGroup, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {Search , AddCircle , Save, Cancel , DeleteOutline , HowToReg , Payment , CurrencyRupee , Money ,QrCodeScanner , AccountBalance , LocalAtm , AddComment} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import dayjs, { Dayjs } from 'dayjs';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import jsonData from '../../data/testsData.json';
// import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// import PaymentMode from './PaymentMode';
import CustomInput from './ui/CustomInput';
import Link from 'next/link';


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

const gstItem = [0, 5, 12, 18, 28]

// Utility function
const getUniqueOptions = (data: any[], key: string) => {
    const seen = new Set();
    return data
      .filter((item) => {
        if (!seen.has(item[key])) {
          seen.add(item[key]);
          return true;
        }
        return false;
      })
      .map((item, index) => ({
        id: index,
        label: item[key],
      }));
  };
  
  

// const calculateAge = (birthDate: Dayjs | null): number | null => {
//     if (!birthDate) return null;

//     const today = dayjs();
//     let age = today.year() - birthDate.year();

//     if (today.month() < birthDate.month() ||
//         (today.month() === birthDate.month() && today.date() < birthDate.date())) {
//         age--;
//     }

//     return age;
// };


const RegisterPatientForm = () => {
    const [patientName, setPatientName] = useState('');
    const [referredDoctor, setReferredDoctor] = useState('');
    const [selectReferreing, setSelectReferreing] = useState<string[]>([]);
    const [bodyParts, setBodyParts] = useState("");
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [testTableData, setTestTableData] = useState<{ id: number; name: string; price: number; consession: number; gst: number; comment: string; aggregateDue: number }[]>([]);
    const [testData, setTestData] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [selectPaymentMode, setSelectPaymentMode] = useState("");
    const [uniqueModality, setUniqueModality] = useState<{ id: number, label: string }[]>([]);
    const [uniqueBodyParts, setUniqueBodyParts] = useState<{ id: number, label: string }[]>([]);
    const [selectedTest, setSelectedTest] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [testName, setTestName] = useState("");
    const [additionalCharges, setAdditionalCharges] = useState(0);
    const [gstTaxAdditional, setGstTaxAdditional] = useState(0);
    const [description, setDescription] = useState("");
    const [totalBillingAmount, setTotalBillingAmount] = useState(0);
    const [subTotalCharges , setSubTotalCharges] = useState(0);
    const [totalAdditionalCharges, setTotalAdditionalCharges] = useState(0);
    const [additionalChargeTable, setAdditionalChargeTable] = useState<{ id: number; additionalCharges: string; gst: number; description: string; subtTotalCharges : number }[]>([]);

    const demoData = [
        {
            id: 1,
            patientName: "Shital Konduskar",
            mobileNum: 1234567898,
            age: 25,
            address: "27A sector , Pradhikaran-Akurdi , pune"
        }
    ]

    const handleTestTable = (test: any) => {
        if (test === null) {
            // Clear the selected modality and filtered data when the input is cleared
            // setSelectedTest('');
            return;
        }
        // const items = test.label;
        const item = testData.find((option) => option.protocol === test.label);
        if (!item) {
            console.log("Item not found...")
            return;
        }
        setTestTableData((prevData) => {
            const newId = prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 1;
            const newName = item.protocol;
            const newPrice = item.price;
            const aggregateDueVal = Number(item.price);
            return [...prevData, { id: newId, name: newName, price: newPrice, aggregateDue: aggregateDueVal }]
        }
        );
        // setSelectedTest(test.name);
        // setSubTotalPrice((prevTotal) => prevTotal + Number(item.price));
        // setTotalBill(subTotalPrice + subTotalAmount + totalTax);
    }

    const deleteTest = (deletedData: any) => {
        const gst = deletedData.gst * deletedData.price / 100
        setTestTableData((data) => data.filter((item) => item.id !== deletedData.id))
        setSubTotalPrice((prevTotal) => prevTotal - deletedData.price - gst);
    }

    const handleModality = (selectmodality: any) => {

        if (selectmodality === null) {
            // Clear the selected modality and filtered data when the input is cleared
            //   setModality('');
            //   setFilteredModality(testData)
            return;
        }
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
        setUniqueBodyParts(uniqueBodyParts);
    }

    const handleBodyParts = (body_parts: any) => {
        if (body_parts === null) {
            // Clear the selected modality and filtered data when the input is cleared
            setBodyParts('');
            // setFilteredBodyParts(testData)
            return;
        }
        setBodyParts(body_parts.label);
        const body_part = testData.filter((test) =>
            test.body_part.toLowerCase().includes(body_parts.label.toLowerCase())
        )
        setSelectedTest(body_part);
    };

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    const uniqueModalities = useMemo(() => {
        console.time("modalities");
        const result = getUniqueOptions(jsonData, "modality");
        console.timeEnd("modalities");
        return result;
      }, [jsonData]);
      
      const uniqueBodyPart = useMemo(() => {
        console.time("bodyParts");
        const result = getUniqueOptions(jsonData, "body_part");
        console.timeEnd("bodyParts");
        return result;
      }, [jsonData]);

    useEffect(() => {
        // setTestData(jsonData);
        // setFilteredModality(jsonData)

        //unique modality
        setTestData(jsonData);
        // const uniqueModalities = jsonData
        //     .filter((item, index, self) =>
        //         index === self.findIndex((t) => t.modality === item.modality)
        //     )
        //     .map((item, index) => ({
        //         id: index,
        //         label: item.modality,
        //     }));
        setUniqueModality(uniqueModalities)

        // Body Parts
        // const uniquebodyparts = jsonData
        //     .filter((item, index, self) =>
        //         index === self.findIndex((t) => t.body_part === item.body_part)
        //     )
        //     .map((item, index) => ({
        //         id: index,
        //         label: item.body_part,
        //     }));
        setUniqueBodyParts(uniqueBodyPart)

        //Tests 
        setSelectedTest(jsonData);
    }, [jsonData, uniqueModalities, uniqueBodyPart])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const proceedToBill = () => {
        setTabValue(1);
        setTotalBillingAmount((prev) => prev + additionalCharges);
        setBalanceRemaining((prev) => prev + additionalCharges);
    }

    const handleConsessionChange = (id: number, e: any) => {
        const value = e.target.value;

        setTestTableData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, consession: Number(value), aggregateDue: (item.price - (item.price * Number(value) / 100)) } : item // Update only the matching row
            )
        );
    };

    const handleGstChange = (id: number, e: any) => {

    }

    const handleCommentChange = (id: number, event: any) => {
        const updatedData = testTableData.map((item) =>
            item.id === id ? { ...item, comment: event.target.value } : item
        );
        setTestTableData(updatedData);
    };

    const handleAdditionalCharges = (e: any) => {
        const charges = Number(e.target.value);
        setAdditionalCharges(charges);
    }

    const addChargesToTable = () => {
        const total = additionalCharges + (additionalCharges * gstTaxAdditional / 100)
        setSubTotalCharges(total);
        setAdditionalChargeTable((prev) => {
            const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1
            const newEntry = {
                id: nextId,
                additionalCharges: additionalCharges,
                gst: gstTaxAdditional,
                description: description,
                subtTotalCharges : total
            };
            return [...prev, newEntry]
        })

        setTotalAdditionalCharges((prev) => prev + total);
        clearCharges();
    }

    const clearCharges = () => {
        setAdditionalCharges(0);
        setDescription("");
        setGstTaxAdditional(0);
    }

    const deleteCharges = (data: any) => {
        const total = additionalCharges - (additionalCharges * gstTaxAdditional / 100)
        setTotalAdditionalCharges((prev) => prev - Number(data.subtTotalCharges));
        setAdditionalChargeTable((items) => items.filter((item) => item.id !== data.id))
    }

    useEffect(() => {
        const newTotal = testTableData.reduce(
            (sum, item) => sum + item.aggregateDue,
            0
        );
        setSubTotalPrice(newTotal);
        // setTotalBill(newTotal + subTotalAmount + totalTax);
        setTotalBillingAmount(newTotal + totalAdditionalCharges);
        setBalanceRemaining(newTotal + totalAdditionalCharges);
    }, [testTableData]);

    useEffect(() => {
        setBalanceRemaining((prev) => prev - amountPaid);
    }, [amountPaid])

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, testName: string) => {
        setAnchorEl(event.currentTarget);
        setTestName(testName);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);


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
                        <CustomInput id="search"
                            placeholder='Search Patient'
                            size='small'
                            color='primary'
                            startIcon={<Search />}
                            className='w-full md:w-2/4' />
                    </div>

                    <Divider className='my-6 '>
                    </Divider>

                    <Paper className='w-full py-6 md:px-8'>
                        {/* Basic Information */}
                        <div className='w-2/3 md:w-1/3'>
                            <Typography className='text-sm font-semibold mb-3'> {demoData[0].patientName} </Typography>
                            <Typography className='text-sm mb-3' >Age :  {demoData[0].age} </Typography>
                            <Typography className='text-sm mb-3' > {demoData[0].address} </Typography>
                            <Typography className='text-sm mb-3'> mobile : <span className='font-bold'> {demoData[0].mobileNum} </span> </Typography>
                        </div>

                        {/* Refrred Doctor */}
                        <div className='flex flex-wrap gap-4  w-full md:w-2/3'>
                            <Typography className='text-sm font-semibold mt-4' color='textDisabled'>Please fill Bill information here. </Typography>
                            <div className='flex flex-wrap gap-4 w-full'>
                                <FormControl size="small" className='w-11/12'>
                                    <Select
                                        labelId="referred_doctor"
                                        id="referred_doctor"
                                        value={referredDoctor ?? ""}
                                        // label="Referred Doctor"
                                        onChange={(e) => setReferredDoctor(e.target.value)}

                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (selected === "") {
                                                return "Referred Doctor";
                                            }
                                            return selected;
                                        }}
                                    >
                                        {
                                            selectReferreing.map((data, index) =>
                                                <MenuItem value={data} key={index}>
                                                    {data}
                                                </MenuItem>
                                            )
                                        }

                                    </Select>
                                </FormControl>

                                {/* Add new referring Physician */}
                                <Link href="/referraldashboard">
                                    <Tooltip title="Add Referreing Physician" placement="right" arrow>
                                        <IconButton aria-label="Add" color='primary'>
                                            <AddCircle />
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </div>

                            {/* Tests & Price */}
                            {/* Select Modality  */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-modality"
                                // Map testData to include an id (using index if no unique id exists)
                                options={uniqueModality.map((t, index) => ({ id: index, label: t.label }))}
                                onChange={(e, newValue) => handleModality(newValue)}
                                size="small"
                                className="w-full md:w-[45%]"
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                renderOption={(props, option, { index }) => (
                                    <li {...props} key={`${option.label}-${index}`}>
                                        {option.label}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select Modality" variant="outlined" />
                                )}
                            />

                            {/* Select Body Parts  */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                // Map testData to include an id (using index if no unique id exists)
                                options={uniqueBodyParts.map((t, index) => ({ id: index, label: t.label }))}
                                onChange={(e, newValue) => handleBodyParts(newValue)}
                                size="small"
                                className="w-full md:w-[45%]"
                                getOptionLabel={(option) => option.label}
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

                            {/* Select Tests  */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-test"
                                // Map testData to include an id (using index if no unique id exists)
                                options={selectedTest.map((t, index) => ({ id: index, label: t.protocol }))}
                                onChange={(e, newValue) => handleTestTable(newValue)}
                                size="small"
                                className="w-11/12"
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                renderOption={(props, option, { index }) => (
                                    <li {...props} key={`${option.label}-${index}`}>
                                        {option.label}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select Tests" variant="outlined" />
                                )}
                            />

                            <Alert severity="info" className='w-11/12'>You can give upto 10% of consession for {testName || "this Test"}.</Alert>

                        </div>

                        {/* Alert for tests discount or consession */}
                        <Popover
                            id="mouse-over-popover"
                            sx={{ pointerEvents: 'none' }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <Alert severity="info">You can give upto 10% of consession for {testName || "this Test"}.</Alert>
                        </Popover>

                        {/* Tests and price tabe */}
                        <TableContainer className='mt-5' >
                            <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className=" font-semibold">Tests</TableCell>
                                        <TableCell  className="font-semibold">Price (<CurrencyRupee fontSize='small' />) </TableCell>
                                        <TableCell  className="font-semibold">Consession</TableCell>
                                        <TableCell  className="font-semibold">GST(%)</TableCell>
                                        <TableCell  className="font-semibold">Comment</TableCell>
                                        <TableCell  className="font-semibold">Aggregate Due</TableCell>
                                        <TableCell className="font-semibold"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {testTableData.map((data, index) => (
                                        <TableRow key={data.id}>
                                            <TableCell className='py-0'>{data.name}</TableCell>
                                            <TableCell align="right" className='py-0'
                                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                                aria-haspopup="true"
                                                onMouseEnter={(e) => handlePopoverOpen(e, data.name)}
                                                onMouseLeave={handlePopoverClose}
                                            >{data.price}</TableCell>
                                            <TableCell align="center" className='py-0'>
                                                <TextField
                                                    id={`consession-${data.id}`}
                                                    label="Consession%"
                                                    variant="standard"
                                                    type="number"
                                                    size="small"
                                                    color="primary"
                                                    autoComplete="off"
                                                    value={data.consession || ""}
                                                    InputLabelProps={{
                                                        style: { fontSize: '0.75rem' }, // adjust font size here
                                                    }}
                                                    onChange={(e) => handleConsessionChange(data.id, e)}
                                                />
                                            </TableCell>
                                            <TableCell align="center" className='py-0'>
                                                <TextField
                                                    id={`gst-${data.id}`}
                                                    label="GST%"
                                                    variant="standard"
                                                    type="number"
                                                    size="small"
                                                    color="primary"
                                                    autoComplete="off"
                                                    value={data.gst || ""}
                                                    InputLabelProps={{
                                                        style: { fontSize: '0.75rem' }, // adjust font size here
                                                    }}
                                                    onChange={(e) => handleGstChange(data.id, e)}
                                                />
                                            </TableCell>
                                            <TableCell align="center" className='py-0'>
                                                <TextField
                                                    id={`comment-${data.id}`}
                                                    label="Comment"
                                                    variant="standard"
                                                    type="text"
                                                    size="small"
                                                    color="primary"
                                                    autoComplete="off"
                                                    value={data.comment || ""}
                                                    inputProps={{
                                                        className: "text-sm", // Tailwind class for input text size
                                                    }}
                                                    FormHelperTextProps={{
                                                        className: "text-xs", // optional: for helper text
                                                    }}
                                                    className=" [&_label]:text-xs"
                                                    onChange={(e) => handleCommentChange(data.id, e)}
                                                />
                                            </TableCell>
                                            <TableCell  className='py-0'>{data.aggregateDue}</TableCell>
                                            <TableCell className='py-0'>
                                                <IconButton aria-label="delete" onClick={() => deleteTest(data)}>
                                                    <DeleteOutline color='error' />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={5} className='font-bold' align='right'>Total</TableCell>
                                        <TableCell  className='font-bold'>{ccyFormat(subTotalPrice)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Additional charges */}
                    <Paper className='w-full mt-5 py-6 md:px-8'>
                        <div className='flex flex-wrap gap-4  w-full md:w-2/3'>
                            <TextField
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
                            />

                            {/*  Tax Or GST */}
                            <FormControl size="small" className='w-full md:w-[45%]'>
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
                            </FormControl>

                            {/* Description */}
                            <TextField id="descriptionAdditinalCharges" label="Description" variant="outlined"
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
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {patientName} </Typography>
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