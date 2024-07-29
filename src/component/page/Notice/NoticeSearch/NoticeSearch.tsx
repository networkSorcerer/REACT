import { useRef, useState } from "react";
import { Button } from "../../../common/Button/Button";
import { NoticeSearchStyled } from "./styled"
import { useNavigate } from "react-router-dom";

export const NoticeSearch = () => {
    const [startDate, setStartDate] = useState<string>(); //useState같은 경우는 값이 바뀔때 마다 rendering이 된다 
    const [endDate, setEndDate] = useState<string>();
    const title = useRef<HTMLInputElement>(null); // useRef는 필요할때만 rendering이 된다 
    const navigete = useNavigate();

    const handlerSearch = () => {
        //검색 버튼을 누르면 , 조회가 된다 .
        //query param 을 활용해서 데이터를 url에 저장하고 활용
        const query: string[] = [];//query라는 함수고 string만 받는 배열을 만들었다 string 말고 다른 값이 들어가면 error뜸

        
        !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
        !startDate || query.push(`startDate =${startDate}`);
        !endDate || query.push(`endDate =${endDate}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';
        navigete(`/react/board/notice.do${queryString}`);

        console.log(startDate, endDate);
        console.log(title.current?.value);
    };


    return (
        <>
            <NoticeSearchStyled>
                <input ref={title}></input>
                <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
                <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
            <Button onClick={handlerSearch}>검색</Button>
            <Button onClick={handlerSearch}>등록</Button>
            </NoticeSearchStyled>
            
        </>
    );
};