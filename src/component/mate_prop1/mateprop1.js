import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from "./mateprop.module.css";
import { useSwipeable } from 'react-swipeable';

import ENFJ from '../Img/ENFJ 시드니.png';
import ENFP from '../Img/ENFP 바르셀로나.png';
import ENTJ from '../Img/ENTJ 뉴욕.png';
import ENTP from '../Img/ENTP 런던.png';
import ESFJ from '../Img/ESFJ 라스베이거스.png';
import ESFP from '../Img/ESFP 암스테르담.png';
import ESTJ from '../Img/ESTJ 서울.png';
import ESTP from '../Img/ESTP 홍콩.png';
import INFJ from '../Img/INFJ 센프란시스코.png';
import INFP from '../Img/INFP 파리.png';
import INTJ from '../Img/INTJ 싱가포르.png';
import INTP from '../Img/INTP 베를린.png';
import ISFJ from '../Img/ISFJ 교토.png';
import ISFP from '../Img/ISFP 리우데자네이루.png';
import ISTJ from '../Img/ISTJ 도쿄.png';
import ISTP from '../Img/ISTP 부다페스트.png';

function Mateprop1() {

    const mbtiImages = {
        ENFJ: ENFJ,
        ENFP: ENFP,
        ENTJ: ENTJ,
        ENTP: ENTP,
        ESFJ: ESFJ,
        ESFP: ESFP,
        ESTJ: ESTJ,
        ESTP: ESTP,
        INFJ: INFJ,
        INFP: INFP,
        INTJ: INTJ,
        INTP: INTP,
        ISFJ: ISFJ,
        ISFP: ISFP,
        ISTJ: ISTJ,
        ISTP: ISTP
    };

    const mbtiToCityMap = {
        ENFJ: "시드니",
        ENFP: "바르셀로나",
        ENTJ: "뉴욕",
        ENTP: "런던",
        ESFJ: "라스베이거스",
        ESFP: "암스테르담",
        ESTJ: "서울",
        ESTP: "홍콩",
        INFJ: "샌프란시스코",
        INFP: "파리",
        INTJ: "싱가포르",
        INTP: "베를린",
        ISFJ: "교토",
        ISFP: "리우데자네이루",
        ISTJ: "도쿄",
        ISTP: "부다페스트"
    };
    
    const [index1, setIndex1] = useState(0);
    const [slides, setSlides] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 페이지에서 넘어온 데이터를 받아옵니다.
    const travelData = location.state;

    // state 확인 로그 추가
    useEffect(() => {
        console.log("Received travelData:", travelData);
    }, [travelData]);

    const [myMates, setMyMates] = useState([]);
    const [personaData, setPersonaData] = useState(null);
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchMyMates = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

                const config = {
                    withCredentials: true,
                    headers: {
                        'Cookie': `jwtToken=${jwtToken}; jwtRefreshToken=${jwtRefreshToken}`
                    }
                };

                const response = await axios.get('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/friend-list', config);
                setMyMates(response.data);

                const travelUserIds = response.data.map(mate => mate.friendTravelUserId);
                const travelUserIdsObject = { list: travelUserIds };
                setList(travelUserIdsObject);
                
            } catch (error) {
                console.error('Error fetching my mates:', error);
            }
        };

        fetchMyMates();
    }, []);

    useEffect(() => {
        const fetchPersonaData = async () => {
            try {
                const memberId = localStorage.getItem('memberId');
                if (!memberId) {
                    console.error('memberId not found in localStorage');
                    return;
                }

                const response = await axios.post(`https://seominjae.duckdns.org/getlist/no-friends/${memberId}/`, list, {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setPersonaData(response.data);
                console.log(response.data);

                // 여기서 받아온 데이터를 slides 형식에 맞게 변환
                const newSlides = response.data.list.map(item => ({
                    percentage: item.compatibility,
                    name: item.tendency,
                    location: `Travel User ID: ${item.travel_user_id}`,
                    travelUserId: item.travel_user_id, // 제안할 유저 ID
                    ei: item.ei,
                    sn: item.sn,
                    ft: item.ft,
                    pj: item.pj
                }));
                setSlides(newSlides);
            } catch (error) {
                console.error('Error fetching persona data:', error);
            }
        };

        if (list.list && list.list.length > 0) {
            fetchPersonaData();
        }
    }, [list]);

    const handleSwipedLeft1 = () => {
        setIndex1((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handleSwipedRight1 = () => {
        setIndex1((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const handlers1 = useSwipeable({
        onSwipedLeft: handleSwipedLeft1,
        onSwipedRight: handleSwipedRight1,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const handlePrevious = () => {
        navigate(-1);
    };

    const handlePropose = async () => {
        const selectedSlide = slides[index1]; // 현재 선택된 슬라이드
        const jwtToken = localStorage.getItem('jwtToken');
        const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');
    
        const config = {
            withCredentials: true,
            headers: {
                'jwtToken': jwtToken,
                'jwtRefreshToken': jwtRefreshToken,
                'Content-Type': 'application/json',
            }
        };
    
        const payload = {
            offeredTravelUserId: selectedSlide.travelUserId, // 선택된 슬라이드에서 유저 ID 가져오기
            travel: {
                travelId: travelData.travelId,
                travelStartDate: travelData.travelStartDate,
                travelEndDate: travelData.travelEndDate,
                location: travelData.location,
                latitude: travelData.latitude,
                longitude: travelData.longitude,
                travelUserId: travelData.travelUserId,
                mateUserDto: null,
                travelRoute: travelData.travelRoute.map(route => ({
                    travelRouteId: route.travelRouteId,
                    travelId: route.travelId,
                    vertex: route.vertex,
                    latitude: route.latitude,
                    longitude: route.longitude
                }))
            }
        };
    
        console.log('Payload to be sent:', payload); // 전송할 데이터를 확인하는 로그
    
        try {
            const response = await axios.post('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/proposal/addition', payload, config);
            console.log('Propose response:', response.data);
            alert('여행 제안이 성공적으로 전송되었습니다!');
            navigate("/Managematepage");
        } catch (error) {
            console.error('Error proposing:', error);
            alert('여행 제안 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleFriendAdd = async (friendTravelUserId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

            const config = {
                withCredentials: true,
                headers: {
                    'jwtToken': jwtToken,
                    'jwtRefreshToken': jwtRefreshToken,
                    'Content-Type': 'application/json',
                }
            };

            const payload = { friendTravelUserId };

            const response = await axios.post('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/additional', payload, config);
            console.log('Friend request response:', response.data);
            alert('친구 요청이 성공적으로 전송되었습니다!');
        } catch (error) {
            console.error('Error sending friend request:', error.response.data);
            console.log(friendTravelUserId);
            alert(error.response.data);
        }
    };

    return (
        <div className={styles.containerWrapper}>
            <div className={styles.container}>
                <div className={styles.mainbox}>
                    <div className={styles.Crebackbuttons} onClick={handlePrevious}></div>
                    <h1 className={styles.title}>여행 생성</h1>
                    <p className={styles.subtitle}>함께 여행하고 싶은 메이트를 찾아 여행을 제안해요!</p>
                    
                    <div {...handlers1} className={styles.rcslider}>
                        <div 
                            className={styles.rcslidercontainer} 
                            style={{ transform: `translateX(calc(-${index1 * 25}% - ${index1 * 2}%))` }}
                        >
                            {slides.map((slide, index) => (
                                <div 
                                    key={index} 
                                    className={`${styles.rcslideritem} ${index === index1 ? styles.active : ''}`}
                                >
                                    <div className={styles.percentageCircle}>
                                        <span className={styles.percentageLabel}>여행 궁합</span>
                                        <span className={styles.percentage}>{slide.percentage}%</span>
                                    </div>
                                    <div className={styles.friend_plus} onClick={() => handleFriendAdd(slide.travelUserId)}>+</div>
                                    <img src={mbtiImages[slide.name]} alt={slide.name} className={styles.mbtiImage} />
                                    <h2 className={styles.slideName}>{mbtiToCityMap[slide.name]}형 페르소나</h2>
                                    <div className={styles.barGraph}>
                                        <div className={styles.bar} style={{height: `${slide.ei}%`}}></div>
                                        <div className={styles.bar} style={{height: `${slide.sn}%`}}></div>
                                        <div className={styles.bar} style={{height: `${slide.ft}%`}}></div>
                                        <div className={styles.bar} style={{height: `${slide.pj}%`}}></div>
                                    </div>
                                    <div className={styles.labels}>
                                        <span className={styles.atext}>모험</span>
                                        <span className={styles.atext}>경험</span>
                                        <span className={styles.atext}>즉흥</span>
                                        <span className={styles.atext}>사교</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className={styles.prevButton} onClick={handlePrevious}>이전</button>
                    <button className={styles.nextButton} onClick={handlePropose}>제안하기</button>
                </div>
            </div>
        </div>
    );
}

export default Mateprop1;
