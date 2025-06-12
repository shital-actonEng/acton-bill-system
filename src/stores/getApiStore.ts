import { getModalities } from '@/express-api/modalities/page';
import { create } from 'zustand';

type Store = {
    modalitiesData: any[],
    fetchModalitiesData: () => Promise<void>;
}

export const useGetApiStore = create<Store>()(
    // persist(
        (set, get) => ({
            modalitiesData: [],
            fetchModalitiesData: async () => {
        if (get().modalitiesData.length > 0) return; // already loaded
        const data = await getModalities();
        set({ modalitiesData: data });
        console.log("fetched data in store..." , data);
      },
        }),
    //     {
    //         name: "fetchApiData"
    //     }
    // ),
)