import React, { useEffect, useRef } from 'react';

interface KakaoMapProps {
    center: { lat: number; lng: number }; // 중심 좌표
    level?: number; // 지도의 확대 수준
}
const center = { lat: 37.5665, lng: 126.978 }; // 예시: 서울의 위도와 경도
const KakaoMap: React.FC<KakaoMapProps> = ({ center, level = 3 }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const initializeMap = () => {
            if (mapContainerRef.current) {
                const { kakao } = window;

                // 지도의 옵션 설정
                const mapOptions = {
                    center: new kakao.maps.LatLng(center.lat, center.lng), // 중심 좌표
                    level: level, // 확대 수준
                };

                // 지도를 생성합니다
                const map = new kakao.maps.Map(mapContainerRef.current, mapOptions);

                // 지도에 마커 추가 (선택 사항)
                const marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(center.lat, center.lng),
                });
                marker.setMap(map);
            }
        };

        // 카카오 맵 API 스크립트가 이미 로드되었는지 확인
        if (!window.kakao || !window.kakao.maps) {
            // 스크립트 동적 추가
            const script = document.createElement('script');
            script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=d2a1da46b234959daf8cd1cb07af9452'; // 자신의 APP_KEY로 교체
            script.async = true;
            script.onload = initializeMap;
            document.body.appendChild(script);
        } else {
            initializeMap();
        }

        // Cleanup 함수: 스크립트 제거
        return () => {
            const script = document.querySelector(`script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=d2a1da46b234959daf8cd1cb07af9452"]`);
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [center, level]);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default KakaoMap;
