import Head from "next/head";
import { useEffect, FunctionComponent, useState } from "react";
import { ClothingCollectionHeader } from "../../components/ClothingCollection/ClothingCollectionHeader/clothingCollectionHeader";
import { useCloth } from "../../hooks/useCloth";
import { useFilterClothByCollection } from "../../hooks/useFilterClothByCollection";

import styles from './styles.module.scss'

type Cloth = {
    id: number;
    nome: string;
    colecao: number
}

const ClothRow: FunctionComponent<{ cloth: Cloth }> = ({
    cloth,
}) => {
    return (
        <div className={styles.card}>
            <p>{cloth.nome}</p>
        </div>
    );
};

export default function Stock() {
    const { cloths } = useCloth()
    const { filterClothByCollection, selectedClothingCollection } = useFilterClothByCollection()
    const [filteredCloths, setFilteredCloths] = useState<Cloth[]>([])



    useEffect(() => {
        setFilteredCloths(
            filterClothByCollection(cloths, selectedClothingCollection)
        )
    }, [selectedClothingCollection])

    return (
        <>
            <Head>
                <title>Estoque | Artha</title>
            </Head>

            <main className={styles.contentContainer}>
                <ClothingCollectionHeader />

                {selectedClothingCollection ?
                    filteredCloths.map(cloth => (
                        <ClothRow key={cloth.id} cloth={cloth} />
                    ))
                    :
                    cloths.map(cloth => (
                        <ClothRow key={cloth.id} cloth={cloth} />
                    ))
                }
            </main>
        </>
    );
}