"use client"
import { Autocomplete, Box, Button, Card, Chip, Container, InputAdornment, ListItemIcon, ListItemText, MenuItem, Paper, Tab, Tabs, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, HowToReg, Payment, CurrencyRupee, Money, QrCodeScanner, AccountBalance, LocalAtm } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
// import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// import PaymentMode from './PaymentMode';
import { useRef } from 'react';
import Link from 'next/link';
import { getPatients } from '@/express-api/patient/page';
import TestPriceTable from './TestPriceTable';
import AdditionalChargeTable from './AdditionalChargeTable';
import { addInvoice, getInvoice } from '@/express-api/invoices/page';
import { useRouter } from 'next/navigation';


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

type TestType = {
    id: number;
    name: string;
    price: number;
    consession: number;
    gst: number;
    comment: string;
    aggregateDue: number;
    discountMin: string;
    discountMax: string;
}

type AdditionChargeType = {
    id: number;
    additionalCharges: string;
    gst: number;
    description: string;
    subtTotalCharges: number
}

type referrenceType = {
    name: string;
    pk: number;
    meta_details: {
        mobile: number;
        email: string;
        medicalDegree: string;
        prn: string;
        bonusInPercentage: string;
        bonus: string;
        address: string
    }
}

const RegisterPatientForm = () => {
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    // const [amountPaid, setAmountPaid] = useState(0);
    const [selectPaymentMode, setSelectPaymentMode] = useState("");
    // const [testTableData, setTestTableData] = useState<{ id: number; name: string; price: number; consession: number; gst: number; comment: string; aggregateDue: number; discountMin: string; discountMax: string }[]>([]);
    // const testTableRef = useRef<{ id: number; name: string; price: number; consession: number; gst: number; comment: string; aggregateDue: number; discountMin: string; discountMax: string }[]>([]);
    const [testTable, setTestTable] = useState<TestType[]>([]);
    const [additionChargeTable, setadditionChargeTable] = useState<AdditionChargeType[]>([]);
    // const [additionalCharges, setAdditionalCharges] = useState(0);
    // const [gstTaxAdditional, setGstTaxAdditional] = useState(0);
    // const [description, setDescription] = useState("");
    const [totalBillingAmount, setTotalBillingAmount] = useState(0);
    const [totalAdditionalCharges, setTotalAdditionalCharges] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openPatient, setOpenPatient] = useState(false);
    const [patientData, setPatientData] = useState<patient[]>([]);
    const [searchPatient, setSearchPatient] = useState<patient | null>(null);
    const [isInvoice, setIsInvoice] = useState(false);
    // const [transaction , setTransaction] = useState<{amount: number; trans_type:string ; payment_type:string ; comments:string}[]>([]);
    const amountPaidRef = useRef<HTMLInputElement>(null);
    const transactiondetailsRef = useRef<HTMLInputElement>(null);
    let referrerDataRef = useRef<referrenceType | null>(null);
    const router = useRouter();
    // const [additionalChargeTable, setAdditionalChargeTable] = useState<{ id: number; additionalCharges: string; gst: number; description: string; subtTotalCharges: number }[]>([]);

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const proceedToBill = () => {
        setTabValue(1);
        setTotalBillingAmount(totalAdditionalCharges + subTotalPrice)
        setBalanceRemaining(totalAdditionalCharges + subTotalPrice)
    }

    const fetchInvoiceData = async () => {
        const invoiceData = await getInvoice();
        return invoiceData;
    };

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

    const patientsearchData = async (val: any) => {
        setSearchPatient(val);
        console.log("patient data is...", val);
        const invoiceData = await fetchInvoiceData();
        console.log("invoice data is...", invoiceData);
        const matchedInvoice = invoiceData.find((invoice: any) => invoice.patient_fk === val.pk);
        if (matchedInvoice) {
            console.log("invoioce id for this patient is available", matchedInvoice.amb_invoice_trans);
            setIsInvoice(true);
            let newTestCharge = 0;
            let newAdditionalCharge = 0;
            matchedInvoice.amb_invoice_trans.map((transactions : any) => {
                const comments = transactions.comments || "" ;
                if(comments.includes("Test")){
                   newTestCharge  = newTestCharge + transactions.amount
                }
               else if(comments.includes("Additional")){
                    newAdditionalCharge  = newAdditionalCharge + transactions.amount
                 }
            })
            setSubTotalPrice(newTestCharge);
            setTotalAdditionalCharges(newAdditionalCharge);
        }
        else {
            setIsInvoice(false);
        }
    }

    const handleTotalChange = (total: number) => {
        setTotalAdditionalCharges(total);
    };

    const handleAdditionalChargeTable = (data: any) => {
        setadditionChargeTable(data);
        console.log("additional charges is on parent ...", data);
    }

    const handleTestChange = (testData: any) => {
        setTestTable(testData)
        // console.log("test ref data is ,..." , testTable);
    }

    const handlereferrerChange = (referrer: any) => {
        referrerDataRef.current = referrer;
    }

    const handleTestCharge = (total: number) => {
        setSubTotalPrice(total);
    }

    const handleAmountChange = (e: any) => {
        setSelectPaymentMode(e.target.value)
        const value = parseFloat(amountPaidRef.current?.value || '0');
        setBalanceRemaining((prev) => prev - value);
    };

    const handleTransactionDetails = (e: any) => {

    }

    const handleConfirmBill = () => {
        let login = "Shital"
        let compositeInvoice = {}
        console.log(" additional charge data is...", additionChargeTable);
        let fullTransaction: { amount: number; trans_type: string; payment_type: string; comments: string }[] = [];
        if (testTable.length > 0) {
            const newTransactions = testTable.flatMap((test) => {
                const entries = [];
                // Base test price - Debit
                entries.push({
                    trans_type: "Debit",
                    amount: test.price,
                    payment_type: "", // or some default value
                    comments: "Test Price",
                });

                // Concession/discount - Credit
                if (test.consession && test.consession > 0) {
                    entries.push({
                        trans_type: "Credit",
                        amount: -(test.consession * test.price / 100),
                        payment_type: "",
                        comments: "Test Discount",
                    });
                }

                // GST - Debit
                if (test.gst && test.gst > 0) {
                    entries.push({
                        trans_type: "Debit",
                        amount: (test.gst * test.price / 100),
                        payment_type: "",
                        comments: "Test GST",
                    });
                }

                return entries;
            });

            fullTransaction.push(...newTransactions);
        }

        if (additionChargeTable.length > 0) {
            const newCharge = additionChargeTable.flatMap((charge) => {
                const result = [];
                // base charge price 
                result.push({
                    trans_type: "Debit",
                    amount: Number(charge.additionalCharges),
                    payment_type: "", // or some default value
                    comments: "Additional Charge Price",
                })

                // GST - Debit
                if (charge.gst && charge.gst > 0) {
                    result.push({
                        trans_type: "Debit",
                        amount: (Number(charge.gst) * Number(charge.additionalCharges) / 100),
                        payment_type: "", // or some default value
                        comments: "Additional Charge GST",
                    })
                }
                return result;
            });

            fullTransaction.push(...newCharge);
        }

        if (Number(amountPaidRef.current?.value) !== 0) {
            // base amount paid
            console.log("amount paid....", amountPaidRef.current?.value)
            fullTransaction.push({
                trans_type: "Credit",
                amount: -(Number(amountPaidRef.current?.value)),
                payment_type: selectPaymentMode, // or some default value
                comments: transactiondetailsRef.current?.value || "",
            })
        }

        let patientid = searchPatient?.pk ? searchPatient.pk : "";
        console.log("referrer is on parent ...", referrerDataRef.current);
        let referrerId = referrerDataRef.current ? referrerDataRef.current?.pk : "";
        let itemFks = testTable.map((t) => {
            return ({ diagnostic_test_fk: t.id })
        })
        compositeInvoice = {
            invoice: { patient_fk: patientid, referrer_fk: referrerId },
            items: itemFks,
            trans: fullTransaction
        }
        const data = addInvoice(login, compositeInvoice);
        router.push('/registeredpatients');
    }

    // performance.mark("table-render-start");
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

                        <Typography className='text-sm font-semibold my-4' color='error'>
                            {
                                !isInvoice ?
                                    "Please fill Bill information here."
                                    : "Bill is alraedy calculated. Please Go To Payment "
                            }
                        </Typography>

                        <TestPriceTable onTotalTestChange={handleTestCharge} onTestChange={handleTestChange} onReferrerChange={handlereferrerChange} />
                    </Paper>

                    {/* Additional charges */}
                    <Paper className='w-full mt-5 py-6 md:px-8'>
                        <AdditionalChargeTable onTotalChange={handleTotalChange} onTableChange={handleAdditionalChargeTable} />

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
                                inputRef={amountPaidRef}
                                // onChange={handleAmountChange}
                                type='number'
                                // onChange={(e) => setAmountPaid(Number(e.target.value))}
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
                                    // onChange={(e) => setSelectPaymentMode(e.target.value)}
                                    onChange={handleAmountChange}
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
                                    inputRef={transactiondetailsRef}
                                />
                            </div>
                        </div>
                    </Paper>

                    <Divider className='mt-5' />
                    <div className='mt-6 flex justify-end gap-x-10 w-full'>
                        <Typography color='textDisabled' className='mt-3'> Balance Remaining : <CurrencyRupee fontSize='small' /> {ccyFormat(balanceRemaining)} </Typography>
                        {/* <Link href="/registeredpatients" > */}
                        <Button variant="contained" onClick={handleConfirmBill}>Confirm & Proceed</Button>
                        {/* </Link> */}
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