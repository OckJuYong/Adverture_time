import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import styles from "./myguide.module.css";

import backBtn from '../logininput/back.png';
import Footer from '../footer/footer';
import user from './user.jpeg';

import ENFJ from"../img2/ENFJ 시드니 (1).png"
import ENFP from '../img2/ENFP 바르셀로나 (1).png';
import ENTJ from '../img2/ENTJ 뉴욕 (1).png';
import ENTP from '../img2/ENTP 런던 (1).png';
import ESFJ from '../img2/ESFJ 라스베이거스 (1).png';
import ESFP from '../img2/ESFP 암스테르담 (1).png';
import ESTJ from '../img2/ESTJ 서울 (1).png';
import ESTP from '../img2/ESFP 암스테르담 (1).png';
import INFJ from '../img2/INFJ 센프란시스코 (1).png'
import INFP from '../img2/INFP 파리 (1).png';
import INTJ from '../img2/INTJ 싱가포르 (1).png';
import INTP from '../img2/INTP 베를린 (1).png';
import ISFJ from '../img2/ISFJ 교토 (1).png';
import ISFP from '../img2/ISFP 리우데자네이루 (1).png';
import ISTJ from '../img2/ISTJ 도쿄 (1).png';
import ISTP from '../img2/ISTP 부다페스트 (1).png';

const mbtiImages = {
    ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP,
    INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP
};

