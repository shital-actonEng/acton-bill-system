import { create } from 'zustand';

type TestTable = {
    id: number;
    name: string; price: number;
    consession: number; gst: number;
    comment: string; aggregateDue: number;
    discountMin: string; discountMax: string
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

type Patient = {
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

type AdditionalChargeTable = {
    id: number;
    additionalCharges: number;
    gst: number;
    description: string;
    subtTotalCharges: number
}

type transactionTableData = {
    pk : number;
    amount : number;
    comments : string;
    createdAt : string;
    updatedAt : string;
    payment_type : string;
    trans_type : string
}

interface BillingState {
    subTotalPrice: number;
    balanceRemaining: number;
    totalBillingAmount: number;
    totalAdditionalCharges: number;
    isDisabled: boolean;
    patientSelected: Patient | null;
    referredDoctor: ReferrenceType | null;
    testTableData: TestTable[];
    additionalChargeTable : AdditionalChargeTable[];
    transactionTableData : transactionTableData[];
    invoicePk : number;

    updateState: (partial: Partial<BillingState>) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
    subTotalPrice: 0,
    balanceRemaining: 0,
    totalBillingAmount: 0,
    totalAdditionalCharges: 0,
    isDisabled: false,
    patientSelected: null,
    referredDoctor: null,
    testTableData: [],
    additionalChargeTable : [],
    transactionTableData : [],
    invoicePk : 0,

    updateState: (partial) => set(partial),
}));