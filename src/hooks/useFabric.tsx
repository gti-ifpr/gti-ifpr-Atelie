import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

type Fabric = {
    id: number;
    nome: string;
    fabricante: string;
    referenciaDoFabricante: string;
    largura: number;
}

type FabricStock = {
    id: number;
    quantidade: number
}

type FabricProviderProps = {
    children: ReactNode;
}

type FabricInput = Omit<Fabric, 'id'>

type FabricStockInput = Omit<FabricStock, 'id'>

type updateFabricInStock = {
    stockId: number;
    amount: number;
}

type FabricContextData = {
    fabrics: Fabric[];
    fabricStocks: FabricStock[];
    createFabric: (fabricInput: FabricInput, fabricInStock: FabricStockInput) => Promise<void>;
    updateFabricInStock: ({ stockId, amount }: updateFabricInStock) => void;
}

const FabricContext = createContext<FabricContextData>(
    {} as FabricContextData
);

export function FabricProvider({ children }: FabricProviderProps) {
    const [fabrics, setFabrics] = useState([]);
    const [fabricStocks, setFabricStocks] = useState([]);

    useEffect(() => {
        api.get("/tecidos").then((response) => setFabrics(response.data));
        api.get("/estoque_de_tecidos").then((response) => setFabricStocks(response.data));
    }, []);

    async function createFabric(fabricInput: FabricInput, fabricInStock: FabricStockInput) {
        const clothData = await api.post("/tecidos", fabricInput);
        const stockData = await api.post("/estoque_de_tecidos", fabricInStock);

        setFabrics([
            ...fabrics,
            clothData.data,
        ]);

        setFabricStocks([
            ...fabricStocks,
            stockData.data,
        ])
    }

    async function updateFabricInStock({ stockId, amount }: updateFabricInStock) {
        try {
            const updatedStock = [...fabricStocks]

            const stockExists = updatedStock.find(stock => stock.id === stockId);
            if (amount < 0) {
                toast.error("Não é possível possuir menos de 0 em estoque");
                return;
            }

            if (stockExists) {
                stockExists.quantidade = amount
                setFabricStocks(updatedStock)

                await api.put(`/estoque_de_tecidos/${stockId}`, { quantidade: amount });
            } else {
                throw Error;
            }
        } catch {
            toast.error('Erro na atualização de estoque');
        }
    }

    return (
        <FabricContext.Provider value={{ createFabric, fabrics, fabricStocks, updateFabricInStock }}>
            {children}
        </FabricContext.Provider>
    )
}

export function useFabric() {
    const context = useContext(FabricContext);

    return context;
}