function MyGuides() {
    const [myGuides, setMyGuides] = useState([]);

    useEffect(() => {
        const fetchMyGuides = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const config = {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    }
                };

                const response = await axios.get('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/cart/reading/purchase-status?purchaseStatus=purchaseCompleted', config);
                console.log(response.data)
                setMyGuides(response.data);
            } catch (error) {
                console.error('Error fetching my guides:', error);
                alert('가이드 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchMyGuides();
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 가이드 {myGuides.length}개</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {myGuides.length > 0 ? (
                myGuides.map((guide) => (
                    <div key={guide.guideProposalDto.guideProposalId} className={styles.selectedMateInfo}>
                        <div className={styles.chat_container}>
                            <p className={styles.goal}>{guide.guideProposalDto.goal}</p>
                            <p className={styles.myname}>{guide.guideProposalDto.guideDto.name} GUIDE</p>
                            <p className={styles.date1}> {new Date(guide.guideProposalDto.travelStartDate).toLocaleDateString()}~</p>
                            <p className={styles.date2}>{new Date(guide.guideProposalDto.travelEndDate).toLocaleDateString()}</p>
                            <p>Schedule: {guide.guideProposalDto.schedule}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>등록된 가이드가 없습니다.</p>
            )}
        </div>
    );
}

function MyCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const config = {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const response = await axios.get(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/cart/reading/all`, config);
                setCartItems(response.data);
                console.log('Cart items:', response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                alert('카트 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchCartItems();
    }, []);

    const handlePayment = async (guideProposalId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/cart/purchase-product`, 
                { 
                    guideProposalId: guideProposalId 
                },
                config
            );

            if (response.status === 200) {
                alert('결제가 성공적으로 완료되었습니다.');
                setCartItems(prevItems => prevItems.filter(item => item.guideProposalDto.guideProposalId !== guideProposalId));
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 카트 {cartItems.length}개</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.cartId} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container}>
                            <p className={styles.goal}>{item.guideProposalDto.goal}</p>
                            <p className={styles.myname}>{item.guideProposalDto.guideDto.name} GUIDE</p>
                            <p className={styles.price}>{item.guideProposalDto.price}원</p>
                            {item.guideProposalDto.purchaseStatus === "waitingForPayment" && (
                                <button 
                                    className={styles.paymentButton} 
                                    onClick={() => handlePayment(item.guideProposalDto.guideProposalId)}
                                >
                                    결제하기
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>카트가 비어있습니다.</p>
            )}
        </div>
    );
}

function MyTravelers() {
    const [myTravelers, setMyTravelers] = useState([]);

    useEffect(() => {
        const fetchTravelers = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const config = {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const response = await axios.get(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/reading/purchase-status?purchaseStatus=waitingForDecision`, config);
                setMyTravelers(response.data);
                console.log('Travelers info:', response.data);
            } catch (error) {
                console.error('Error fetching travelers info:', error);
                alert('여행자 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchTravelers();
    }, []);

    const getGenderLabel = (gender) => {
        return gender === 'M' ? '남자' : gender === 'F' ? '여자' : '';
    };

    const handleAccept = async (guideProposalId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.patch(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/acceptance`, 
                { guideProposalId: guideProposalId }, 
                config
            );

            if (response.status === 200) {
                alert('가이드 제안을 수락했습니다.');
                setMyTravelers(prevTravelers => prevTravelers.filter(traveler => traveler.guideProposalId !== guideProposalId));
            }
        } catch (error) {
            console.error('Error accepting guide proposal:', error);
            alert('가이드 제안을 수락하는 데 실패했습니다.');
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 여행자 {myTravelers.length}명</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {myTravelers.length > 0 ? (
                myTravelers.map((traveler) => (
                    <div key={traveler.guideProposalId} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container}>
                            <p className={styles.goal}>{traveler.goal}</p>
                            <p className={styles.userName2}>{traveler.purchaseTravelUserDto.name}</p>
                            <p className={styles.sex}>({getGenderLabel(traveler.purchaseTravelUserDto.gender)})</p>
                            <p className={styles.price1}>가격: {traveler.price}원</p>
                            <button 
                                className={styles.tru1} 
                                onClick={() => handleAccept(traveler.guideProposalId)}
                            >
                                수락
                            </button>
                            <button className={styles.fal1}>거절</button>
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>등록된 여행자가 없습니다.</p>
            )}
        </div>
    );
}

function GuideReviewModal({ isOpen, onClose, guide }) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);

    const handleRatingChange = (newRating) => {
      setRating(newRating);
    };

    if (!isOpen || !guide) return null;

    const handleReviewSubmit = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');

            const reviewData = {
                guideReviewDto: {
                    "comment": comment,
                    "rating": rating
                },
                guideProposalDto: {
                    guideProposalId: guide.guideProposalId
                }
            };

            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            };
            console.log(reviewData);

            const response = await axios.post(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/review/addition`, reviewData, config);
            console.log('Review submitted:', response.data);
            alert('리뷰가 성공적으로 제출되었습니다!');
            setComment("");
            setRating(0);
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('리뷰 제출 중 오류가 발생했습니다.');
            setComment("");
            setRating(0);
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.modalHeader}>
                    <h2>{guide.purchaseTravelUserDto.name}의 가이드 리뷰</h2>
                    <p>지역: {guide.area || '정보 없음'}</p>
                </div>
                <div className={styles.modalContent}>
                    <textarea
                        className={styles.textarea}
                        placeholder="리뷰를 작성하세요..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Rating
                        count={5}
                        value={rating}
                        onChange={handleRatingChange}
                        activeColor="#ffd700"
                        isHalf={true}
                        size={40}
                        style={{ fontSize: '200px' }}
                    />
                    <p>별점: {rating}</p>
                </div>
                <button className={styles.submitButton} onClick={handleReviewSubmit}>
                    가이드 리뷰하기
                </button>
            </div>
        </div>
    );
}
function ChatRoomList() {
    const [chatRooms, setChatRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [list, setList] = useState([]); // list 상태 추가

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const config = {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
    
                const response = await axios.get(`https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/reading/purchase-status?purchaseStatus=travelCompleted`, config);
                
                console.log('Fetched chat rooms:', response.data); // 데이터 확인을 위한 로그
    
                const guideProposalIds = response.data.map(room => room.guideProposalId);
                setList(guideProposalIds); // guideProposalId 값을 list에 저장
                setChatRooms(response.data);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };
    
        fetchChatRooms();
    }, []);

    const handleRoomSelect = (guide) => {
        setSelectedGuide(guide);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGuide(null);
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>가이드 리뷰 {chatRooms.length}개</p>
            </div>
            {chatRooms.length > 0 ? (
                chatRooms.map((room) => (
                    <div key={room.guideProposalId} className={styles.selectedMateInfo} onClick={() => handleRoomSelect(room)}>
                        <div className={styles.chat_container}>
                            <img src={user} className={styles.user}/>
                            <div className={styles.title_container}>
                                <p className={styles.userName}>{room.purchaseTravelUserDto.name}</p>
                                <p className={styles.userAddress}>지역: {room.area || '정보 없음'}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>가이드 리뷰가 없습니다.</p>
            )}

            {/* 모달 컴포넌트 렌더링 */}
            <GuideReviewModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                guide={selectedGuide} 
            />
        </div>
    );
}
function Manageguide() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myGuides');
    const [isGuide, setIsGuide] = useState(false);

    useEffect(() => {
        // 사용자의 역할을 확인하는 함수
        const checkUserRole = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                };
                const response = await axios.get('https://your-api-url.com/user-role', config);
                if (response.data.role === 'guide') {
                    setIsGuide(true);
                    navigate('/myguide');
                }
            } catch (error) {
                console.error('Error checking user role:', error);
            }
        };

        checkUserRole();
    }, [navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'myGuides':
                return <MyGuides />;
            case 'myCart':
                return <MyCart />;
            case 'myTravelers':
                return <MyTravelers />;
            case 'chatRooms':
                return <ChatRoomList />;
            default:
                return <MyGuides />;
        }
    };

    if (isGuide) {
        return null; // 가이드인 경우 이 컴포넌트는 렌더링하지 않음
    }

    return (
        <div className={styles.mainbox}>
            <header className={styles.header}>
                <img src={backBtn} className={styles.backButton} onClick={handleBack}/>
                <h1 className={styles.title}>가이드 관리</h1>
            </header>
            
            <nav className={styles.tabNav}>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'myGuides' ? styles.active : ''}`}
                    onClick={() => setActiveTab('myGuides')}
                >
                    내 가이드
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'myCart' ? styles.active : ''}`}
                    onClick={() => setActiveTab('myCart')}
                >
                    내 카트
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'myTravelers' ? styles.active : ''}`}
                    onClick={() => setActiveTab('myTravelers')}
                >
                    내 여행자
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'chatRooms' ? styles.active : ''}`}
                    onClick={() => setActiveTab('chatRooms')}
                >
                    가이드 리뷰
                </button>
            </nav>
            
            {renderContent()}

            <Footer />
        </div>
    );
}

export default Manageguide;
