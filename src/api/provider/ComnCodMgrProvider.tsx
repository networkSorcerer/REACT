import { FC, createContext, useState } from 'react';

interface Context {
    searchKeyword: object;
    setSearchKeyword: (keyword: object) => void;
}

const defaultValue: Context = {
    searchKeyword: {},
    setSearchKeyword: () => {},
};

export const ConmCodContext = createContext(defaultValue);//전역변수처럼 사용할수 있다 
//FC : 함수형 컴포넌트 정의 할때 사용된다 
export const ConmCodProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    return <ConmCodContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</ConmCodContext.Provider>;
};