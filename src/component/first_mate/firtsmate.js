import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./firstemate.module.css";
import permainstyle from "../personapage/permain.module.css";
import axios from 'axios';
import mate from "./Vector.png";
import Footer from '../footer/footer';
import search from "./Group.png";

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

import ENFJ1 from"../img2/ENFJ 시드니 (1).png";
import ENFP1 from '../img2/ENFP 바르셀로나 (1).png';
import ENTJ1 from '../img2/ENTJ 뉴욕 (1).png';
import ENTP1 from '../img2/ENTP 런던 (1).png';
import ESFJ1 from '../img2/ESFJ 라스베이거스 (1).png';
import ESFP1 from '../img2/ESFP 암스테르담 (1).png';
import ESTJ1 from '../img2/ESTJ 서울 (1).png';
import ESTP1 from '../img2/ESFP 암스테르담 (1).png';
import INFJ1 from '../img2/INFJ 센프란시스코 (1).png';
import INFP1 from '../img2/INFP 파리 (1).png';
import INTJ1 from '../img2/INTJ 싱가포르 (1).png';
import INTP1 from '../img2/INTP 베를린 (1).png';
import ISFJ1 from '../img2/ISFJ 교토 (1).png';
import ISFP1 from '../img2/ISFP 리우데자네이루 (1).png';
import ISTJ1 from '../img2/ISTJ 도쿄 (1).png';
import ISTP1 from '../img2/ISTP 부다페스트 (1).png';

