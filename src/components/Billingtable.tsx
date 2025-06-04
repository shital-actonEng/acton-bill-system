"use client"
import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Cell
} from 'material-react-table';
import { getInvoice, getPrintinvoice, updateStatus } from '@/express-api/invoices/page';
import { Alert, Chip, IconButton, Pagination, Snackbar, SnackbarCloseReason, Tooltip } from '@mui/material';
import { Edit, Print, CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useBillingStore } from '@/stores/billingStore';
import { useBranchStore } from '@/stores/branchStore';
import dayjs from "dayjs";

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
  age: string,
  sex: string,
  mobile: number,
  // tests : [],
  referredBy: string,
  balance: number,
  status: string,
  patientInfo: PatientInfo
  // Actions : HTMLInputElement
}

const BillingTable = () => {

  const [data, setData] = useState<Patient[]>([]);
  const router = useRouter();
  const updateState = useBillingStore((state) => state.updateState);
  const [isDispatch, setIsDispatch] = useState(false);
  const branch = useBranchStore((state) => state.selectedBranch);

  const fetchInvoiceData = async () => {  
    const diagnosticCentreId = branch?.pk;
    const invoiceData = await getInvoice(diagnosticCentreId , undefined , undefined , "P");
    // const invoiceData = await getInvoice();
    return invoiceData;
  };

  const handleEditPatient = (rowData: any) => {
    updateState({ patientSelected: rowData.patientInfo });
    router.push('/registerpatient')
  }

  const handleDispatch = async (rowData: any) => {
    const invoicePk = rowData.invoiceId;
    const data = await updateStatus(invoicePk, "A");
    // router.push('/history')
    setIsDispatch(true);
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsDispatch(false);
  };


  const handleReport = async (rowData: any) => {
    console.log("data for report...", rowData);
    const url = await getPrintinvoice(rowData.invoiceId);
    console.log("url is...", url);
    window.open(url , '_blank'); 
  }

  const rowActions = [
    {
      icon: <Edit fontSize="small" />,
      tooltip: 'Edit',
      getOnClick: (row: any) => () => handleEditPatient(row.original),
    },
    {
      icon: <Print fontSize="small" />,
      tooltip: 'Print',
      getOnClick: (row: any) => () => handleReport(row.original),
    },
    {
      icon: <CheckCircle fontSize="small" />,
      tooltip: 'Dispatch',
      getOnClick: (row: any) => () => handleDispatch(row.original),
      disabled: (row: any) => row.original.disableDispatch,
    },
  ];

  useEffect(() => {
    (
      async () => {
        const invoiceData = await fetchInvoiceData();
        const newData = invoiceData.map((invoice: any) => {
          let patientDetails = invoice.amb_patient;
          let referredDetails = invoice.amb_referrer;
          const date = new Date(invoice.createdAt);
          let balance = 0
          invoice.amb_invoice_trans.forEach((amountIn: any) => {
            balance = balance + amountIn.amount
          })
          const disableDispatch = balance !== 0;
          return {
            invoiceId: invoice.pk,
            // date: invoice.createdAt,
            date : date ,
            name: patientDetails?.name,
            age: `${patientDetails?.meta_details?.ageYear} Y, ${patientDetails?.meta_details?.ageMonth} M`,
            sex: patientDetails?.meta_details.gender,
            mobile: patientDetails.mobile,
            // tests : [],
            referredBy: referredDetails?.name,
            balance: balance,
            status: invoice?.status,
            patientInfo: patientDetails,
            disableDispatch: disableDispatch,
            // Actions : HTMLInputElement
          }
        })
        setData(newData);
      })()
  }, [branch?.pk])

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
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format("DD/MM/YYYY hh:mm A"),
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
              rowActions.map((item, index) =>
                <Tooltip title={item.tooltip} placement='top' arrow key={index} >
                  <IconButton
                    color='primary' onClick={item.getOnClick(row)}
                    size='small'
                    disabled={item.disabled ? item.disabled(row) : false}
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
    data,
    initialState: { pagination: { pageSize: 5, pageIndex: 0, } },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar open={isDispatch} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Patient Dispatch successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default React.memo(BillingTable);
