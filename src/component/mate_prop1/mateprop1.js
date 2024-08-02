import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from "./mateprop.module.css";
import { useSwipeable } from 'react-swipeable';

import ENFJ from '../Img/ENFJ 시드니.png';
// B1E8ED 076D91
import ENFP from '../Img/ENFP 바르셀로나.png';
// F8E8BC E66027
import ENTJ from '../Img/ENTJ 뉴욕.png';
// EAE1BF B65025
import ENTP from '../Img/ENTP 런던.png';
// E4D8C9 665049
import ESFJ from '../Img/ESFJ 라스베이거스.png';
// C9E7F2 003A87
import ESFP from '../Img/ESFP 암스테르담.png';
// FDEBE7 FF957E
import ESTJ from '../Img/ESTJ 서울.png';
// F6EBDA DC4432
import ESTP from '../Img/ESTP 홍콩.png';
// D7DFE5 174A87
import INFJ from '../Img/INFJ 센프란시스코.png';
// C4BBB6 814722
import INFP from '../Img/INFP 파리.png';
// FFDCD4 F47046
import INTJ from '../Img/INTJ 싱가포르.png';
// E1EFE8 367B90
import INTP from '../Img/INTP 베를린.png';
// D1C6BF 603B3D
import ISFJ from '../Img/ISFJ 교토.png';
// FCDEC7 4F556D
import ISFP from '../Img/ISFP 리우데자네이루.png';
// FFD4AE F03526
import ISTJ from '../Img/ISTJ 도쿄.png';
// DBCBB9 6D6060
import ISTP from '../Img/ISTP 부다페스트.png';
// F5EBCF 037D68

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
                console.log(response.data);

                const travelUserIds = response.data.map(mate => mate.friendTravelUserId);
                const travelUserIdsObject = { list: travelUserIds };

                console.log(JSON.stringify(travelUserIdsObject));
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

                const response = await axios.post(`http://43.202.121.14:8000/getlist/no-friends/${memberId}/`, list, {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log('Persona data:', response.data);
                setPersonaData(response.data);

                // 여기서 받아온 데이터를 slides 형식에 맞게 변환
                const newSlides = response.data.list.map(item => ({
                    percentage: item.compatibility,
                    name: item.tendency,
                    location: `Travel User ID: ${item.travel_user_id}`,
                    travelUserId: item.travel_user_id,
                    ei: item.ei,
                    sn: item.sn,
                    ft: item.ft,
                    pj: item.pj
                }));
                setSlides(newSlides);
            } catch (error) {
                console.error('Error fetching persona data:', error);
                console.log(list);
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
        const selectedSlide = slides[index1];
        const jwtToken = localStorage.getItem('jwtToken');
        const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');
    
        const config = {
            withCredentials: true,
            headers: {
                'jwtToken': jwtToken,
                'jwtRefreshToken': jwtRefreshToken
            }
        };
    
        try {
            const response = await axios.post('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/additional', {
                friendTravelUserId: selectedSlide.travelUserId
            }, config);
            console.log('Propose response:', response.data);
            alert('친구 요청이 성공적으로 전송되었습니다!');
            navigate("/Managematepage");
        } catch (error) {
            console.error('Error proposing:', error);
            console.log(selectedSlide.travelUserId);
            alert('친구 요청 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
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