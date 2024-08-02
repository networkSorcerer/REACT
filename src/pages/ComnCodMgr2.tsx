import { createContext, FC, useState } from "react";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ComnCodMgr2Main } from "../component/page/ComnCodMgr2/ComnCodMgr2Main/ComnCodMgr2Main";
import { ComnCodMgr2Search } from "../component/page/ComnCodMgr2/ComnCodMgr2Search/ComnCodMgr2Search";

interface Context {
    searchKeyword : object;
    setSearchKeyword : (keyword: object) => void;
}

const defaultValue : Context = {
    searchKeyword: {},
    setSearchKeyword : () => {},
}

export const ComnCodContext = createContext(defaultValue);
//createContext는 Provider를 사용할수 있게 해준다 하위 provider는 하위 컴포넌트에 컨텍스트 값을 제공한다

export const ComnCodProvider : FC<{children : React.ReactNode | React.ReactNode[]}>= ({children}) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    return <ComnCodContext.Provider value={{searchKeyword, setSearchKeyword}}>{children}</ComnCodContext.Provider>
};
export const ComnCodMgr2 = () => {
    return (
        <>
            <ComnCodProvider>
                <ContentBox>공통코드</ContentBox>
                <ComnCodMgr2Main></ComnCodMgr2Main>
                <ComnCodMgr2Search></ComnCodMgr2Search>
            </ComnCodProvider>            
        </>
    );
}
   

