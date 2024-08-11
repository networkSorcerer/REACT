import { ContentBox } from "../component/common/ContentBox/ContentBox"
import { ItemMain } from "../component/page/Item/ItemMain/ItemMain"
import { ItemSearch } from "../component/page/Item/ItemSearch/ItemSearch"

export const Product = () => {
    return(
        <>
        <ContentBox>제품</ContentBox>
        <ItemSearch></ItemSearch>
        <ItemMain></ItemMain>
        </>
    )
}