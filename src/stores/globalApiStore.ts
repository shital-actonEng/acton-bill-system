import { create } from 'zustand';

type Test = {
    pk: number;
    modality: string;
    body_part: string;
    protocol: string;
    price: string;
    deleted : boolean ;
    diagnostic_centre_fk: string;
    meta_details: {
        gst: string;
        discount_min_range: string;
        discount_max_range: string;
        referrel_bonus: string;
        referrel_bonus_percentage: string;
    };
};

interface globalApi {
      globalTestData: Test[];
       updateApiState: (partial: Partial<globalApi>) => void;
}

export const useGlobalApiStore = create<globalApi>((set) => ({
     globalTestData : [] , 
      updateApiState: (partial) => set(partial),
}))

