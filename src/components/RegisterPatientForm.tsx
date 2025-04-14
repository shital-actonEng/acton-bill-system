"use client"
import { Alert, Autocomplete, Box, Button, Card, Chip, Container, FormControlLabel, IconButton, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Paper, Popover, Radio, RadioGroup, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography } from '@mui/material'
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
import CustomInput from './ui/CustomInput';
import Link from 'next/link';
import AddCommentIcon from '@mui/icons-material/AddComment';



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
    const [patientName, setPatientName] = useState('');
    const [referredDoctor, setReferredDoctor] = useState('');
    const [selectReferreing, setSelectReferreing] = useState<string[]>([]);
    const [referrerName, setReferrerName] = useState("");
    const [modality, setModality] = useState("");
    const [bodyParts, setBodyParts] = useState("");
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [testTableData, setTestTableData] = useState<{ id: number; name: string; price: number; consession: number; gst: number; comment: string; aggregateDue: number }[]>([]);
    const [testData, setTestData] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    //    const [filteredModality, setFilteredModality] = useState<{ id: number, label: string }[]>([]);
    // const [filteredBodyParts, setFilteredBodyParts] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
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
    // const [mobNum, setMobNum] = useState("");
    const [defaultComment, setDefaultComment] = useState("");
    const [isEditableComment, setIsEditableComment] = useState(false);
    const [consessionInTest, setConsessionInTest] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [transactionTableData, setTransactionTableData] = useState<{ id: number; transactionType: string; tax: number; amount: number; comment: string; }[]>([]);
    const [selectPaymentMode, setSelectPaymentMode] = useState("");
    const [uniqueModality, setUniqueModality] = useState<{ id: number, label: string }[]>([]);
    const [uniqueBodyParts, setUniqueBodyParts] = useState<{ id: number, label: string }[]>([]);
    const [selectedTest, setSelectedTest] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [testName, setTestName] = useState("");
    const [additionalCharges, setAdditionalCharges] = useState(0);
    const [gstTaxAdditional , setGstTaxAdditional] = useState(0);
    const [description , setDescription] = useState("");
    const [totalBillingAmount, setTotalBillingAmount] = useState(0);
    const [totalAdditionalCharges , setTotalAdditionalCharges] = useState(0);
    const [additionalChargeTable, setAdditionalChargeTable] = useState<{ id: number; additionalCharges: string; gst: number; description: string; }[]>([]);


    // const tynsactionTypes = [
    //     {
    //         id: 1,
    //         type: "Debit"
    //     },
    //     {
    //         id: 2,
    //         type: "Credit"
    //     },
    // ]

    const demoData = [
        {
            id: 1,
            patientName: "Shital Konduskar",
            mobileNum: 1234567898,
            age: 25,
            address: "27A sector , Pradhikaran-Akurdi , pune"
        }
    ]

    const paymentMode = [
        {
            id: 1,
            PaymentMode: "Payment Mode(Default: Cash)",
            icon: <MoneyIcon />,
        },
        {
            id: 2,
            PaymentMode: "UPI (Pay via any app)",
            icon: <QrCodeScannerIcon />,
        },
        {
            id: 3,
            PaymentMode: "Credit/Debit card",
            icon: <PaymentIcon />
        },
        {
            id: 4,
            PaymentMode: "NET BANKING",
            icon: <AccountBalanceIcon />
        },
        {
            id: 5,
            PaymentMode: "CHEQUE",
            icon: <LocalAtmIcon />
        }
    ]

    const handleTestTable = (test: any) => {
        if (test === null) {
            // Clear the selected modality and filtered data when the input is cleared
            // setSelectedTest('');
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
            const aggregateDueVal = Number(item.price);
            return [...prevData, { id: newId, name: newName, price: newPrice, aggregateDue: aggregateDueVal }]
        }
        );
        // setSelectedTest(test.name);
        // setSubTotalPrice((prevTotal) => prevTotal + Number(item.price));
        // setTotalBill(subTotalPrice + subTotalAmount + totalTax);
        // console.log("table data is...", testTableData);
    }

    const deleteTest = (deletedData: any) => {
        console.log("delete data...", deletedData);
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
        // console.log("modality...", filteredModality);
        const body_part = testData.filter((test) =>
            test.body_part.toLowerCase().includes(body_parts.label.toLowerCase())
        )
        setSelectedTest(body_part);
        // console.log("filtered modality...", filteredBodyParts);
    };


    // const handleReferrer = (e: any) => {
    //     e.preventDefault();
    //     setIsNewReferrer(true);
    // }

    // const handleReferrerDoctor = () => {
    //     console.log('doctor name', referrerName);
    //     if (referrerName) {
    //         setSelectReferreing((prevReferrer) => [...prevReferrer, referrerName])
    //         cancelreferrer();
    //         setReferrerAlertOpen(true);
    //     }

    // }

    // const handleAlertClose = (
    //     event?: React.SyntheticEvent | Event,
    //     reason?: SnackbarCloseReason,
    // ) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }

    //     setReferrerAlertOpen(false);
    // };

    // const cancelreferrer = () => {
    //     setReferrerName("");
    //     setReferrerEmail("");
    //     setReferrerDegree("");
    //     setReferrerAddress("");
    //     setReferrerMobNumber("");
    // }

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    useEffect(() => {
        // setTestData(jsonData);
        // setFilteredModality(jsonData)

        //unique modality
        setTestData(jsonData);
        const uniqueModalities = jsonData
            .filter((item, index, self) =>
                index === self.findIndex((t) => t.modality === item.modality)
            )
            .map((item, index) => ({
                id: index,
                label: item.modality,
            }));
        setUniqueModality(uniqueModalities)

        // Body Parts
        const uniquebodyparts = jsonData
            .filter((item, index, self) =>
                index === self.findIndex((t) => t.body_part === item.body_part)
            )
            .map((item, index) => ({
                id: index,
                label: item.body_part,
            }));
        setUniqueBodyParts(uniquebodyparts)

        //Tests 
        setSelectedTest(jsonData);
    }, [])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // const proceedToPayment = () => {
    //     console.log("payment proceed");
    //     setTabValue(2);
    // }


    // const addTransaction = () => {
    //     let num: number;
    //     num = transactionTableData.length > 0 ? transactionTableData[transactionTableData.length - 1].id + 1 : 1;

    //     const data = {
    //         id: num,
    //         transactionType: transactionType,
    //         amount: amount,
    //         tax: tax,
    //         //   paymentOption: paymentOpt,
    //         comment: comment
    //     };
    //     setTransactionTableData(prevData => [...(prevData || []), data]);
    //     // setSubTotalAmount((prevTotal) => prevTotal + amount);
    //     // setTotalTax((prevTax) => prevTax + tax);
    //     // setTotalBill(subTotalPrice + subTotalAmount + totalTax);
    // }

    // const handleBirthdate = (newDate: Dayjs | null) => {
    //     setBirthDate(newDate);
    //     const calcualteAge = calculateAge(birthDate);
    //     setAge(calcualteAge);
    //     console.log("age is...", age)
    // }

    // const handleTransaction = (e: any) => {
    //     const newType = e.target.value;
    //     setTransactionType(newType);
    //     console.log("transaction type...", transactionType);
    // }

    // const handleDefaultComment = () => {
    //     console.log("editable")
    //     if (!isEditableComment) {
    //         setIsEditableComment(true);
    //     }
    // }

    const proceedToBill = () => {
        setTabValue(1);
        console.log("addtional charges in handle addition...", additionalCharges);
        setTotalBillingAmount((prev) => prev + additionalCharges);
        setBalanceRemaining((prev) => prev + additionalCharges);
    }

    const handleConsessionChange = (id: number, e: any) => {
        console.log("consession is...")
        const value = e.target.value;

        setTestTableData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, consession: Number(value), aggregateDue: (item.price - (item.price * Number(value) / 100)) } : item // Update only the matching row
            )
        );
        console.log("table test consession...", value);
    };

    const handleGstChange = (id: number, e: any) => {

    }

    const handleCommentChange = (id: number, event: any) => {
        const updatedData = testTableData.map((item) =>
            item.id === id ? { ...item, comment: event.target.value } : item
        );
        setTestTableData(updatedData);
    };

    // const handleAmount = (e: any) => {
    //     let amt = Number(e.target.value);
    //     if (transactionType == "Credit") {
    //         amt = -amt
    //         console.log("amt is...", amt)
    //     }
    //     else {
    //         amt = amt
    //     }
    //     setAmount(amt);
    // }

    const handleAdditionalCharges = (e: any) => {
        const charges = Number(e.target.value);
        setAdditionalCharges(charges);
    }

    const addChargesToTable = () =>{
        setAdditionalChargeTable((prev)=> {
            const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1
            const newEntry = {
                id: nextId,
                additionalCharges: additionalCharges,
                gst: gstTaxAdditional,
                description: description
              };
            return [...prev , newEntry]
        })

        const total = additionalCharges - (additionalCharges * gstTaxAdditional / 100)
        setTotalAdditionalCharges((prev) => prev + total);
        clearCharges();
    }

    const clearCharges = ()=>{
        setAdditionalCharges(0);
        setDescription("");
        setGstTaxAdditional(0);
    }

    const deleteCharges = (data : any) =>{
        const total = additionalCharges - (additionalCharges * gstTaxAdditional / 100)
        setTotalAdditionalCharges((prev) => prev - total);
       setAdditionalChargeTable((items)=> items.filter((item)=> item.id !== data.id ))
    }

    useEffect(() => {
        // const newTotal = testTableData.reduce(
        //     (sum, item) => sum + (item.price - ((item.price *item.consession) / 100 || 0)),
        //     0
        // );
        const newTotal = testTableData.reduce(
            (sum, item) => sum + item.aggregateDue,
            0
        );
        setSubTotalPrice(newTotal);
        // setTotalBill(newTotal + subTotalAmount + totalTax);
        console.log("addition charges in test table data ", additionalCharges)
        setTotalBillingAmount(newTotal + totalAdditionalCharges);
        setBalanceRemaining(newTotal + totalAdditionalCharges);
    }, [testTableData]);

    // useEffect(() => {
    //     setSubTotalAmount((prevTotal) => prevTotal + amount);
    //     setTotalTax((prevTax) => prevTax + tax);
    //     setTotalBill((prevBill) => {
    //         const newBill = subTotalPrice + (subTotalAmount + amount) + (totalTax + tax);
    //         return newBill;
    //     });
    //     setBalanceRemaining(() => {
    //         const newBill = subTotalPrice + (subTotalAmount + amount) + (totalTax + tax);
    //         return newBill;
    //     });
    // }, [transactionTableData])

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
                        <Tab label="Patient Register" {...a11yProps(0)} icon={<HowToRegIcon />} iconPosition="start" />
                        <Tab label="Billing Details" {...a11yProps(1)} icon={<PaymentIcon />} iconPosition="start" />
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
                            startIcon={<SearchIcon />}
                            className='w-full md:w-2/4' />
                    </div>

                    <Divider className='my-6 '>
                    </Divider>

                    <Paper className='w-full md:w-2/3'>
                        <Container className='py-6 md:px-8'>
                            {/* Basic Information */}
                            {/* <Card className='w-full md:w-1/2 p-8 mb-4'> */}
                            <div className='w-2/3 md:w-1/3'>
                                <Typography className='text-sm font-semibold mb-3'> {demoData[0].patientName} </Typography>
                                <Typography className='text-sm mb-3' >Age :  {demoData[0].age} </Typography>
                                <Typography className='text-sm mb-3' > {demoData[0].address} </Typography>
                                <Typography className='text-sm mb-3'> mobile : <span className='font-bold'> {demoData[0].mobileNum} </span> </Typography>
                            </div>
                            {/* </Card> */}

                            {/* <Divider className='my-6 ' textAlign='left'>
                                <Chip label="Referred Doctor" color="primary" variant="outlined" size='small' />
                            </Divider> */}

                            {/* Refrred Doctor */}
                            {/* <Grid container columnSpacing={{ xs: 2, lg: 5 }} rowSpacing={2} className="mb-4"> */}
                            <div className='flex flex-col gap-4  w-full'>
                                <Typography className='text-sm font-semibold my-5' color='textDisabled'>Please fill Bill information here. </Typography>
                                <div className='flex flex-wrap gap-4'>
                                    <Select
                                        labelId="referred_doctor"
                                        id="referred_doctor"
                                        value={referredDoctor}
                                        label="Referred Doctor"
                                        onChange={(e) => setReferredDoctor(e.target.value)}
                                        className="w-11/12 mb-5"
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

                                    </Select>

                                    {/* Add new referring Physician */}
                                    <Link href="/referraldashboard">
                                        <Tooltip title="Add Referreing Physician" placement="right" arrow>
                                            <IconButton aria-label="Add" color='primary' className='pb-6'>
                                                <AddCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </div>

                                {/* <Divider className='my-6 ' textAlign='left'>
                                <Chip label="Tests & Price" color="primary" variant="outlined" size='small' />
                            </Divider> */}

                                {/* Tests & Price */}
                                {/* Select Modality  */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-modality"
                                    // Map testData to include an id (using index if no unique id exists)
                                    options={uniqueModality.map((t, index) => ({ id: index, label: t.label }))}
                                    onChange={(e, newValue) => handleModality(newValue)}
                                    size="small"
                                    className="w-full"
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
                                    className="w-full"
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
                                    className="w-full"
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

                                <Alert severity="info">You can give upto 10% of consession for {testName || "this Test"}.</Alert>

                                <div className='flex flex-wrap gap-4'>
                                    {/* Consession */}
                                    {/* <TextField id="consession" label="Consession" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-6/12'
                                        name='consession' type='number'
                                        // value={form.price} onChange={handleChange}
                                    /> */}

                                    {/*  GST% */}
                                    {/* <TextField id="gst" label="GST%" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full md:w-5/12'
                                        name='gst' type='number'
                                        // value={form.price} onChange={handleChange}
                                    /> */}
                                </div>
                                {/* Comment */}
                                {/* <TextField id="comment" label="comment" variant="outlined"
                                        size='small' color='primary' autoComplete="off" className='w-full'
                                        name='comment'
                                        // value={form.price} onChange={handleChange}
                                    /> */}
                            </div>
                        </Container>
                    </Paper>

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
                    <TableContainer className='mt-5 shadow-lg' component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className=" font-bold">Tests</TableCell>
                                    <TableCell align="right" className="font-bold">Price</TableCell>
                                    <TableCell align="center" className="font-bold">Consession</TableCell>
                                    <TableCell align="center" className="font-bold">GST%</TableCell>
                                    <TableCell align="center" className="font-bold">Comment</TableCell>
                                    <TableCell align="center" className="font-bold">Aggregate Due</TableCell>
                                    <TableCell className="font-bold"></TableCell>
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
                                        <TableCell align="right" className='py-0'>{data.aggregateDue}</TableCell>
                                        <TableCell align="right" className='py-0'>
                                            <IconButton aria-label="delete" onClick={() => deleteTest(data)}>
                                                <DeleteOutlineIcon color='error' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6} className='font-bold' align='right'>Total</TableCell>
                                    <TableCell align="right" className='font-bold'>{ccyFormat(subTotalPrice)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Additional charges */}
                    <Paper className='w-full md:w-2/3 mt-5'>
                        <Container className='py-6 md:px-8'>
                            <div className='flex flex-wrap gap-4  w-full'>
                                <TextField
                                    id="additionalCharges"
                                    label="Service Add-ons"
                                    size='small'
                                    placeholder='Additional Charges (if any)'
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupeeIcon fontSize='small' />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    variant="outlined"
                                    className='w-full md:w-6/12'
                                    value={additionalCharges}
                                    onChange={handleAdditionalCharges}
                                />

                                <TextField
                                    id="gstTaxAdditional"
                                    name='gstTaxAdditional'
                                    label="GST% or Tax"
                                    size='small'
                                    placeholder='GST% or Tax'
                                    variant="outlined"
                                    className='w-full md:w-5/12'
                                    value={gstTaxAdditional}
                                    onChange={(e) => setGstTaxAdditional(Number(e.target.value))}
                                />

                                {/* Description */}
                                <TextField id="descriptionAdditinalCharges" label="Description" variant="outlined"
                                    size='small' color='primary' autoComplete="off" className='w-11/12'
                                    name='descriptionAdditinalCharges' 
                                    value={description}
                                    onChange={(e)=> setDescription(e.target.value)}
                                />
                                 <Tooltip title="Add Data" placement="right" arrow>
                                            <IconButton aria-label="Add" color='primary' className='pb-6'
                                             onClick={addChargesToTable} >
                                                <AddCircleIcon />
                                            </IconButton>
                                  </Tooltip>
                            </div>
                        </Container>
                    </Paper>

                    {/* Additional charges table */}
                     {/* Tests and price tabe */}
                     <TableContainer className='mt-5 shadow-lg' component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className=" font-bold">Service Add-ons</TableCell>
                                    <TableCell align="right" className="font-bold">GST & Tax</TableCell>
                                    <TableCell align="center" className="font-bold">Description</TableCell>
                                    <TableCell className="font-bold"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {additionalChargeTable.map((data, index) => (
                                    <TableRow key={data.id}>
                                        <TableCell className='py-0'>{data.additionalCharges}</TableCell>
                                        <TableCell align="center" className='py-0'>
                                           {data.gst}
                                        </TableCell>
                                        <TableCell align="center" className='py-0'>
                                           {data.description}
                                        </TableCell>
                                        <TableCell align="center" className='py-0'>
                                             <IconButton aria-label="delete" onClick={() => deleteCharges(data)}>
                                                <DeleteOutlineIcon color='error' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6} className='font-bold' align='right'>Total</TableCell>
                                    <TableCell align="right" className='font-bold'>{ccyFormat(totalAdditionalCharges)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Proceed to Billing details */}
                    <div className='mt-6'>
                        <Button variant="contained" onClick={proceedToBill}>Proceed To Bill</Button>
                    </div>

                </CustomTabPanel>

                {/* Billing Deatils custom pannel */}
                <CustomTabPanel value={tabValue} index={1}>
                    {/* Patient details for reference */}
                    <div className='flex'>
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {patientName} </Typography>
                    </div>

                    {/* <div className='flex flex-wrap gap-5'> */}
                    {/* Transaction Type  */}
                    {/* <Select
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

                        </Select> */}

                    {/* Comment Add charges or Discount */}
                    {/* <Select
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
                                    <MenuItem value="Discount">
                                        Discount
                                    </MenuItem>
                                ) :
                                    (
                                        <MenuItem value="Additional Charges" >
                                            Additional Charges
                                        </MenuItem>
                                    )
                            }
                            <MenuItem value="other">
                                Other
                            </MenuItem>

                        </Select> */}

                    {/* Amount */}
                    {/* <TextField id="amount" label="Amount" variant="outlined"
                            size='small' autoComplete="off" className='w-4/12' onChange={(e) => handleAmount(e)}
                        /> */}

                    {/* Comments */}
                    {/* <TextField id="comments" label="Comments" variant="outlined" value={comment}
                            size='small' autoComplete="off" className='w-8/12'
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Reason for ${defaultComment}`}
                            onClick={handleDefaultComment}
                        // onFocus={handleDefaultComment}

                        /> */}

                    {/* Add Transaction to table */}
                    {/* <Tooltip title="Add Transaction to table" placement="top" arrow>
                            <IconButton aria-label="Add" color='primary' onClick={addTransaction}>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip> */}
                    {/* </div> */}
                    {/* </Grid> */}

                    {/* Payment Details */}
                    {/* <TableContainer className='mt-5 shadow-lg' component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className=" font-bold border">Transactions</TableCell>
                                    <TableCell align="center" className="font-bold border">Rate</TableCell>
                                    <TableCell align="center" className="font-bold border">Tax & GST</TableCell>
                                    <TableCell align="center" className="font-bold">Comments</TableCell>
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
                                <TableRow>
                                    <TableCell colSpan={3} align='right' className='border-none'>Total Rate</TableCell>
                                    <TableCell align="right">{ccyFormat(subTotalAmount)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} align='right' className='border-none'>Tax</TableCell>
                                    <TableCell align="right">{ccyFormat(totalTax)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} align='right' className='border-none font-semibold'>Total</TableCell>
                                    <TableCell align="right"><CurrencyRupeeIcon className='text-base' /> {ccyFormat(totalBill)}</TableCell>
                                </TableRow>
                              
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
                                            <TextField id="comment" label="Comment" variant="outlined"
                                                size='small' color='primary' autoComplete="off" className='w-11/12'
                                            />
                                        </div>
                                    </TableCell>

                                </TableRow>
                              
                                <TableRow>
                                    <TableCell colSpan={3} align='right'>
                                        <Select
                                            labelId="payment_mode"
                                            id="payment_mode"
                                            value={selectPaymentMode}
                                            label="Payment Mode"
                                            onChange={(e) => setSelectPaymentMode(e.target.value)}
                                            className="w-4/5 md:w-1/2"
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
                                    <TableCell >
                                        <div className='w-full'>
                                            <TextField id="transactionDetails" label="Transaction details" variant="outlined"
                                                size='small' color='primary' autoComplete="off" className='w-11/12'
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer> */}

                    <Paper className='w-full md:w-2/3 mt-5'>
                        <Container className='py-6 md:px-8'>
                            <div className='flex  flex-col  gap-4'>
                                <Typography color='' className='text-base' > <span > Test Charges : </span> <CurrencyRupeeIcon fontSize='small' /> {ccyFormat(subTotalPrice)}  </Typography>
                                <Typography color='' className='text-base'> Additional Charges : <CurrencyRupeeIcon fontSize='small' /> {ccyFormat(totalAdditionalCharges)} </Typography>
                                <Typography color='' className='text-base'> Billing Amount : <CurrencyRupeeIcon fontSize='small' /> {ccyFormat(totalBillingAmount)} </Typography>

                                {/* Amount paid */}
                                {/* <label className='mt-2 w-full md:w-1/4'>Amount paid</label> */}
                                <TextField id="amountPaid" label="Amount Paid" variant="outlined"
                                    size='small' color='primary' autoComplete="off" className='w-full md:w-6/12 mt-4'
                                    name='amountPaid'
                                    value={amountPaid}
                                    type='number'
                                    onChange={(e) => setAmountPaid(Number(e.target.value))}
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
                        </Container>
                    </Paper>

                    <Divider className='mt-5' />
                    <div className='mt-6 flex justify-end gap-x-10 w-full'>
                        <Typography color='textDisabled' className='mt-3'> Balance Remaining : <CurrencyRupeeIcon fontSize='small' /> {ccyFormat(balanceRemaining)} </Typography>
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