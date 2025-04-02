"use client"
import { Alert, Autocomplete, Box, Button, Card, Chip, Container, FormControlLabel, IconButton, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Paper, Radio, RadioGroup, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import jsonData from '../../data/testsData.json';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PaymentIcon from '@mui/icons-material/Payment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentMode from './PaymentMode';
import MoneyIcon from '@mui/icons-material/Money';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';


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

const calculateAge = (birthDate: Dayjs | null): number | null => {
    if (!birthDate) return null;

    const today = dayjs();
    let age = today.year() - birthDate.year();

    if (today.month() < birthDate.month() ||
        (today.month() === birthDate.month() && today.date() < birthDate.date())) {
        age--;
    }

    return age;
};


const RegisterPatientForm = () => {
    const [isNewReferrer, setIsNewReferrer] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [referredDoctor, setReferredDoctor] = useState('');
    const [selectReferreing, setSelectReferreing] = useState<string[]>([]);
    const [referrerName, setReferrerName] = useState("");
    const [referrerEmail, setReferrerEmail] = useState("");
    const [referrerDegree, setReferrerDegree] = useState("");
    const [referrerAddress, setReferrerAddress] = useState("");
    const [referrerMobNumber, setReferrerMobNumber] = useState("");
    const [selectedTest, setSelectedTest] = useState("");
    const [modality, setModality] = useState("");
    const [bodyParts, setBodyParts] = useState("");
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [testTableData, setTestTableData] = useState<{ id: number; name: string; price: number; consession: number }[]>([]);
    const [testData, setTestData] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [filteredModality, setFilteredModality] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [filteredBodyParts, setFilteredBodyParts] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [referrerAlertOpen, setReferrerAlertOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [transactionType, setTransactionType] = useState("");
    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState("");
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [tax, setTax] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalBill, setTotalBill] = useState(0);
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [mobNum, setMobNum] = useState("");
    const [defaultComment, setDefaultComment] = useState("");
    const [isEditableComment, setIsEditableComment] = useState(false);
    const [consessionInTest, setConsessionInTest] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [transactionTableData, setTransactionTableData] = useState<{ id: number; transactionType: string; tax: number; amount: number; comment: string; }[]>([]);
    const [selectPaymentMode , setSelectPaymentMode] = useState("");

    const tynsactionTypes = [
        {
            id: 1,
            type: "Debit"
        },
        {
            id: 2,
            type: "Credit"
        },
    ]

    const paymentMode =[
        {
            id: 1,
            PaymentMode:"Payment Mode(Default: Cash)",
            icon: <MoneyIcon />,
        },
        {
            id: 2,
            PaymentMode:"UPI (Pay via any app)",
            icon: <QrCodeScannerIcon />,
        },
        {
            id: 3,
            PaymentMode:"Credit/Debit card",
            icon: <PaymentIcon />
        },
        {
            id: 4,
            PaymentMode:"NET BANKING",
             icon: <AccountBalanceIcon />
        },
        {
            id: 5,
            PaymentMode:"CHEQUE",
            icon: <LocalAtmIcon />
        }
    ]

    const handleTestTable = (test: any) => {
        if (test === null) {
            // Clear the selected modality and filtered data when the input is cleared
            setSelectedTest('');
            return;
        }
        console.log("name is...", test);
        // const items = test.label;
        const item = testData.find((option) => option.protocol === test.label);
        console.log("item is...", item)
        if (!item) {
            console.log("Item not found...")
            return;
        }
        setTestTableData((prevData) => {
            const newId = prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 1;
            const newName = item.protocol;
            const newPrice = item.price;
            return [...prevData, { id: newId, name: newName, price: newPrice }]
        }
        );
        // setSelectedTest(test.name);
        // setSubTotalPrice((prevTotal) => prevTotal + Number(item.price));
        // setTotalBill(subTotalPrice + subTotalAmount + totalTax);
        // console.log("table data is...", testTableData);
    }

    const deleteTest = (deletedData: any) => {
        console.log("delete data...", deletedData);
        setTestTableData((data) => data.filter((item) => item.id !== deletedData.id))
        // const item = tests.find((option) => option.id === id);
        // if (!item) return;
        setSubTotalPrice((prevTotal) => prevTotal - deletedData.price);
        // setTotalBalance((prevBalance) => prevBalance - item.price);
    }

    const handleModality = (selectmodality: any) => {
        if (selectmodality === null) {
            // Clear the selected modality and filtered data when the input is cleared
            setModality('');
            setFilteredModality(testData)
            return;
        }
        setModality(selectmodality.label)
        console.log("modality...", testData);
        const modalities = testData.filter((test) =>
            test.modality.toLowerCase().includes(selectmodality.label.toLowerCase())
        )
        setFilteredModality(modalities);
        console.log("filtered modality...", modalities);
    }

    const handleBodyParts = (body_parts: any) => {
        if (body_parts === null) {
            // Clear the selected modality and filtered data when the input is cleared
            setBodyParts('');
            setFilteredBodyParts(testData)
            return;
        }
        setBodyParts(body_parts.label);
        console.log("modality...", filteredModality);
        const body_part = filteredModality.filter((test) =>
            test.body_part.toLowerCase().includes(body_parts.label.toLowerCase())
        )
        setFilteredBodyParts(body_part);
        console.log("filtered modality...", filteredBodyParts);
    };


    const handleReferrer = (e: any) => {
        e.preventDefault();
        setIsNewReferrer(true);
    }

    const handleReferrerDoctor = () => {
        console.log('doctor name', referrerName);
        if (referrerName) {
            setSelectReferreing((prevReferrer) => [...prevReferrer, referrerName])
            cancelreferrer();
            setReferrerAlertOpen(true);
        }

    }

    const handleAlertClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setReferrerAlertOpen(false);
    };

    const cancelreferrer = () => {
        setReferrerName("");
        setReferrerEmail("");
        setReferrerDegree("");
        setReferrerAddress("");
        setReferrerMobNumber("");
    }

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    useEffect(() => {
        setTestData(jsonData);
        setFilteredModality(jsonData);
        setFilteredBodyParts(jsonData)
    }, [])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const proceedToPayment = () => {
        console.log("payment proceed");
        setTabValue(2);
    }


    const addTransaction = () => {
        let num: number;
        num = transactionTableData.length > 0 ? transactionTableData[transactionTableData.length - 1].id + 1 : 1;

        const data = {
            id: num,
            transactionType: transactionType,
            amount: amount,
            tax: tax,
            //   paymentOption: paymentOpt,
            comment: comment
        };
        setTransactionTableData(prevData => [...(prevData || []), data]);
        // setSubTotalAmount((prevTotal) => prevTotal + amount);
        // setTotalTax((prevTax) => prevTax + tax);
        // setTotalBill(subTotalPrice + subTotalAmount + totalTax);
    }

    const handleBirthdate = (newDate: Dayjs | null) => {
        setBirthDate(newDate);
        const calcualteAge = calculateAge(birthDate);
        setAge(calcualteAge);
        console.log("age is...", age)
    }

    const handleTransaction = (e: any) => {
        const newType = e.target.value;
        setTransactionType(newType);
        console.log("transaction type...", transactionType);
    }

    const handleDefaultComment = () => {
        console.log("editable")
        if (!isEditableComment) {
            setIsEditableComment(true);
        }
    }

    const proceedToBill = () => {
        setTabValue(1);
    }

    const handleConsessionChange = (id: number, e: any) => {
        console.log("consession is...")
        const value = e.target.value;
        setTestTableData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, consession: Number(value) } : item // Update only the matching row
            )
        );
        console.log("table test consession...", value);
    };

    const handleAmount = (e: any) => {
        let amt = Number(e.target.value);
        if (transactionType == "Credit") {
            amt = -amt
            console.log("amt is...", amt)
        }
        else {
            amt = amt
        }
        setAmount(amt);
    }

    useEffect(() => {
        const newTotal = testTableData.reduce(
            (sum, item) => sum + (item.price - (item.consession || 0)),
            0
        );
        setSubTotalPrice(newTotal);
        setTotalBill(newTotal + subTotalAmount + totalTax);
        setBalanceRemaining(newTotal + subTotalAmount + totalTax);
    }, [testTableData]);

    // useEffect(() => {
    //     transactionType === "Credit" ? setComment("Discount") : setComment("Add Charges");
    // }, [transactionType]);

    useEffect(() => {
        setSubTotalAmount((prevTotal) => prevTotal + amount);
        setTotalTax((prevTax) => prevTax + tax);
        setTotalBill((prevBill) => {
            const newBill = subTotalPrice + (subTotalAmount + amount) + (totalTax + tax);
            return newBill;
        });
        setBalanceRemaining(() => {
            const newBill = subTotalPrice + (subTotalAmount + amount) + (totalTax + tax);
            return newBill;
        });
    }, [transactionTableData])

    useEffect(() => {
        const balance = totalBill - amountPaid;
        setBalanceRemaining(balance);
    }, [amountPaid])

    return (
        <>
            <Container className='pb-6 px-4'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Register and payment mode"
                        textColor="primary"
                        indicatorColor="primary" >
                        <Tab label="Patient Register" {...a11yProps(0)} icon={<HowToRegIcon />} iconPosition="start" />
                        <Tab label="Billing Details" {...a11yProps(1)} icon={<PaymentIcon />} iconPosition="start" />
                        <Tab label="Payment Mode"  {...a11yProps(1)} icon={<CurrencyRupeeIcon />} iconPosition="start" disabled />
                    </Tabs>
                </Box>

                {/* Patient Information pannel */}
                <CustomTabPanel value={tabValue} index={0}>
                    {/* <Grid container> */}
                    {/* <Grid size={{ xs: 12, md: 8, lg: 4 }} > */}
                    <div className='flex grid-cols-3 gap-4' >
                        <TextField
                            id="search"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            variant="outlined"
                            placeholder='Search Patient'
                            size='small'
                            color='primary'
                            className='w-full md:w-2/4'
                        />
                    </div>
                    {/* </Grid> */}
                    {/* </Grid> */}
                    <Divider className='my-6 ' textAlign='left'>
                        <Chip label="Basic Information" color="primary" variant="outlined" size='small' />
                    </Divider>

                    {/* Basic Information */}
                    {/* <Grid container columnSpacing={{ xs: 2, lg: 3 }} rowSpacing={2} > */}
                    <div className='flex flex-wrap gap-5'>
                        {/* Name */}
                        <TextField id="name" label="Name*" variant="outlined"
                            size='small' color='primary' autoComplete="off" className='w-full md:w-4/12'
                            onChange={(e) => setPatientName(e.target.value)}
                        />

                        {/* Birth Date */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoItem>
                                <DatePicker
                                    label="Birth Date"
                                    slotProps={{
                                        textField: {
                                            size: 'small', // or 'medium'
                                        },
                                    }}
                                    value={birthDate}
                                    onChange={(newDate) => handleBirthdate(newDate)}
                                    className='w-full'
                                />
                            </DemoItem>

                        </LocalizationProvider>

                        {/* Age */}
                        <TextField id="age" label="Age" variant="outlined"
                            size='small' color='primary' autoComplete="off" className='w-2/4 md:w-1/12'
                            value={age !== null && age !== undefined ? age : ""}
                        />

                        {/* Gender */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio size='small' />} label="Female" />
                            <FormControlLabel value="male" control={<Radio size='small' />} label="Male" />
                            <FormControlLabel value="other" control={<Radio size='small' />} label="Other" />
                        </RadioGroup>

                        {/* Address */}
                        <TextField id="address" label="Address" variant="outlined"
                            size='small' color='primary' autoComplete="off" className='w-full md:w-4/12'
                        />
                        {/* Mobile number */}
                        <TextField id="mobile" label="Mobile Number" variant="outlined"
                            size='small' color='primary' autoComplete="off" className='w-full md:w-3/12'
                        />
                    </div>
                    {/* </Grid> */}

                    <Divider className='my-6 ' textAlign='left'>
                        <Chip label="Referred Doctor" color="primary" variant="outlined" size='small' />
                    </Divider>

                    {/* Refrred Doctor */}
                    {/* <Grid container columnSpacing={{ xs: 2, lg: 5 }} rowSpacing={2} className="mb-4"> */}
                    <div className='flex flex-wrap gap-5'>
                        <Select
                            labelId="referred_doctor"
                            id="referred_doctor"
                            value={referredDoctor}
                            label="Referred Doctor"
                            onChange={(e) => setReferredDoctor(e.target.value)}
                            className="w-4/5 md:w-1/3 mb-5"
                            size="small"
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
                            {/* <MenuItem value="">
                            <em>Referred Doctor</em>
                        </MenuItem> */}

                        </Select>
                        <Tooltip title="Add Referreing Physician" placement="right" arrow>
                            <IconButton aria-label="Add" color='primary' onClick={handleReferrer} className='pb-6'>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    {/* </Grid> */}
                    {
                        isNewReferrer ?
                            (
                                // <Grid container columnSpacing={{ xs: 2, lg: 5 }} rowSpacing={2} >
                                <div className='flex flex-wrap gap-5'>
                                    {/* Doctor's Name */}
                                    <TextField id="doctor_name" label="Doctor's Name" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-4/12'
                                        name='referrerName' required
                                        value={referrerName}
                                        onChange={(e) => setReferrerName(e.target.value)}
                                    />
                                    {/* Email address */}
                                    <TextField id="doctor_email" label="Email Address" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-3/12'
                                        name='referrerEmail' value={referrerEmail}
                                        onChange={(e) => setReferrerEmail(e.target.value)}
                                    />
                                    {/* Medical Degree */}
                                    <TextField id="medical_degree" label="Medical Degree" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-3/12'
                                        name='referrerEducation' value={referrerDegree} onChange={(e) => setReferrerDegree(e.target.value)}
                                    />

                                    {/* Communication address */}
                                    <TextField id="doctor_address" label="Communication address" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-4/12'
                                        name='referrerAddress' value={referrerAddress} onChange={(e) => setReferrerAddress(e.target.value)}
                                    />
                                    {/* Communication Mobile Number */}
                                    <TextField id="doctor_mobile" label="Mobile Number" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-3/12'
                                        name='referrermobileNumber' value={referrerMobNumber} onChange={(e) => setReferrerMobNumber(e.target.value)}
                                    />

                                    {/* <Grid size={12} > */}
                                    <div className='flex w-full'>
                                        <Button variant="outlined" color="success" className='mr-8'
                                            startIcon={<SaveIcon />} onClick={handleReferrerDoctor}  >
                                            Save
                                        </Button>
                                        <Button variant="outlined" color="error" startIcon={<CancelIcon />}
                                            onClick={cancelreferrer} >
                                            Cancel
                                        </Button>
                                    </div>
                                    {/* </Grid> */}
                                </div>
                                // </Grid>

                            ) :
                            (
                                null
                            )
                    }

                    <Snackbar open={referrerAlertOpen} autoHideDuration={3000}
                        onClose={handleAlertClose}
                        message="Data add to Referrer dropdown!"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                    </Snackbar>

                    <Divider className='my-6 ' textAlign='left'>
                        <Chip label="Tests & Price" color="primary" variant="outlined" size='small' />
                    </Divider>

                    {/* Tests & Price */}
                    {/* <Grid container columnSpacing={{ xs: 2, lg: 5 }} rowSpacing={2}> */}
                    <div className='flex flex-wrap gap-5'>
                        {/* Select Modality  */}
                        <Autocomplete
                            disablePortal
                            id="combo-box-modality"
                            // Map testData to include an id (using index if no unique id exists)
                            options={testData.map((t, index) => ({ id: index, label: t.modality }))}
                            onChange={(e, newValue) => handleModality(newValue)}
                            size="small"
                            className="w-full md:w-1/3"
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
                            options={filteredModality.map((t, index) => ({ id: index, label: t.body_part }))}
                            onChange={(e, newValue) => handleBodyParts(newValue)}
                            size="small"
                            className="w-full md:w-1/3"
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
                            options={filteredBodyParts.map((t, index) => ({ id: index, label: t.protocol }))}
                            onChange={(e, newValue) => handleTestTable(newValue)}
                            size="small"
                            className="w-full md:w-2/3"
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

                        {/* Tests and price tabe */}
                        <TableContainer className='mt-5 shadow-lg' component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className=" font-bold">Tests</TableCell>
                                        <TableCell align="right" className="font-bold">Price</TableCell>
                                        <TableCell align="center" className="font-bold">Consession</TableCell>
                                        <TableCell className="font-bold"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {testTableData.map((data, index) => (
                                        <TableRow key={data.id}>
                                            <TableCell className='py-0'>{data.name}</TableCell>
                                            <TableCell align="right" className='py-0'>{data.price}</TableCell>
                                            <TableCell align="center" className='py-0'>
                                                <TextField
                                                    id={`consession-${data.id}`}
                                                    label="Consession"
                                                    variant="standard"
                                                    type="number"
                                                    size="small"
                                                    color="primary"
                                                    autoComplete="off"
                                                    value={data.consession || ""}
                                                    onChange={(e) => handleConsessionChange(data.id, e)}
                                                />
                                            </TableCell>
                                            <TableCell align="right" className='py-0'>
                                                <IconButton aria-label="delete" onClick={() => deleteTest(data)}>
                                                    <DeleteOutlineIcon color='error' />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} className='font-bold' align='right'>Total</TableCell>
                                        <TableCell align="right" className='font-bold'>{ccyFormat(subTotalPrice)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Proceed to Billing details */}
                        <div className='mt-6'>
                            <Button variant="contained" onClick={proceedToBill}>Proceed To Bill</Button>
                        </div>
                    </div>
                    {/* </Grid> */}
                </CustomTabPanel>

                {/* Billing Deatils custom pannel */}
                <CustomTabPanel value={tabValue} index={1}>
                    {/* Patient details for reference */}
                    <div className='flex'>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {patientName} </Typography>
                    </div>

                    {/* <div className='mb-4 w-1/2'>
                    <Input placeholder='name' />
                    </div> */}

                    <div className='flex flex-wrap gap-5'>
                        {/* Transaction Type  */}
                        <Select
                            labelId="transaction_type"
                            id="transaction_type"
                            value={transactionType}
                            label="Transaction Type"
                            // onChange={(e) => setTransactionType(e.target.value)}
                            onChange={(e) => handleTransaction(e)}
                            className="w-1/3"
                            size="small"
                            displayEmpty
                            renderValue={(selected) => {
                                if (selected === "") {
                                    return "Transaction Type";
                                }
                                return selected;
                            }}
                        >
                            {
                                tynsactionTypes.map((data, index) =>
                                    <MenuItem value={data.type} key={index}>
                                        {data.type}
                                    </MenuItem>
                                )
                            }

                        </Select>

                        {/* Comment Add charges or Discount */}
                        <Select
                            labelId="default_comment"
                            id="default_comment"
                            value={defaultComment}
                            label="Comments"
                            onChange={(e) => setDefaultComment(e.target.value)}
                            // onChange={handleTransaction}
                            className="w-1/3"
                            size="small"
                            displayEmpty
                            renderValue={(selected) => {
                                if (selected === "") {
                                    return "Comments";
                                }
                                return selected;
                            }}
                        >
                            {
                                transactionType == "Credit" ? (
                                    <MenuItem value="discount">
                                        Discount
                                    </MenuItem>
                                ) :
                                    (
                                        <MenuItem value="addcharges" >
                                            Add Charges
                                        </MenuItem>
                                    )
                            }
                            <MenuItem value="other">
                                Other
                            </MenuItem>

                        </Select>

                        {/* Amount */}
                        <TextField id="amount" label="Amount" variant="outlined"
                            size='small' autoComplete="off" className='w-4/12' onChange={(e) => handleAmount(e)}
                        />

                        {/* Comments */}
                        <TextField id="comments" label="Comments" variant="outlined" value={comment}
                            size='small' autoComplete="off" className='w-8/12'
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Reason for ${defaultComment}`}
                            onClick={handleDefaultComment}
                        // onFocus={handleDefaultComment}

                        />

                        {/* Add Transaction to table */}
                        <Tooltip title="Add Transaction to table" placement="top" arrow>
                            <IconButton aria-label="Add" color='primary' onClick={addTransaction}>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    {/* </Grid> */}

                    {/* Payment Details */}
                    <TableContainer className='mt-5 shadow-lg' component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className=" font-bold border">Transactions</TableCell>
                                    <TableCell align="center" className="font-bold border">Rate</TableCell>
                                    <TableCell align="center" className="font-bold border">Tax & GST</TableCell>
                                    <TableCell align="center" className="font-bold">Comments</TableCell>
                                    {/* <TableCell className="font-bold"></TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactionTableData.map((data, index) => (
                                    <TableRow key={data.id}>
                                        <TableCell >{data.transactionType}</TableCell>
                                        <TableCell align="center" >{data.amount}</TableCell>
                                        <TableCell align="center" >{data.tax}</TableCell>
                                        <TableCell align="center">{data.comment}</TableCell>
                                    </TableRow>
                                ))}

                                <TableRow className=''>
                                    <TableCell colSpan={3} align='right' className='border-none'>Test Charges</TableCell>
                                    <TableCell align="right">{ccyFormat(subTotalPrice)}</TableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell colSpan={3} align='right' className='border-none'>SubTotal</TableCell>
                                    <TableCell align="right">{ccyFormat(subTotalAmount)}</TableCell>
                                </TableRow> */}
                                <TableRow>
                                    <TableCell colSpan={3} align='right' className='border-none'>Tax</TableCell>
                                    <TableCell align="right">{ccyFormat(totalTax)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} align='right' className='border-none font-semibold'>Total</TableCell>
                                    <TableCell align="right">{ccyFormat(totalBill)}</TableCell>
                                </TableRow>
                                {/* Invoice Payment */}
                                <TableRow>
                                    <TableCell align='right' colSpan={2} className='border-none font-semibold'>Amount Paid : </TableCell>
                                    <TableCell >
                                        <div className='w-full'>
                                            <TextField id="invoicePayment" label="Payment" variant="outlined"
                                                size='small' color='primary' autoComplete="off" className='w-11/12'
                                                value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell >
                                        <div className='w-full'>
                                            <TextField id="invoicePayment" label="Comment" variant="outlined"
                                                size='small' color='primary' autoComplete="off" className='w-11/12'
                                            />
                                        </div>
                                    </TableCell>

                                </TableRow>
                                {/* Payment Mode */}
                                <TableRow>
                                    <TableCell colSpan={4} align='right'>
                                        <Select
                                            labelId="payment_mode"
                                            id="payment_mode"
                                            value={selectPaymentMode}
                                            label=" Payment Mode"
                                            onChange={(e) => setSelectPaymentMode(e.target.value)}
                                            className="w-4/5 md:w-1/3 mb-5"
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
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider className='mt-5' />
                    <div className='mt-6 flex justify-end gap-x-10 w-full'>
                        <Typography color='textDisabled' className='mt-3'> Balance Remaining : <CurrencyRupeeIcon fontSize='small' /> {ccyFormat(balanceRemaining)} </Typography>
                        <Button variant="contained" onClick={proceedToPayment}>Confirm & Proceed</Button>
                    </div>
                </CustomTabPanel>

                {/* Billing Deatils custom pannel */}
                <CustomTabPanel value={tabValue} index={2}>
                    {/* Patient details for reference */}
                    <div className='flex gap-14'>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {patientName} </Typography>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Total Bill : {totalBill} </Typography>
                    </div>

                    <div>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Choose Payment Mode </Typography>
                    </div>
                    <PaymentMode />
                </CustomTabPanel>

            </Container>
        </>
    )
}

export default RegisterPatientForm