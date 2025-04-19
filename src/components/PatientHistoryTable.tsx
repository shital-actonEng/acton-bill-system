"use client";
import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { MRT_Localization_EN } from 'material-react-table/locales/en';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Sample data type
type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
  visitDate: string; // ISO format date
};

// Sample data with visitDate
const data: Person[] = [
  {
    name: { firstName: "John", lastName: "Doe" },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
    visitDate: "2024-04-01",
  },
  {
    name: { firstName: "Jane", lastName: "Doe" },
    address: "769 Dominic Grove",
    city: "Columbus",
    state: "Ohio",
    visitDate: "2024-04-05",
  },
  {
    name: { firstName: "Joe", lastName: "Doe" },
    address: "566 Brakus Inlet",
    city: "South Linda",
    state: "West Virginia",
    visitDate: "2025-09-6",
  },
  {
    name: { firstName: "John", lastName: "Doe" },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
    visitDate: "2025-03-01",
  },
  {
    name: { firstName: "John", lastName: "Doe" },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
    visitDate: "2024-04-01",
  },
  {
    name: { firstName: "John", lastName: "Doe" },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
    visitDate: "2024-04-01",
  },
];

const PatientHistoryTable = () => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const visit = dayjs(row.visitDate);
      return (
        (!fromDate || dayjs(row.visitDate).isSameOrAfter(fromDate, "day")) &&
        (!toDate || dayjs(row.visitDate).isSameOrBefore(toDate, "day"))
      );
    });
  }, [fromDate, toDate]);

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name.firstName",
        header: "First Name",
      },
      {
        accessorKey: "name.lastName",
        header: "Last Name",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "visitDate",
        header: "Visit Date",
        Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("YYYY-MM-DD"),
      },
    ],
    [fromDate, toDate]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableColumnFilters: true,
    ...MRT_Localization_EN,
    muiTopToolbarProps: {
      sx: {
       my: 2
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box display="flex" alignItems="center" gap={2} px={2}>
        <DatePicker
          label="From"
          value={fromDate}
          onChange={(newValue) => setFromDate(newValue)}
          slotProps={{ textField: { size: "small" } }}
        />
        <DatePicker
          label="To"
          value={toDate}
          onChange={(newValue) => setToDate(newValue)}
          slotProps={{ textField: { size: "small" } }}
        />
      </Box>
    ),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
  </LocalizationProvider>

  );
};

export default React.memo(PatientHistoryTable);
