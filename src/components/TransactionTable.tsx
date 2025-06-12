import { useBillingStore } from '@/stores/billingStore'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import dayjs from "dayjs";

const TransactionTable = () => {
    const {transactionTableData} = useBillingStore();
    const filteredTransaction = transactionTableData.filter((item)=> item.payment_type !== "" );
  return (
    <>
         <TableContainer className='mt-5'>
                <Table sx={{ minWidth: 650 }} aria-label="spanning table" className='border rounded-lg'>
                    <TableHead>
                        <TableRow>
                            <TableCell className="font-semibold">Date</TableCell>
                            <TableCell className="font-semibold">Amount</TableCell>
                            <TableCell className="font-semibold">Transaction Type</TableCell>
                            <TableCell className="font-semibold">Transaction Details</TableCell>
                            {/* <TableCell className="font-semibold"></TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTransaction.map((data) => (
                            <TableRow key={data.pk}>
                                 <TableCell>
                                    {/* {data.updatedAt} */}
                                    {
                                        dayjs(data.updatedAt).format("DD/MM/YYYY hh:mm A")
                                    }
                                </TableCell>
                                <TableCell>
                                    {-data.amount}
                                </TableCell>
                                <TableCell>{data.payment_type}</TableCell>
                                <TableCell>
                                    {data.comments}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    </>
  )
}

export default TransactionTable
