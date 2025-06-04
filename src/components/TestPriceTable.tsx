import { Alert, Autocomplete, FormControl, IconButton, MenuItem, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import jsonData from '../../data/testsData.json';
import { AddCircle, DeleteOutline, CurrencyRupee } from '@mui/icons-material';
import { getReferrer } from '@/express-api/referrer/page';
import { getTest } from '@/express-api/testRecord/page';
import { useBranchStore } from '@/stores/branchStore';
import { useBillingStore } from '@/stores/billingStore';


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
interface TestData {
    id: number;
    name: string;
    price: number;
    consession: number;
    gst: number;
    comment: string;
    aggregateDue: number;
    discountMin: string,
    discountMax: string
}

interface TestRowProps {
    data: TestData;
    handlePopoverOpen: (event: React.MouseEvent<HTMLElement>, consessionUpto: any) => void;
    handlePopoverClose: () => void;
    handleConsessionChange: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleGstChange: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCommentChange: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteTest: (data: TestData) => void;
}

const TestRow: React.FC<TestRowProps> = React.memo(
    ({ data, handlePopoverOpen, handlePopoverClose, handleConsessionChange, handleGstChange, handleCommentChange, deleteTest }) => {
        const consessionUpto = {
            name: data.name,
            discountMin: data.discountMin,
            discountMax: data.discountMax
        }
        return (
            <TableRow>
                <TableCell className='py-0'>{data.name}</TableCell>
                <TableCell
                    align="right"
                    className='py-0'
                    onMouseEnter={(e) => handlePopoverOpen(e, consessionUpto)}
                    onMouseLeave={handlePopoverClose}
                >
                    {data.price}
                </TableCell>
                <TableCell align="center" className='py-0'>
                    <TextField
                        id={`consession-${data.id}`}
                        label="Consession%"
                        variant="standard"
                        // type="number"
                        size="small"
                        value={data.consession || ""}
                        onChange={(e) => handleConsessionChange(data.id, e)}
                        InputLabelProps={{ style: { fontSize: '0.75rem' } }}
                    />
                </TableCell>
                <TableCell align="center" className='py-0'>
                    <TextField
                        id={`gst-${data.id}`}
                        label="GST%"
                        variant="standard"
                        // type="number"
                        size="small"
                        value={data.gst || ""}
                        onChange={(e) => handleGstChange(data.id, e)}
                        InputLabelProps={{ style: { fontSize: '0.75rem' } }}
                    />
                </TableCell>
                <TableCell align="center" className='py-0'>
                    <TextField
                        id={`comment-${data.id}`}
                        label="Comment"
                        variant="standard"
                        type="text"
                        size="small"
                        value={data.comment || ""}
                        onChange={(e) => handleCommentChange(data.id, e)}
                        inputProps={{ className: "text-sm" }}
                        className=" [&_label]:text-xs"
                    />
                </TableCell>
                <TableCell className='py-0'>{data.aggregateDue}</TableCell>
                <TableCell className='py-0'>
                    <IconButton aria-label="delete" onClick={() => deleteTest(data)}>
                        <DeleteOutline color='error' />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
);

type Test = {
    pk: number;
    modality: string;
    body_part: string;
    protocol: string;
    price: string;
    diagnostic_centre_fk: string;
    meta_details: {
        gst: string;
        discount_min_range: string;
        discount_max_range: string;
        referrel_bonus: string;
        referrel_bonus_percentage: string;
    };
};

// type TestTable = {
//     id: number;
//     name: string; price: number;
//     consession: number; gst: number;
//     comment: string; aggregateDue: number;
//     discountMin: string; discountMax: string
// }

type TestChargeTableProps = {
    // onTotalTestChange: (total: number) => void;
    // onTestChange: (testTable: TestTable[]) => void;
    // onReferrerChange: ({ }) => void;
};

const TestPriceTable: React.FC<TestChargeTableProps> = () => {
    // const [referredDoctor, setReferredDoctor] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectReferreing, setSelectReferreing] = useState([]);
    const [uniqueBodyParts, setUniqueBodyParts] = useState<{
        modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; meta_details: {
            gst: string;
            discount_min_range: string;
            discount_max_range: string;
            referrel_bonus: string;
            referrel_bonus_percentage: string
        }
    }[]>([]);

    const [selectedTest, setSelectedTest] = useState<Test[]>([]);
    // const [testData, setTestData] = useState<{
    //     pk : number ;
    //     modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; meta_details: {
    //         gst: string;
    //         discount_min_range: string;
    //         discount_max_range: string;
    //         referrel_bonus: string;
    //         referrel_bonus_percentage: string
    //     }
    // }[]>([]);
    const [testData, setTestData] = useState<Test[]>([]);
    // const [testTableData, setTestTableData] = useState<{ id: number; name: string; price: number; consession: number; gst: number; comment: string; aggregateDue: number; discountMin: string; discountMax: string }[]>([]);
    // const [testTableData, setTestTableData] = useState<TestTable[]>([]);
    const [consessionUpto, setConsessionUpto] = useState<{ discountMin: string; discountMax: string; name: string } | undefined>();
    // const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const branch = useBranchStore((state) => state.selectedBranch);
    const { updateState , isDisabled } = useBillingStore();
    const subTotalPrice = useBillingStore((state) => state.subTotalPrice);
    const testTableData = useBillingStore((state) => state.testTableData);
    const referredDoctor = useBillingStore((state) => state.referredDoctor );

    const loadReferral = async () => {
        try {
            setLoading(true);
            const result = await getReferrer();
            setSelectReferreing(result);
        } catch (error) {
            console.log("Failed to load referrer", error);
        }
        finally {
            setLoading(false);
        }
    }
    const uniqueModalities = useMemo(() => {
        const result = getUniqueOptions(jsonData, "modality");
        return result;
    }, [jsonData]);

    // const uniqueBodyPart = useMemo(() => {
    //     if (!jsonData) return [];
    //     const result = getUniqueOptions(jsonData, "body_part");
    //     return result;    
    // }, [jsonData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTest();
                if (!branch) return;
                const filteredResult = result.filter((item : any) =>
                     item.diagnostic_centre_fk === branch.pk && item.deleted == null
            );
                setTestData(filteredResult);
                setSelectedTest(filteredResult);
                const resultBodyParts = getUniqueOptions(result, "modality");
                setUniqueBodyParts(result);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        };
        fetchData();
    }, [branch])

    const handleModality = (selectmodality: any) => {
        const modalities = testData.filter((test) =>
            test.modality.toLowerCase().includes(selectmodality.label.toLowerCase())
        )
        // for filtered and unique body parts according to modality
        const uniqueBodyParts = modalities
            .filter((item, index, self) =>
                index === self.findIndex((t) => t.body_part === item.body_part)
            );
        setUniqueBodyParts(uniqueBodyParts);
    }

    const handleBodyParts = (body_parts: any) => {
        const body_part = testData.filter((test) =>
            test.body_part.toLowerCase().includes(body_parts.label.toLowerCase())
        )
        setSelectedTest(body_part);
    };

    const handleTestTable = (test: any) => {
        if (test === null) {
            return;
        }
        // const items = test.label;
        const item = testData.find((option) => option.protocol === test.label);
        if (!item) {
            console.log("Item not found...")
            return;
        }
        const gstCal = Number(item.price) * Number(item.meta_details.gst) / 100
        const aggregateDueVal = Number(item.price) + gstCal;
        const newTest = {
            id: item.pk,
            name:  item.protocol,
            price: Number(item.price),
            gst: Number(item.meta_details.gst),
            consession: 0,
            aggregateDue: aggregateDueVal,
            comment: "",
            discountMin: item.meta_details.discount_min_range,
            discountMax: item.meta_details.discount_max_range
        }

        updateState({ testTableData : [...testTableData , newTest] })
    }

    useEffect(() => {
        const newTotal = testTableData.reduce(
            (sum, item) => sum + item.aggregateDue,
            0
        );
        updateState({ subTotalPrice: newTotal })

    }, [testTableData]);

    const deleteTest = (deletedData: any) => {
        const gst = deletedData.gst * deletedData.price / 100
        const updateTableData = testTableData.filter((item) => item.id !== deletedData.id);
        updateState({ testTableData: updateTableData });
        updateState({ subTotalPrice: subTotalPrice - deletedData.price - gst });
    }

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, consessionUpto: any) => {
        setAnchorEl(event.currentTarget);
        setConsessionUpto(consessionUpto);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleConsessionChange = (id: number, e: any) => {
        const value = e.target.value;
        const updateTestTable =  testTableData.map((item) => {
            if (item.id === id) {
                const aggregateDue = (item.price - (item.price * Number(value) / 100))
                // const gstAmount = item.gst * aggregateDue / 100
                const gstAmount = item.gst * item.price / 100
                return {
                    ...item,
                    consession: Number(value),
                    aggregateDue: aggregateDue + gstAmount
                }
            }
            return item
        } 
        )
        updateState({testTableData : updateTestTable})
    };

    const handleGstChange = (id: number, e: any) => {

    }

    const handleCommentChange = (id: number, event: any) => {
        const updatedData = testTableData.map((item) =>
            item.id === id ? { ...item, comment: event.target.value } : item
        );
        // setTestTableData(updatedData);
        updateState({testTableData : updatedData});
    };

    const handleReferrer = (e: any) => {
        updateState({referredDoctor : e.target.value});
    }

    return (
        <>
            {/* Refrred Doctor */}
            <div className='flex flex-wrap gap-4  w-full md:w-2/3'>
                <div className='flex flex-wrap gap-4 w-full'>
                    <FormControl size="small" className='w-11/12'>
                        <Select
                            labelId="referred_doctor"
                            id="referred_doctor"
                            value={referredDoctor.name ?? ""}
                            onChange={handleReferrer}
                            onOpen={loadReferral}
                            displayEmpty
                            disabled = {isDisabled}
                            renderValue={(selected) => {
                                if (selected === "") {
                                    return "Referred Doctor";
                                }
                                return selected;
                            }}
                        >
                            {loading ? (
                                <MenuItem disabled>
                                    <span style={{ marginLeft: 10 }}>Loading...</span>
                                </MenuItem>
                            ) : (
                                selectReferreing.map((data, index) => (
                                    <MenuItem value={data} key={index}>
                                        {data.name}
                                    </MenuItem>
                                ))
                            )}

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
                    options={uniqueModalities}
                    disabled = {isDisabled}
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
                    options={uniqueBodyParts.map((t, index) => ({ id: index, label: t.body_part }))}
                    onChange={(e, newValue) => handleBodyParts(newValue)}
                    size="small"
                    disabled = {isDisabled}
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
                    disabled = {isDisabled}
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
                <Alert severity="error" className='text-sm'>You can give  {consessionUpto?.discountMin}   to   {consessionUpto?.discountMax}% of consession for {consessionUpto?.name || "this Test"}.</Alert>
            </Popover>

            {/* Tests and price tabe */}
            <TableContainer className='mt-5' >
                <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                    <TableHead>
                        <TableRow>
                            <TableCell className=" font-semibold">Tests</TableCell>
                            <TableCell className="font-semibold">Price (<CurrencyRupee fontSize='small' />) </TableCell>
                            <TableCell className="font-semibold">Consession(%)</TableCell>
                            <TableCell className="font-semibold">GST(%)</TableCell>
                            <TableCell className="font-semibold">Comment</TableCell>
                            <TableCell className="font-semibold">Aggregate Due</TableCell>
                            <TableCell className="font-semibold"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {testTableData.map((data) => (
                            <TestRow
                                key={data.id}
                                data={data}
                                handlePopoverOpen={handlePopoverOpen}
                                handlePopoverClose={handlePopoverClose}
                                handleConsessionChange={handleConsessionChange}
                                handleGstChange={handleGstChange}
                                handleCommentChange={handleCommentChange}
                                deleteTest={deleteTest}
                            />
                        ))}

                        <TableRow>
                            <TableCell colSpan={5} className='font-bold' align='right'>Total</TableCell>
                            <TableCell className='font-bold'>{ccyFormat(subTotalPrice)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default TestPriceTable
