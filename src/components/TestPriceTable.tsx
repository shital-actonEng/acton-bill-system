import { Alert, Autocomplete, FormControl, IconButton, MenuItem, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AddCircle, DeleteOutline, CurrencyRupee } from '@mui/icons-material';
import { getReferrer } from '@/express-api/referrer/page';
import { getTest } from '@/express-api/testRecord/page';
import { useBranchStore } from '@/stores/branchStore';
import { useBillingStore } from '@/stores/billingStore';
import { getModalities } from '@/express-api/modalities/page';


// Utility function
// const getUniqueOptions = (data: any[], key: string) => {
//     const seen = new Set();
//     return data
//         .filter((item) => {
//             if (!seen.has(item[key])) {
//                 seen.add(item[key]);
//                 return true;
//             }
//             return false;
//         })
//         .map((item, index) => ({
//             id: index,
//             label: item[key],
//         }));
// };
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
    handleConsessionChange: (id: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, consessionUpto: any) => void;
    handleGstChange: (id: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => void;
    handleCommentChange: (id: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => void;
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
                        // label="Consession%"
                        label={<>
                            Consession (
                            <CurrencyRupee fontSize="inherit" />
                            {((data.consession * data.price) / 100)})
                        </>}
                        variant="standard"
                        // type="number"
                        size="small"
                        value={data.consession || ""}
                        onChange={(e) => handleConsessionChange(data.id, e, consessionUpto)}
                        InputLabelProps={{ style: { fontSize: '0.75rem' } }}
                    />
                </TableCell>
                <TableCell align="center" className='py-0'>
                    <TextField
                        id={`gst-${data.id}`}
                        // label="GST%"
                        label={<>
                            GST (
                            <CurrencyRupee fontSize="inherit" />
                            {((data.gst * (data.price - ((data.consession * data.price) / 100))) / 100)})
                        </>}
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

TestRow.displayName = "TestRow"

type Test = {
    pk: number;
    modality: string;
    body_part: string;
    protocol: string;
    price: string;
    deleted: boolean;
    diagnostic_centre_fk: string;
    modality_type_fk: number;
    meta_details: {
        gst: string;
        discount_min_range: string;
        discount_max_range: string;
        referrel_bonus: string;
        referrel_bonus_percentage: string;
    };
};

type Modality = {
    pk: number;
    name: string;
    description: string;
}

type ReferrenceType = {
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


const TestPriceTable = () => {
    const [loading, setLoading] = useState(false);
    const [selectReferreing, setSelectReferreing] = useState<ReferrenceType[]>([]);
    const [uniqueModalities, setUniqueModalities] = useState<Modality[]>([]);
    const [uniqueBodyParts, setUniqueBodyParts] = useState<Test[]>([]);
    const [selectedModality, setSelectedModality] = useState("");
    const [selectedTest, setSelectedTest] = useState<Test[]>([]);
    const [testData, setTestData] = useState<Test[]>([]);
    const [consessionUpto, setConsessionUpto] = useState<{ discountMin: string; discountMax: string; name: string } | undefined>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const branch = useBranchStore((state) => state.selectedBranch);
    const { updateState, isDisabled } = useBillingStore();
    const subTotalPrice = useBillingStore((state) => state.subTotalPrice);
    const testTableData = useBillingStore((state) => state.testTableData);
    const referredDoctor = useBillingStore((state) => state.referredDoctor);
    const [isConsessionRange, setIsConsessionRange] = useState(false);

    const loadReferral = async () => {
        try {
            setLoading(true);
            const result = await getReferrer();
            setSelectReferreing(result);
            console.log("all referrel are...", result);
        } catch (error) {
            console.log("Failed to load referrer", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTest();
                const resultModalities = await getModalities();

                const uniqueModalityFiltered: Modality[] = Array.from(
                    new Map(resultModalities.map((item: Modality) => [item.description, item])).values()
                ) as Modality[];

                setUniqueModalities(uniqueModalityFiltered);

                if (!branch) return;
                const filteredResult = result.filter((item: any) =>
                    item.diagnostic_centre_fk === branch.pk && item.deleted == null
                );
                setTestData(filteredResult);
                setSelectedTest(filteredResult);
                // const resultBodyParts = getUniqueOptions(result, "modality");
                setUniqueBodyParts(result);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        };
        fetchData();
    }, [branch])

    const handleModality = (selectmodality: any) => {

        if (selectmodality === null) {
            setSelectedTest(testData);
            setSelectedModality("");
            return;
        }
        setSelectedModality(selectmodality);
        const selectedModalityObj = uniqueModalities.find((m) => m.description.toLowerCase() === selectmodality.toLowerCase());

        const filterTest = testData.filter((t) => t.modality_type_fk === selectedModalityObj?.pk)
        setUniqueBodyParts(filterTest);
        setSelectedTest(filterTest);
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
            name: item.protocol,
            price: Number(item.price),
            gst: Number(item.meta_details.gst),
            consession: 0,
            aggregateDue: aggregateDueVal,
            comment: "",
            discountMin: item.meta_details.discount_min_range,
            discountMax: item.meta_details.discount_max_range
        }

        updateState({ testTableData: [...testTableData, newTest] })
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

    const handleConsessionChange = (id: number, e: any, consessionUptoVal: any) => {
        const value = e.target.value;
        console.log("consession is upto...", consessionUptoVal);
        console.log("consession value...", value);
        setConsessionUpto(consessionUptoVal);
        let discountMin = 0;
        let discountMax = 100;
        if (consessionUptoVal) {
            discountMin = Number(consessionUptoVal?.discountMin)
            discountMax = Number(consessionUptoVal?.discountMax)
            // discountMin = isNaN(discountMinParse) ? 0 : discountMinParse
            // discountMax = isNaN(discountMaxParse) ? 100 : discountMaxParse
        }

        if (value < discountMin || value > discountMax) {
            setIsConsessionRange(true);
        }
        else {
            setIsConsessionRange(false);
        }

        const updateTestTable = testTableData.map((item) => {
            if (item.id === id) {
                const aggregateDue = (item.price - (item.price * Number(value) / 100))
                const gstAmount = item.gst * aggregateDue / 100
                // const gstAmount = item.gst * item.price / 100
                return {
                    ...item,
                    consession: Number(value),
                    aggregateDue: aggregateDue + gstAmount
                }
            }
            return item
        }
        )
        updateState({ testTableData: updateTestTable })
    };

    const handleGstChange = () => {

    }

    const handleCommentChange = (id: number, event: any) => {
        const updatedData = testTableData.map((item) =>
            item.id === id ? { ...item, comment: event.target.value } : item
        );
        // setTestTableData(updatedData);
        updateState({ testTableData: updatedData });
    };

    const handleReferrer = (e: any) => {
        const selectedPk = e.target.value;
        const selectedRef = selectReferreing.find((ref) => ref.pk === selectedPk);
        updateState({ referredDoctor: selectedRef });
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
                            value={referredDoctor?.name ?? ""}
                            onChange={handleReferrer}
                            onOpen={loadReferral}
                            displayEmpty
                            disabled={isDisabled}
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
                                    <MenuItem value={data.pk} key={index}>
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
                    options={uniqueModalities.map((m) => m.description)}
                    value={selectedModality}
                    disabled={isDisabled}
                    onChange={(e, newValue) => handleModality(newValue)}
                    size="small"
                    className="w-full md:w-[45%]"
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
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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

                {/* Alert for tests discount or consession enters wrong */}
                {
                    isConsessionRange ?
                        <Alert severity="error" className='text-sm w-11/12'>You can give only  {consessionUpto?.discountMin}   to   {consessionUpto?.discountMax}% of consession for {consessionUpto?.name || "this Test"}.</Alert>
                        : null
                }

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
                <Alert severity="warning" className='text-sm'>You can give  {consessionUpto?.discountMin}   to   {consessionUpto?.discountMax}% of consession for {consessionUpto?.name || "this Test"}.</Alert>
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
