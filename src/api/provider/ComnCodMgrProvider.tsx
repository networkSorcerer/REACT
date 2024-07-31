import React, { createContext, FC, useState, ReactNode } from 'react';

// Context 타입 정의
interface Context {
    searchKeyword: string; // 예시로 문자열로 변경, 필요에 따라 변경
    setSearchKeyword: (keyword: string) => void; // 예시로 문자열로 변경, 필요에 따라 변경
}

// 기본값 설정
const defaultValue: Context = {
    searchKeyword: '',
    setSearchKeyword: () => {},
};

// Context 생성
export const ComnCodContext = createContext<Context>(defaultValue);

// Provider 컴포넌트 정의
export const ComnCodProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // 예시로 문자열로 변경, 필요에 따라 변경

    return (
        <ComnCodContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ComnCodContext.Provider>
    );
};