const Modal = ({ isOpen, onClose, guide }) => {
    if (!isOpen || !guide) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{guide.area} 여행</h2>
                <p>목표: {guide.goal}</p>
                <p>시작일: {new Date(guide.travelStartDate).toLocaleString()}</p>
                <p>종료일: {new Date(guide.travelEndDate).toLocaleString()}</p>
                <p>일정: {guide.schedule}</p>
                <p>가격: {guide.price}원</p>
                <p>가이드: {guide.guideDto?.name || '알 수 없음'}</p>
                <p>가이드 평점: {guide.guideDto?.rating || 'N/A'}</p>
                <p>가이드 연령: {guide.guideDto?.age || 'N/A'}</p>
                <p>설명: {guide.description || '없음'}</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

function Firstmatepage() {
    const mbtiImages = {
        ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP,
        INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP
    };
    const mbtiImages1 = {
        ENFJ1, ENFP1, ENTJ1, ENTP1, ESFJ1, ESFP1, ESTJ1, ESTP1,
        INFJ1, INFP1, INTJ1, INTP1, ISFJ1, ISFP1, ISTJ1, ISTP1
    };

    const mbtiToCityMap = {
        ENFJ: "시드니", ENFP: "바르셀로나", ENTJ: "뉴욕", ENTP: "런던",
        ESFJ: "라스베이거스", ESFP: "암스테르담", ESTJ: "서울", ESTP: "홍콩",
        INFJ: "샌프란시스코", INFP: "파리", INTJ: "싱가포르", INTP: "베를린",
        ISFJ: "교토", ISFP: "리우데자네이루", ISTJ: "도쿄", ISTP: "부다페스트"
    };

    const mbtiColors = {
        ENFJ: { background: '#B1E8ED', textBackground: '#076D91' },
        ENFP: { background: '#F8E8BC', textBackground: '#E66027' },
        ENTJ: { background: '#EAE1BF', textBackground: '#B65025' },
        ENTP: { background: '#E4D8C9', textBackground: '#665049' },
        ESFJ: { background: '#C9E7F2', textBackground: '#003A87' },
        ESFP: { background: '#FDEBE7', textBackground: '#FF957E' },
        ESTJ: { background: '#F6EBDA', textBackground: '#DC4432' },
        ESTP: { background: '#D7DFE5', textBackground: '#174A87' },
        INFJ: { background: '#C4BBB6', textBackground: '#814722' },
        INFP: { background: '#FFDCD4', textBackground: '#F47046' },
        INTJ: { background: '#E1EFE8', textBackground: '#367B90' },
        INTP: { background: '#D1C6BF', textBackground: '#603B3D' },
        ISFJ: { background: '#FCDEC7', textBackground: '#4F556D' },
        ISFP: { background: '#FFD4AE', textBackground: '#F03526' },
        ISTJ: { background: '#DBCBB9', textBackground: '#6D6060' },
        ISTP: { background: '#F5EBCF', textBackground: '#037D68' }
    };

    const [isOn, setIsOn] = useState(false);
    const [isGuidePage, setIsGuidePage] = useState(false);
    const navigate = useNavigate();
    const [myMates, setMyMates] = useState([]);
    const [personaData, setPersonaData] = useState(null);
    const [list, setList] = useState([]);
    const [selectedMate, setSelectedMate] = useState(null);
    const [selfData, setSelfData] = useState(null);
    const [selectedMateMBTI, setSelectedMateMBTI] = useState(null);

    const [guides, setGuides] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);

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

                const response = await axios.post(`https://seominjae.duckdns.org/getlist/friends/${memberId}/`, list, {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                setPersonaData(response.data);
                setSelfData(response.data.self);
            } catch (error) {
                console.error('Error fetching persona data:', error);
            }
        };

        if (list.list && list.list.length > 0) {
            fetchPersonaData();
        }
    }, [list]);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const config = {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };

                const response = await axios.get('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/reading/all', config);
                setGuides(response.data);
            } catch (error) {
                console.error('Error fetching guides:', error);
            }
        };
        
        fetchGuides();
    }, []);

    const handleToggle = () => {
        setIsOn(!isOn);
        setIsGuidePage(!isGuidePage);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        fetchGuidesByArea(event.target.value);
    };

    const fetchGuidesByArea = async (area) => {
        try {
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get(
                `https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/reading/guide-proposal/recommend?area=${encodeURIComponent(area)}`,
                config
            );

            setGuides(response.data);
        } catch (error) {
            console.error('Error fetching guides:', error);
        }
    };

    const mate_travel = () => {
        navigate("/nextpage");
    }

    const create_guide = () => {
        navigate("/createguide");
    }

    const manageMate = () => {
        if (isGuidePage) {
            navigate("/myguide");
        } else {
            navigate("/Managematepage");
        }
    };

    const handleMateClick = (friendTravelUserId) => {
        if (personaData && personaData.list) {
            const selected = personaData.list.find(mate => mate.travel_user_id === friendTravelUserId);
            if (selected) {
                setSelectedMate(selected);
                setSelectedMateMBTI(selected.tendency);
            }
        }
    };

    const renderMBTIImage = (mbti) => {
        const { background } = mbtiColors[mbti] || { background: '#fff' };
    
        return (
            <div 
                style={{ backgroundColor: background, padding: '10px', borderRadius: '8px', display: 'inline-block' }}
            >
                <img 
                    src={mbtiImages[mbti]} 
                    alt={`${mbti} image`} 
                    className={permainstyle.perimg1}
                    style={{ display: 'block', width: '100%', borderRadius: '8px' }}
                />
            </div>
        );
    };

    const renderCompatibility = (compatibility, selfData, selectedMate) => {
        if (!selfData || !selectedMate) {
            return null;
        }

        const selfMbtiColors = mbtiColors[selfData.tendency] || { textBackground: '#000' };
        const mateMbtiColors = mbtiColors[selectedMate.tendency] || { textBackground: '#000' };

        return (
            <div className={permainstyle.userstatedistrict}>
                <p className={permainstyle.compat}>궁합</p>
                <p className={permainstyle.percent}>{compatibility}%</p>
                
                <div 
                    className={permainstyle.imgtext} 
                    style={{ backgroundColor: selfMbtiColors.textBackground }}
                >
                    <p style={{ color: '#fff', fontWeight: 'bold', margin: '0' }}>{selfData.name}</p>
                    <p className={permainstyle.boxtext} style={{ color: '#fff', margin: '0' }}>{mbtiToCityMap[selfData.tendency]}</p>
                </div>

                <div 
                    className={permainstyle.imgtext2} 
                    style={{ backgroundColor: mateMbtiColors.textBackground }}
                >
                    <p style={{ color: '#fff', fontWeight: 'bold', margin: '0' }}>{selectedMate.name}</p>
                    <p className={permainstyle.boxtext} style={{ color: '#fff', margin: '0' }}>{mbtiToCityMap[selectedMate.tendency]}</p>
                </div>
            </div>
        );
    };

    const renderPersonalityBars = (data, side) => {
        const mbtiColor = mbtiColors[data.tendency] || { textBackground: '#000' };
        return (
            <div className={permainstyle[`userinfocontainer${side}`]}>
                <div className={permainstyle.infobox1}>
                    <p className={permainstyle.userinfotext}>모험</p>
                    <div className={permainstyle.userinfobox}>
                        <div  style={{width: `${data.ei}%`, backgroundColor: mbtiColor.textBackground, height: '100%', borderRadius: '2vw' }}></div>
                    </div>
                </div>
                <div className={permainstyle.infobox2}>
                    <p className={permainstyle.userinfotext}>경험</p>
                    <div className={permainstyle.userinfobox}>
                        <div style={{width: `${data.sn}%`, backgroundColor: mbtiColor.textBackground, height: '100%', borderRadius: '2vw' }}></div>
                        </div>
                </div>
                <div className={permainstyle.infobox3}>
                    <p className={permainstyle.userinfotext}>즉흥</p>
                    <div className={permainstyle.userinfobox}>
                        <div style={{width: `${data.ft}%`, backgroundColor: mbtiColor.textBackground, height: '100%',borderRadius: '2vw' }}></div>
                    </div>
                </div>
                <div className={permainstyle.infobox4}>
                    <p className={permainstyle.userinfotext}>사교</p>
                    <div className={permainstyle.userinfobox}>
                        <div style={{width: `${data.pj}%`, backgroundColor: mbtiColor.textBackground, height: '100%', borderRadius: '2vw' }}></div>
                    </div>
                </div>
            </div>
        );
    };

    const addToCart = async (guideProposalId) => {
        try {
            const response = await axios.post('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/cart/add-product', {
                guideProposalId: guideProposalId
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
        
            if (response.status === 204 || response.status === 200) {
                alert('장바구니에 추가되었습니다.');
            } else {
                alert('장바구니 추가에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);
                console.log('Error status:', error.response.status);
            }
            alert('장바구니 추가 중 오류가 발생했습니다.');
        }
    };

    const fetchGuideDetails = async (guideId) => {
        try {
            const response = await axios.get(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/reading/${guideId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Guide details:', response.data);
            setSelectedGuide(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching guide details:', error);
            alert('가이드 정보를 불러오는 데 실패했습니다.');
        }
    };

    return (
        <div className={styles.containerWrapper}>
            <div className={styles.container}>
                <div className={styles.mainbox}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>여행 {isGuidePage ? '가이드' : '메이트'}</h1>
                        
                        <div className={styles.togglebutton} onClick={handleToggle}>
                            <div className={`${styles.toggleoption} ${!isOn ? styles.active : ''}`}>
                                <p className={styles.text1}>메이트</p>
                            </div>
                            <div className={`${styles.toggleoption} ${isOn ? styles.active : ''}`}>
                                <p className={styles.text2}>가이드</p>
                            </div>
                            <div className={`${styles.togglecircle} ${isOn ? styles.on : styles.off}`}></div>
                        </div>
                    </div>

                    <div className={styles.subHeader}>
                        {isGuidePage ? (
                            <div className={styles.searchContainer}>
                                <img src={search} alt="Search" className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요..."
                                    className={styles.searchInput}
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        ) : (
                            <div>
                                {myMates.length > 0 ? (
                                    myMates.map((mate) => (
                                        <div key={mate.id}>
                                            <div 
                                                className={styles.header_container}
                                                onClick={() => handleMateClick(mate.friendTravelUserId)}
                                            >
                                                {personaData && personaData.list && (
                                                    <img 
                                                        src={mbtiImages1[personaData.list.find(p => p.travel_user_id === mate.friendTravelUserId)?.tendency + '1']}
                                                        alt={`${mate.friendTravelUserDto.name} MBTI`}
                                                        className={styles.mateImage}
                                                    />
                                                )}
                                                <p>{mate.friendTravelUserDto.name}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : <p className={styles.noMateText}>메이트가 아직 없습니다.</p>}
                            </div>
                        )}
                        <div className={styles.mateManageIconContainer} onClick={manageMate}>
                            <div className={styles.mateManageCircle}>
                                <img src={mate} alt={`${isGuidePage ? '가이드' : '메이트'} 관리 아이콘`} className={styles.img} />
                            </div>
                            <div className={styles.mateManageIcon}>
                                {isGuidePage ? '가이드' : '메이트'} 관리
                            </div>
                        </div>
                    </div>
                    <div className={styles.divider}></div>

                    {isGuidePage ? (
                        <div className={styles.guideContent}>
                            {guides.length > 0 ? (
                                guides.map((guide) => (
                                    <div 
                                        key={guide.guideProposalId} 
                                        className={styles.guideBox}
                                        onClick={() => fetchGuideDetails(guide.guideProposalId)}
                                    >
                                        <h3 className={styles.traveltitle}>{guide.area}여행</h3>
                                        <p>{new Date(guide.travelStartDate).toLocaleDateString()} - {new Date(guide.travelEndDate).toLocaleDateString()}</p>
                                        <p>{new Date(guide.travelStartDate).toLocaleTimeString()} - {new Date(guide.travelEndDate).toLocaleTimeString()}</p>
                                        <p className={styles.p1}> {guide.purchaseTravelUserDto?.name || '알 수 없음'} 가이드</p>
                                        <button 
                                            className={styles.addToCartButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(guide.guideProposalId);
                                            }}
                                        >
                                            장바구니 담기
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noGuideText}>가이드를 추가해주세요.</p>
                            )}
                        </div>
                    ) : (
                        myMates.length > 0 && selectedMate && selfData ? (
                            <div className={permainstyle.permaincontainer}>
                                {renderMBTIImage(selectedMateMBTI)}
                                <p className={permainstyle.name}>{selectedMate.name}</p>
                                <p className={permainstyle.mbtiText}>{selectedMateMBTI}</p>
                                <p className={permainstyle.city}>{mbtiToCityMap[selectedMateMBTI]}</p>
                                {renderCompatibility(selectedMate.compatibility, selfData, selectedMate)}
                                {renderPersonalityBars(selectedMate, 'Left')}
                                {renderPersonalityBars(selfData, 'Right')}
                            </div>
                        ) : (
                            <div className={styles.content}>
                                <p className={styles.createMateText}>메이트를 선택하세요.</p>
                            </div>
                        )
                    )}

                    <button 
                        className={styles.createTripButton} 
                        onClick={isGuidePage ? create_guide : mate_travel}
                    >
                        {isGuidePage ? "가이드 만들기" : "여행 만들기"}
                    </button>
                </div>
                <Footer />
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                guide={selectedGuide} 
            />
        </div>
    );
}

export default Firstmatepage;