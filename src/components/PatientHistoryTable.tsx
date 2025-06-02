"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { getInvoice } from "@/express-api/invoices/page";
import { useBranchStore } from "@/stores/branchStore";

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Sample data type
type PatientInfo = {
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

type Patient = {
  invoiceId: number,
  date: Date,
  name: string,
  mobile: number,
  // tests : [],
  referredBy: string,
  totalGST : number,
  totalDiscount : number,
  totalPrice : number
  balance: number,
  status: string,
}

const PatientHistoryTable = () => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [data, setData] = useState<Patient[]>([]);
   const branch = useBranchStore((state) => state.selectedBranch);

  const fetchInvoiceData = async () => {
     const diagnosticCentreId = branch?.pk;
    const invoiceData = await getInvoice(diagnosticCentreId , "A");
    // const invoiceData = await getInvoice("A");
    return invoiceData;
  };
 
  useEffect(() => {
    (
      async () => {
        const invoiceData = await fetchInvoiceData();
        const newData = invoiceData.map((invoice: any) => {
           let balance = 0
            invoice.amb_invoice_trans.forEach((amountIn: any) => {
              balance = balance + amountIn.amount
            })
          
            let patientDetails = invoice.amb_patient;
            let referredDetails = invoice.amb_referrer;
            let transactions = invoice.amb_invoice_trans;
            let totalGST = 0;
            let totalDiscount = 0;
            let totalPrice = 0 ;
            console.log("data transaction in history table..." , transactions);
            transactions.forEach((ele : any) => {
              if(ele.comments.includes("GST")){
                   totalGST = totalGST + ele.amount;
              }
               if(ele.comments.includes("Discount")){
                   totalDiscount = totalDiscount + (- ele.amount);
              }
              if(ele.comments.includes("Price")){
                   totalPrice = totalPrice + ele.amount;
              }
              console.log("total gst is..." , totalGST);
            });
            return {
              invoiceId: invoice.pk,
              date: dayjs(invoice.updatedAt).toISOString(),
              name: patientDetails?.name,
              mobile: patientDetails.mobile,
              // tests : [],
              referredBy: referredDetails?.name,
              totalGST : totalGST,
              totalDiscount : totalDiscount,
              totalPrice : totalPrice,
              balance: balance,
              status: invoice?.status,
              patientInfo: patientDetails,
              // Actions : HTMLInputElement
            }
          
        }).filter(Boolean)

        setData(newData);
      })()
  }, [])


  const filteredData = useMemo(() => {
    console.log("from date is..." , fromDate);
    return data.filter((row) => {
      const visit = dayjs(row.date);
      return (
        (!fromDate || dayjs(row.date).isSameOrAfter(fromDate, "day")) &&
        (!toDate || dayjs(row.date).isSameOrBefore(toDate, "day"))
      );
    });
  }, [data, fromDate, toDate]);

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: 'invoiceId', //access nested data with dot notation
        header: 'Invoice Id',
        size: 150,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
        Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("DD/MM/YYYY"),
      },
      {
        accessorKey: 'name', //normal accessorKey
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile',
        size: 150,
      },
      {
        accessorKey: 'referredBy',
        header: 'Referred By',
        size: 150,
      },
       {
        accessorKey: 'totalGST',
        header:  'GST',
        size: 100,
      },
       {
        accessorKey: 'totalDiscount',
        header: 'Discount',
        size: 100,
      },
       {
        accessorKey: 'totalPrice',
        header: 'Total Price',
        size: 150,
      },
     
    ],
    [fromDate, toDate]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
     initialState: { pagination: { pageSize: 5, pageIndex: 0, } },
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
