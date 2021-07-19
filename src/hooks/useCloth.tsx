import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type Cloth = {
    id: number;
    nome: string;
    colecao: number;
    quantidade: number;
    tamanho: number;
}

type Stock = {
    id: number;
    quantidade: number
}

type ClothProviderProps = {
    children: ReactNode;
}

type ClothInput = Omit<Cloth, 'id'>

type ClothContextData = {
    cloths: Cloth[];
    stocks: Stock[];
    createCloth: (cloth: ClothInput, stock: Stock) => Promise<void>;
}

const ClothContext = createContext<ClothContextData>(
    {} as ClothContextData
);

export function ClothProvider({ children }: ClothProviderProps) {
    const [cloths, setCloths] = useState([]);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        api.get("/roupas").then((response) => setCloths(response.data));
        api.get("/stock").then((response) => setStocks(response.data));
    }, []);

    async function createCloth(clothing: ClothInput, clothInStock: Stock) {
        const clothData = await api.post("/roupas", clothing);
        const stockData = await api.post("/stock", clothInStock);
        setCloths([
            ...cloths,
            clothData.data,
        ]);

        setStocks([
            ...stocks,
            stockData.data,
        ])
    }

    return (
        <ClothContext.Provider value={{ cloths, stocks, createCloth }}>
            {children}
        </ClothContext.Provider>
    )
}

export function useCloth() {
    const context = useContext(ClothContext);

    return context;
}