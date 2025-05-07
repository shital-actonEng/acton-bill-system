"use client"
import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { getInvoice } from '@/express-api/invoices/page';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Print, CheckCircle } from '@mui/icons-material';

type Patient = {
  invoiceId: number,
  date: Date,
  name: string,
  age: string,
  sex: string,
  mobile: number,
  // tests : [],
  referredBy: string,
  balance: number,
  status: string,
  // Actions : HTMLInputElement
}



const BillingTable = () => {

  const [data, setData] = useState<Patient[]>([]);

  const fetchInvoiceData = async () => {
    const invoiceData = await getInvoice();
    return invoiceData;
  };

  const rowActions = [
    {
      icon: <Edit fontSize="small" />,
      tooltip: 'Edit',
      getOnClick: (row : any) => () => console.log('Edit', row.original),
    },
    {
      icon: <Print fontSize="small" />,
      tooltip: 'Print',
      getOnClick: (row : any) => () => console.log('Print', row.original),
    },
    {
      icon: <CheckCircle fontSize="small" />,
      tooltip: 'Dispatch',
      getOnClick: (row : any) => () => console.log('Dispatch', row.original),
    },
  ];

  useEffect(() => {
    (
      async () => {
        const invoiceData = await fetchInvoiceData();
        console.log("invoice data is from table...", invoiceData);
        const newData = invoiceData.map((invoice: any) => {
          let patientDetails = invoice.amb_patient;
          let referredDetails = invoice.amb_referrer;
          const date = new Date(invoice.createdAt);
          const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-GB', options);
          let balance = 0
          invoice.amb_invoice_trans.forEach((amountIn: any) => {
            balance = balance + amountIn.amount
          })
          return {
            invoiceId: invoice.pk,
            date: formattedDate,
            name: patientDetails.name,
            age: `${patientDetails.meta_details.ageYear} Y, ${patientDetails.meta_details.ageMonth} M`,
            sex: patientDetails.meta_details.gender,
            mobile: patientDetails.mobile,
            // tests : [],
            referredBy: referredDetails.name,
            balance: balance,
            status: invoice.status,
            // Actions : HTMLInputElement
          }
        })
        setData(newData);
      })()
  }, [])

  //should be memoized or stable
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
      },
      {
        accessorKey: 'name', //normal accessorKey
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 150,
      },
      {
        accessorKey: 'sex',
        header: 'Gender',
        size: 150,
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
        accessorKey: 'balance',
        header: 'Balance',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        Cell: () => (
          <Chip label="Pending" color="warning" size="small" />
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            {
              rowActions.map((item , index) =>
                <Tooltip title={item.tooltip} placement='top' arrow key={index} >
                  <IconButton
                    color='primary' onClick={item.getOnClick(row)}
                    size='small'
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              )
            }

          </div>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default React.memo(BillingTable);
