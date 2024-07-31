import { useContext, useState } from 'react';
import { Button } from '../../../common/Button/Button';
import {ComnCodSearchStyled} from './styled';
import { ComnCodContext } from '../../../../pages/ComnCodMgr';


export interface Iinput {
    oname : string , sname : string
}

export const ComnCodSearch = () => {

    const {setSearchKeyword }= useContext(ComnCodContext);
    const [input, setInput] = useState<Iinput>({oname: '', sname:'',});

    const handlerSearch = () => {
        setSearchKeyword(input);
    }
    return(
    
    <ComnCodSearchStyled>
        <select onChange={(e)=> setInput({...input, oname: e.currentTarget.value})}>
            {/*...을쓰는 이유는 배열을 복제한 다음에 새로운 배열에
        넣을수 있다 주솟값을 변경하기에 용이하다  */}
                <option value={'grp_cod'}>그룹코드</option>
                <option value={'grp_cod_nm'}>그룹코드명</option>
            </select>
            <input onChange={(e) => setInput({...input, sname: e.target.value})}></input>
            <Button paddingtop={5} paddingbottom={5} onClick={handlerSearch}>
                검색
            </Button>
    </ComnCodSearchStyled>
    )
}