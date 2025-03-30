import { Box, Card, FormControlLabel, Radio, Tabs, Typography, RadioGroup, Tab, TextField, InputAdornment, Button } from '@mui/material'
import React, { useState } from 'react'
import MoneyIcon from '@mui/icons-material/Money';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import Image from 'next/image';
import AddCardIcon from '@mui/icons-material/AddCard';
import CustomInput from './ui/CustomInput';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function PaymentModeTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a12yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


const PaymentMode = () => {
    const [selectPaymentMode, setSelectPaymentMode] = useState(0);
    const choosePaymentMode = [
        {
            id: 0,
            label: "Cash",
            icon: <MoneyIcon />,
        },
        {
            id: 1,
            label: "UPI (Pay via any App)",
            icon: <QrCodeScannerIcon />,
        },
        {
            id: 2,
            label: "Credit/Debit Card",
            icon: <PaymentIcon />,
        },
        {
            id: 3,
            label: "Net Banking",
            icon: <AccountBalanceIcon />,
        },
        {
            id: 4,
            label: "Cheque",
            icon: <LocalAtmIcon />,
        },
    ]

    const handlePaymentModeTab = (event: React.SyntheticEvent, newValue: number) => {
        setSelectPaymentMode(newValue);
    }


    return (
        <>
            <Card className='m-4'>
                <Box
                    className="flex flex-grow"
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={selectPaymentMode}
                        onChange={handlePaymentModeTab}
                        aria-label="choose payment mode"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        {
                            choosePaymentMode.map((mode, index) =>
                                <Tab label={mode.label} {...a12yProps(mode.id)} icon={mode.icon} iconPosition="start"
                                    key={index} className="justify-start text-left text-xs font-bold" disableRipple />
                            )
                        }
                    </Tabs>
                    <div className='px-4 py-2'>
                        <PaymentModeTabPanel value={selectPaymentMode} index={0}>
                            <Typography className='text-sm text-gray-600 font-semibold mb-4'> Cash Payment </Typography>
                        </PaymentModeTabPanel>

                        <PaymentModeTabPanel value={selectPaymentMode} index={1}>
                            <div className='flex flex-col gap-7'>
                                <Typography className='text-sm text-gray-600 font-semibold mb-4'> Pay using UPI </Typography>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="phonePay"
                                    name="radio-buttons-group"
                                    className="flex flex-col gap-y-4"
                                >
                                    <FormControlLabel value="phonePay" control={<Radio size='small' />}
                                        label={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Image
                                                    src="/phonepay.png"
                                                    alt="Phone Pay"
                                                    width={45}
                                                    height={45}
                                                />
                                                <span className='text-xs ml-3'>Phone Pay</span>
                                            </div>
                                        }
                                    />
                                    <FormControlLabel value="upiId" control={<Radio size='small' />}
                                        label={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Image
                                                    src="/upi.jpeg"
                                                    alt="Phone Pay"
                                                    width={45}
                                                    height={45}
                                                    className='rounded border'
                                                />
                                                <span className='text-xs ml-3'>Enter UPI Id</span>
                                            </div>
                                        } />
                                </RadioGroup>
                            </div>
                        </PaymentModeTabPanel>

                        <PaymentModeTabPanel value={selectPaymentMode} index={2}>
                            <div className='flex flex-col gap-7'>
                                <Typography className='text-sm text-gray-600 font-semibold mb-4'> Credit/debit Card </Typography>
                                <p className='text-xs'>
                                    Please Ensure your card can be used for online transactions.
                                </p>

                                {/* <TextField
                                    id="cardnumber"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <AddCardIcon />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    variant="outlined"
                                    placeholder='Card Number'
                                    size='small'
                                    color='primary'
                                    fullWidth
                                    sx={{
                                        "& input::placeholder": {
                                          fontSize: "0.75rem", // Equivalent to `text-xs`
                                          opacity: 0.7,
                                        }
                                      }}
                                /> */}
                                <CustomInput
                                    id="cardnumber"
                                    placeholder="Card Number"
                                    type="text"
                                    endIcon={<AddCardIcon />}
                                    size='small'
                                    required
                                    fullWidth
                                />
                                <CustomInput
                                    id="cardname"
                                    placeholder="Name of Card"
                                    type="text"
                                    size='small'
                                    required
                                    fullWidth
                                />
                                <div className='flex justify-between gap-3' >
                                    <CustomInput
                                        id="validthru"
                                        placeholder="Valid Thru (MM/YY)"
                                        type="text"
                                        size='small'
                                        required
                                        className='w-2/3'
                                    />
                                    <CustomInput
                                        id="cvv"
                                        placeholder="CVV"
                                        type="text"
                                        size='small'
                                        required
                                        className='1/3'
                                    />
                                </div>

                                <Button variant='contained'>PAY NOW</Button>
                            </div>
                        </PaymentModeTabPanel>

                        <PaymentModeTabPanel value={selectPaymentMode} index={3}>
                            <div className='flex flex-col gap-7'>
                                <Typography className='text-sm text-gray-600 font-semibold mb-4'> Net Banking </Typography>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="axisbank"
                                    name="radio-buttons-group"
                                    className="flex flex-col gap-y-4"
                                >
                                    <FormControlLabel value="axisBank" control={<Radio size='small' />}
                                        label={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Image
                                                    src="/axisbank.jpg"
                                                    alt="Axis Bank"
                                                    width={45}
                                                    height={45}
                                                    className='border rounded-full'
                                                />
                                                <span className='text-xs ml-3'>Axis Bank</span>
                                            </div>
                                        }
                                    />
                                    <FormControlLabel value="hdfcbank" control={<Radio size='small' />}
                                        label={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Image
                                                    src="/hdfcbank.png"
                                                    alt="HDFC Bank"
                                                    width={45}
                                                    height={45}
                                                    className='border rounded-full'
                                                />
                                                <span className='text-xs ml-3'>HDFC Bank</span>
                                            </div>
                                        } />

                                    <FormControlLabel value="sbibank" control={<Radio size='small' />}
                                        label={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Image
                                                    src="/sbibank.png"
                                                    alt="SBI Bank"
                                                    width={45}
                                                    height={45}
                                                    className='border rounded-full'
                                                />
                                                <span className='text-xs ml-3'>SBI</span>
                                            </div>
                                        } />

                                    <FormControlLabel value="kotakbank" control={<Radio size='small' />}
                                        label={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Image
                                                    src="/kotakbank.png"
                                                    alt="Kotak Bank"
                                                    width={45}
                                                    height={45}
                                                    className='border rounded-full'
                                                />
                                                <span className='text-xs ml-3'>Kotak</span>
                                            </div>
                                        } />
                                </RadioGroup>

                                <CustomInput
                                    id="otherbank"
                                    placeholder="Other Bank"
                                    type="text"
                                    startIcon={<AccountBalanceIcon />}
                                    size='small'
                                    fullWidth
                                />
                            </div>
                        </PaymentModeTabPanel>

                    </div>
                </Box>
            </Card>
        </>
    )
}

export default PaymentMode