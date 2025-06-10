"use client"
import { Autocomplete, Box, Button, Container, InputAdornment, ListItemIcon, ListItemText, MenuItem, Paper, Tab, Tabs, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Search, HowToReg, Payment, CurrencyRupee, Money, QrCodeScanner, AccountBalance, LocalAtm } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import { useRef } from 'react';
import { getPatients } from '@/express-api/patient/page';
import TestPriceTable from './TestPriceTable';
import AdditionalChargeTable from './AdditionalChargeTable';
import { addInvoice, addPrintInvoice, appendTransations, getInvoice } from '@/express-api/invoices/page';
import { useRouter } from 'next/navigation';
import { useBillingStore } from '@/stores/billingStore';
import { getTest } from '@/express-api/testRecord/page';
import TransactionTable from './TransactionTable';
import { useBranchStore } from '@/stores/branchStore';

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
        PaymentMode: "Cash",
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
    const [tabValue, setTabValue] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    const [initialBalance, setInitialBalance] = useState(0);
    const [selectPaymentMode, setSelectPaymentMode] = useState("Cash");
    const [loading, setLoading] = useState(false);
    const [openPatient, setOpenPatient] = useState(false);
    const [patientData, setPatientData] = useState<patient[]>([]);
    const [isInvoice, setIsInvoice] = useState(false);
    const amountPaidRef = useRef<HTMLInputElement>(null);
    const transactiondetailsRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { subTotalPrice, testTableData, referredDoctor, patientSelected, additionalChargeTable, totalAdditionalCharges, invoicePk, totalBillingAmount, transactionTableData, updateState } = useBillingStore();
    const [allTests, setAllTests] = useState<any[]>([]);
    const { selectedBranch } = useBranchStore();
    let fullTransaction: { amount: number; trans_type: string; payment_type: string; comments: string }[] = [];

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const proceedToBill = () => {
        setTabValue(1);
        // setTotalBillingAmount(totalAdditionalCharges + subTotalPrice)
        const billAmount = totalAdditionalCharges + subTotalPrice;
        updateState({ totalBillingAmount: billAmount })
        if (invoicePk == 0 || invoicePk == null) {
            setBalanceRemaining(totalAdditionalCharges + subTotalPrice)
            setInitialBalance(totalAdditionalCharges + subTotalPrice)
        }
    }

    const fetchInvoiceData = async () => {
        const invoiceData = await getInvoice();
        return invoiceData;
    };

    const loadPatientData = async (value : any) => {
        try {
            setLoading(true);
            const result = await getPatients(value);
            setPatientData(result);
        } catch (error) {
            console.log("failed to load patient data")
        }
        finally {
            setLoading(false);
        }
    }

    const patientsearchData = async (val: any) => {
        // setSearchPatient(val);
        updateState({ patientSelected: val });
        fetchPatientData(val);
    }


    const fetchPatientData = async (patient: any) => {
        const invoiceData = await fetchInvoiceData();
        const matchedInvoice = invoiceData.find((invoice: any) => invoice.patient_fk === patient?.pk);
        if (matchedInvoice) {
            const transDetails = matchedInvoice.amb_invoice_trans;
            fullTransaction.push(...transDetails);
            updateState({ transactionTableData: transDetails });
            setIsInvoice(true);
            updateState({ isDisabled: true, invoicePk: matchedInvoice?.pk })
            const ambInvoiceItems = matchedInvoice.amb_invoice_items
            const selectedTestIds = ambInvoiceItems.map(item => item.diagnostic_test_fk);
            const selectedTests = allTests.filter(test => selectedTestIds.includes(test.pk) && test.pk !== 1)
            const referrerAvailable = matchedInvoice.amb_referrer
            if (referrerAvailable) {
                updateState({ referredDoctor: referrerAvailable })
            }
            else {
                updateState({ referredDoctor: null })
            }

            const newTests = selectedTests.map((test) => {
                const matchingitem = ambInvoiceItems.find(item => item?.diagnostic_test_fk == test.pk)
                let priceConsseion = Number(matchingitem?.meta_details?.price) - Number(matchingitem.meta_details?.consession)
                let consessionPer = Number(matchingitem.meta_details?.consession) * 100 / Number(matchingitem?.meta_details?.price);
                let gstPer = Number(matchingitem.meta_details?.gst) * 100 / priceConsseion;
                const aggregateDueVal = Number(matchingitem?.meta_details?.price) - Number(matchingitem?.meta_details?.consession) + Number(matchingitem.meta_details?.gst)
                return {
                    id: test?.pk,
                    name: test?.protocol,
                    price: Number(matchingitem?.meta_details?.price),
                    gst: gstPer,
                    consession: consessionPer,
                    aggregateDue: aggregateDueVal,
                    comment: "",
                    discountMin: test.meta_details?.discount_min_range,
                    discountMax: test.meta_details?.discount_max_range
                }
            })

            const additionalTest = ambInvoiceItems.filter(item => item?.diagnostic_test_fk == 1);
            const newAddition = additionalTest.map((charge) => {
                const gstPer = Number(charge?.meta_details?.gst) * 100 / Number(charge.meta_details?.price);
                const subTotal = Number(charge.meta_details?.price) + Number(charge.meta_details?.gst);
                return {
                    id: charge?.pk,
                    additionalCharges: charge?.meta_details?.price,
                    gst: gstPer,
                    description: "",
                    subtTotalCharges: subTotal
                }
            })

            let newTestCharge = 0;
            let newAdditionalCharge = 0;
            let balanceRem = 0;
            matchedInvoice.amb_invoice_trans.map((transactions: any) => {
                const comments = transactions.comments || "";
                balanceRem = balanceRem + transactions.amount;
                if (comments.includes("Test")) {
                    newTestCharge = newTestCharge + transactions.amount
                }
                else if (comments.includes("Additional")) {
                    newAdditionalCharge = newAdditionalCharge + transactions.amount
                }
            })

            setBalanceRemaining(balanceRem);
            setInitialBalance(balanceRem);
            let totalBilling = newTestCharge + newAdditionalCharge
            updateState({
                testTableData: newTests,
                additionalChargeTable: newAddition,
                subTotalPrice: newTestCharge,
                totalAdditionalCharges: newAdditionalCharge,
                totalBillingAmount: totalBilling
            })

        }
        else {
            updateState({
                testTableData: [],
                additionalChargeTable: [],
                referredDoctor: null,
                transactionTableData: [],
                isDisabled: false,
                totalAdditionalCharges: 0,
                totalBillingAmount: 0,
                invoicePk: 0
            })
            setBalanceRemaining(0);
            setInitialBalance(0);
            setIsInvoice(false);
        }
    }

    const handleAmountChange = (e: any) => {
        // setSelectPaymentMode(e.target.value)
        const value = parseFloat(amountPaidRef.current?.value || '0');
        setBalanceRemaining(initialBalance - value);
    };

    const handleConfirmBill = async () => {
        let login = "Shital"
        let compositeInvoice = {}
        let printInvoiceId = 0;
        if (isInvoice) {
            printInvoiceId = invoicePk;
            if (Number(amountPaidRef.current?.value) !== 0) {
                // base amount paid
                fullTransaction.push({
                    trans_type: "Credit",
                    amount: -(Number(amountPaidRef.current?.value)),
                    payment_type: selectPaymentMode, // or some default value
                    comments: transactiondetailsRef.current?.value || "",
                })
            }
            let trans = fullTransaction.map((t) => { return ({ ...t, invoice_fk: invoicePk }) })
            let compositeInvoice = {
                trans: trans
            }

            await appendTransations(login, invoicePk, compositeInvoice)
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));
        }

        else {
            // let fullTransaction: { amount: number; trans_type: string; payment_type: string; comments: string }[] = [];
            if (testTableData.length > 0) {
                let totalTestPrice = 0;
                let totalConsession = 0;
                let consessionPrice = 0;
                let totalGst = 0;
                let entries = [];
                const newTransactions = testTableData.forEach((test) => {
                    // Base test price - Debit
                    totalTestPrice = totalTestPrice + test.price;

                    // Concession/discount - Credit
                    if (test.consession && test.consession > 0) {
                        totalConsession = (totalConsession + (test.consession * test.price / 100))
                    }
                    consessionPrice = test.price - (test.consession * test.price / 100)
                    // GST - Debit
                    if (test.gst && test.gst > 0) {
                        totalGst = totalGst + (test.gst * consessionPrice / 100);
                    }
                });

                entries.push({
                    trans_type: "P",
                    amount: totalTestPrice,
                    payment_type: "", // or some default value
                    comments: "Test Price",
                });

                // Concession/discount - Credit
                if (totalConsession > 0) {
                    entries.push({
                        trans_type: "D",
                        amount: -(totalConsession),
                        payment_type: "",
                        comments: "Test Discount",
                    });
                }

                // GST - Debit
                if (totalGst > 0) {
                    entries.push({
                        trans_type: "G",
                        amount: totalGst,
                        payment_type: "",
                        comments: "Test GST",
                    });
                }

                fullTransaction.push(...entries);
            }

            if (additionalChargeTable.length > 0) {
                const result = [];
                let totalCharge = 0;
                let totalGst = 0;
                const newCharge = additionalChargeTable.forEach((charge) => {
                    // base charge price 
                    totalCharge = totalCharge + Number(charge.additionalCharges)
                    // GST - Debit
                    if (charge.gst && charge.gst > 0) {
                        totalGst = totalGst + (Number(charge.gst) * Number(charge.additionalCharges) / 100)
                    }

                });

                result.push({
                    trans_type: "C",
                    amount: Number(totalCharge),
                    payment_type: "", // or some default value
                    comments: "Additional Charge Price",
                })
                // GST - Debit
                if (totalGst > 0) {
                    result.push({
                        trans_type: "T",
                        amount: totalGst,
                        payment_type: "", // or some default value
                        comments: "Additional Charge GST",
                    })
                }

                fullTransaction.push(...result);
            }

            if (Number(amountPaidRef.current?.value) !== 0) {
                // base amount paid
                fullTransaction.push({
                    trans_type: "Credit",
                    amount: -(Number(amountPaidRef.current?.value)),
                    payment_type: selectPaymentMode, // or some default value
                    comments: transactiondetailsRef.current?.value || "",
                })
            }

            let patientid = patientSelected?.pk ? patientSelected.pk : "";
            let referrerId = referredDoctor ? referredDoctor.pk : "";
            let diagnosticcentre = selectedBranch ? selectedBranch.pk : "";

            let newitemFks = [];
            if (testTableData.length > 0) {
                const testFk = testTableData.map((t) => {
                    let priceConsseion = Number(t.price) - Number(t?.price * t?.consession / 100)
                    return (
                        {
                            diagnostic_test_fk: t?.id,
                            meta_details: {
                                price: t?.price,
                                consession: Number(t?.price * t?.consession / 100),
                                gst: Number(priceConsseion * t?.gst / 100)
                            }
                        }
                    )
                })
                newitemFks.push(...testFk)
            }

            if (additionalChargeTable.length > 0) {
                const chargeFk = additionalChargeTable.map((t) => {
                    return (
                        {
                            diagnostic_test_fk: 1,
                            meta_details: {
                                price: Number(t?.additionalCharges),
                                gst: Number(t?.additionalCharges * t?.gst / 100)
                            }
                        }
                    )
                })
                newitemFks.push(...chargeFk);
            }

            compositeInvoice = {
                invoice: { patient_fk: patientid, referrer_fk: referrerId, diagnostic_centre_fk: diagnosticcentre },
                items: newitemFks,
                trans: fullTransaction
            }

            printInvoiceId = await handleAddInvoice(login, compositeInvoice)
        }

        router.push('/registeredpatients');

        const imageUrl = `${window.location.origin}/medicalInvoiceLogo.avif`;
        const IsreferredBy = referredDoctor?.name ? ` ${referredDoctor?.name}` : ``;
        const htmlContent = `
        <html>
            <head>
                <style>
                table {
                border-collapse: collapse;
                width: 100%;
                }

                td, th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                }

                tr:nth-child(even) {
                background-color: #dddddd;
                }
                </style>
            </head>
            <body>
                <div margin: 0px 0px 0px 0px;">
                     <div style="display:flex; align-items: center; "> 
                     <div style="width:25%;">
                        <img src="${imageUrl}" style="width:90%;" />
                     </div>
                     <div> <h2 style="color:#dddddd; margin: 0;"> ${selectedBranch?.name} </h2> </div>
                     </div> 
                                <div style="display:flex; justify-content: space-between;"> 
                                    <div style="width:50%">  
                                        <b>Patient</b> : ${patientSelected?.name} <br/>
                                        <b>Age/Sex</b> :  ${patientSelected?.meta_details.ageYear}/${patientSelected?.meta_details.gender} <br/>
                                        <b>mobile</b> : ${patientSelected?.mobile} <br/>
                                        <b>Referred By</b> : ${IsreferredBy} <br/>
                                    </div>
                                    <div>  
                                        <b>DATE</b> :  <br/>
                                        <b>Invoice ID</b> : ${printInvoiceId} <br/>
                                        <b>Patient ID</b> : ${patientSelected?.pk} <br/>
                                    </div>
                                </div>
                            </div>
                             <hr style="margin-top: 10px; margin-bottom: 10px;"><br/>

                            <table>
                                    <tr>
                                        <th>Investigations</th>
                                        <th>Charges</th>
                                         <th>GST%</th>
                                        <th>Discount%</th>
                                        <th>SubTotal</th>
                                    </tr>
                                    ${testTableData.map(test => `
                                            <tr>
                                            <td>${test.name}</td>
                                            <td>${test.price}</td>
                                            <td>${test.gst}</td>
                                            <td>${test.consession}</td>
                                            <td>${test.aggregateDue}</td>
                                            </tr>
                                        `).join('')
            }
                                       ${additionalChargeTable.map(charge => `
                                                <tr>
                                                  <td>${`Additional Charges`}</td>
                                                    <td>${charge.additionalCharges}</td>
                                                    <td>${charge.gst}</td>
                                                    <td>${`0`}</td>
                                                    <td>${charge.subtTotalCharges}</td>
                                                </tr>
                                            `).join('')
            }
                                         <tr>
                                            <td colspan="4" style="text-align:right">Total</td>
                                            <td>${totalBillingAmount}</td>
                                        </tr>                                    
                                    </table>
                               <br/>
                                  <b>Total Bill Amount</b> : ${totalBillingAmount} <br/> <br />
                                  <b>Balance Remaining</b> : ${balanceRemaining} <br/> <br/>
                                 <hr/><br/>
                            </body>
                            </html>
                    `;
        const printData = {
            html: htmlContent,
            invoiceId: printInvoiceId
        }
        addPrintInvoice(printData)

        updateState({
            testTableData: [],
            patientSelected: null,
            additionalChargeTable: [],
            totalAdditionalCharges: 0,
            isDisabled: false,
            referredDoctor: null,
            transactionTableData: [],
            totalBillingAmount: 0
        });
    }

    const handleAddInvoice = async (login: any, compositeInvoice: any) => {
        const data = await addInvoice(login, compositeInvoice);
        // updateState({invoicePk : data.pk})
        return data.pk;
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log("test api");
            const allTestsResult = await getTest();
            setAllTests(allTestsResult);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (allTests.length && patientSelected) {
            fetchPatientData(patientSelected);
        } else if (!patientSelected) {
            updateState({
                testTableData: [],
                patientSelected: null,
                additionalChargeTable: [],
                transactionTableData: [],
                totalAdditionalCharges: 0,
                isDisabled: false,
                referredDoctor: null,
                totalBillingAmount: 0
            });
        }
    }, [allTests, patientSelected]);


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
                            // onOpen={() => {
                            //     setOpenPatient(true)
                            //     loadPatientData()
                            // }}
                            onClose={() => {
                                setOpenPatient(false)
                            }}
                            onChange={(e, newValue) => patientsearchData(newValue)}
                            onInputChange={(event, value) => {
                                if (value.length >= 4) {
                                      setOpenPatient(true)
                                    loadPatientData(value); 
                                }
                            }}
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
                                patientSelected == null ?
                                    (
                                        <>
                                            <Typography className="font-semibold text-sm">
                                                Search  for a patient for bill record.
                                            </Typography>
                                        </>
                                    )
                                    :
                                    (<> <Typography className='text-sm font-semibold mb-3'> {patientSelected?.name} </Typography>
                                        <Typography className='text-sm mb-3' >Age :  {patientSelected?.meta_details.ageYear} </Typography>
                                        <Typography className='text-sm mb-3' > {patientSelected?.meta_details.address} </Typography>
                                        <Typography className='text-sm mb-3'> mobile : <span className='font-bold'> {patientSelected?.mobile} </span> </Typography>
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

                        <TestPriceTable />
                    </Paper>

                    {/* Additional charges */}
                    <Paper className='w-full mt-5 py-6 md:px-8'>
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
                        <Typography className='text-sm text-gray-600 font-semibold mb-4'> Patient : {patientSelected?.name} </Typography>
                    </div>

                    <Paper className='w-full mt-5 py-6 md:px-8'>
                        <div className='flex  flex-col  gap-4 md:w-2/3'>
                            <Typography className='text-base' > <span > Test Charges : </span> <CurrencyRupee fontSize='small' /> {ccyFormat(subTotalPrice)}  </Typography>
                            <Typography className='text-base'> Additional Charges : <CurrencyRupee fontSize='small' /> {ccyFormat(totalAdditionalCharges)} </Typography>
                            <Typography className='text-base'> Billing Amount : <CurrencyRupee fontSize='small' /> {ccyFormat(totalBillingAmount)} </Typography>

                            {/* Amount paid */}
                            {/* <label className='mt-2 w-full md:w-1/4'>Amount paid</label> */}
                            <TextField id="amountPaid" label="Amount Paid" variant="outlined"
                                size='small' color='primary' autoComplete="off" className='w-full md:w-6/12 mt-4'
                                name='amountPaid'
                                inputRef={amountPaidRef}
                                onBlur={handleAmountChange}
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
                                    onChange={(e) => setSelectPaymentMode(e.target.value)}
                                    // onChange={handleAmountChange}
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
                        <TransactionTable />
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