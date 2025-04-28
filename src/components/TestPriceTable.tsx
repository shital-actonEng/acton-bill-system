import { Alert, Autocomplete, FormControl, IconButton, MenuItem, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import jsonData from '../../data/testsData.json';
import { AddCircle, DeleteOutline, CurrencyRupee, Money, QrCodeScanner, AccountBalance, LocalAtm, AddComment } from '@mui/icons-material';
import { getReferrer } from '@/express-api/referrer/page';

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
  }

  interface TestRowProps {
    data: TestData;
    handlePopoverOpen: (event: React.MouseEvent<HTMLElement>, testName: string) => void;
    handlePopoverClose: () => void;
    handleConsessionChange: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleGstChange: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCommentChange: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteTest: (data: TestData) => void;
  }

  const TestRow: React.FC<TestRowProps> = React.memo(
    ({ data, handlePopoverOpen, handlePopoverClose, handleConsessionChange, handleGstChange, handleCommentChange, deleteTest }) => {
      return (
        <TableRow>
          <TableCell className='py-0'>{data.name}</TableCell>
          <TableCell
            align="right"
            className='py-0'
            onMouseEnter={(e) => handlePopoverOpen(e, data.name)}
            onMouseLeave={handlePopoverClose}
          >
            {data.price}
          </TableCell>
          <TableCell align="center" className='py-0'>
            <TextField
              id={`consession-${data.id}`}
              label="Consession%"
              variant="standard"
              type="number"
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
              type="number"
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
  


const TestPriceTable = () => {
    const [referredDoctor, setReferredDoctor] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectReferreing, setSelectReferreing] = useState([]);
    // const [uniqueModality, setUniqueModality] = useState<{ id: number, label: string }[]>([]);
    const [uniqueBodyParts, setUniqueBodyParts] = useState<{ id: number, label: string }[]>([]);
    const [selectedTest, setSelectedTest] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [testData, setTestData] = useState<{ modality: string; body_part: string; protocol: string; price: string; diagnostic_centre_fk: string; }[]>([]);
    const [testTableData, setTestTableData] = useState<{ id: number; name: string; price: number; consession: number; gst: number; comment: string; aggregateDue: number }[]>([]);
    const [testName, setTestName] = useState("");
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

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

    const uniqueBodyPart = useMemo(() => {
        const result = getUniqueOptions(jsonData, "body_part");
        return result;
    }, [jsonData]);

    useEffect(() => {
        setTestData(jsonData);
        // setUniqueModality(uniqueModalities)
        // setUniqueBodyParts(uniqueBodyPart)
        //Tests 
        setSelectedTest(jsonData);
    }, [jsonData, uniqueModalities, uniqueBodyPart])

    const handleModality = (selectmodality: any) => {
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
        const body_part = testData.filter((test) =>
            test.body_part.toLowerCase().includes(body_parts.label.toLowerCase())
        )
        setSelectedTest(body_part);
    };

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

    useEffect(() => {
        const newTotal = testTableData.reduce(
            (sum, item) => sum + item.aggregateDue,
            0
        );
        setSubTotalPrice(newTotal);
        // setTotalBill(newTotal + subTotalAmount + totalTax);
        // setTotalBillingAmount(newTotal + totalAdditionalCharges);
        //setBalanceRemaining(newTotal + totalAdditionalCharges);

        const marks = performance.getEntriesByName("table-render-start");
        if (marks.length > 0) {
            performance.mark("table-render-end");
            performance.measure("table-render-time", "table-render-start", "table-render-end");

            const measure = performance.getEntriesByName("table-render-time")[0];
            console.log(`Table render time: ${measure.duration.toFixed(2)}ms`);

            // Clean up
            performance.clearMarks();
            performance.clearMeasures();
        }
    }, [testTableData]);

    const deleteTest = (deletedData: any) => {
        const gst = deletedData.gst * deletedData.price / 100
        setTestTableData((data) => data.filter((item) => item.id !== deletedData.id))
        setSubTotalPrice((prevTotal) => prevTotal - deletedData.price - gst);
    }

    function ccyFormat(num: number) {
        return `${num.toFixed(2)}`;
    }

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, testName: string) => {
        setAnchorEl(event.currentTarget);
        setTestName(testName);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

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

    return (
        <>
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
                            onOpen={loadReferral}
                            displayEmpty
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
                                    <MenuItem value={data.name} key={index}>
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
                            <TableCell className="font-semibold">Price (<CurrencyRupee fontSize='small' />) </TableCell>
                            <TableCell className="font-semibold">Consession</TableCell>
                            <TableCell className="font-semibold">GST(%)</TableCell>
                            <TableCell className="font-semibold">Comment</TableCell>
                            <TableCell className="font-semibold">Aggregate Due</TableCell>
                            <TableCell className="font-semibold"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {testTableData.map((data, index) => (
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
                                <TableCell className='py-0'>{data.aggregateDue}</TableCell>
                                <TableCell className='py-0'>
                                    <IconButton aria-label="delete" onClick={() => deleteTest(data)}>
                                        <DeleteOutline color='error' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))} */}
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
