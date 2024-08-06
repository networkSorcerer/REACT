import { useContext, useState } from "react"
import { SupplySearchStyled } from "./styled"
import { SupplyContext } from "../../../../pages/Supply"
import { Button } from "../../../common/Button/Button";

export const SupplySearch = () =>{
    const {setSearchKeyword} = useContext(SupplyContext);
    const [input, setInput] = useState<{// 기존의 공통 코드와 다른 내용이다 
        condition : number;
        searchTitle : string;
    }>({
        condition: 0,
        searchTitle : '' 
    });

    const handlerSearch = () => {
        setSearchKeyword(input)
    }
    return (// 백단에 조금 다른 내용이 있어서 수정함 (원래는 item_name을 검색해야 함)
    <>
        <SupplySearchStyled>
            <select onChange={(e) => setInput({...input, condition : parseInt(e.currentTarget.value)})}>
                <option value = {0}>납품업체 명</option>
                <option value = {1} >제품 명</option> 
            </select>
            <input onChange={(e) => setInput({...input, searchTitle: e.target.value})}></input>
            <Button paddingtop={5} paddingbottom={5} onClick={handlerSearch}>
                검색
            </Button>
        </SupplySearchStyled>
    </>)
}