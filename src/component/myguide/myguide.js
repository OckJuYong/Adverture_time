import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "./myguide.module.css";  // 새로운 CSS 모듈 파일을 만드세요

import backBtn from '../logininput/back.png';

import Footer from '../footer/footer';

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
        // 여기에 가이드 목록을 가져오는 API 호출 로직을 추가하세요
        // 예: const fetchMyGuides = async () => { ... };
        // fetchMyGuides();
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 가이드 {myGuides.length}개</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {myGuides.length > 0 ? (
                myGuides.map((guide) => (
                    <div key={guide.id} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container}>
                            <p className={styles.userName}>{guide.name}</p>
                            <p>{guide.location}</p>
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
        // 여기에 카트 아이템을 가져오는 API 호출 로직을 추가하세요
        // 예: const fetchCartItems = async () => { ... };
        // fetchCartItems();
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 카트 {cartItems.length}개</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.id} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container}>
                            <p className={styles.userName}>{item.name}</p>
                            <p>{item.description}</p>
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
        // 여기에 여행자 목록을 가져오는 API 호출 로직을 추가하세요
        // 예: const fetchMyTravelers = async () => { ... };
        // fetchMyTravelers();
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 여행자 {myTravelers.length}명</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {myTravelers.length > 0 ? (
                myTravelers.map((traveler) => (
                    <div key={traveler.id} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container}>
                            <p className={styles.userName}>{traveler.name}</p>
                            <p>{traveler.tripInfo}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>등록된 여행자가 없습니다.</p>
            )}
        </div>
    );
}

function ChatRoomList() {
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const config = {
                    withCredentials: true,
                    headers: {
                        'Cookie': `jwtToken=${jwtToken}`
                    }
                };

                const travelUserId = localStorage.getItem("memberId");

                const response = await axios.get(`https://port-0-travelproject-umnqdut2blqqevwyb.sel4.cloudtype.app/chat/rooms/?travel_user_id=${travelUserId}`, config);
                setChatRooms(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };

        fetchChatRooms();
    }, []);

    const handleRoomSelect = (roomId) => {
        navigate(`/chat-room/${roomId}`);
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>채팅방 {chatRooms.length}개</p>
            </div>
            {chatRooms.length > 0 ? (
                chatRooms.map((room) => {
                    const otherUser = room.users.find(user => user.travel_user_id !== parseInt(localStorage.getItem("memberId")));
                    const otherUserMBTI = localStorage.getItem(otherUser.travel_user_id);

                    return (
                        <div key={room.id} className={styles.selectedMateInfo} onClick={() => handleRoomSelect(room.id)}>
                            <div className={styles.img}>
                                {otherUserMBTI && (
                                    <img
                                        src={mbtiImages[otherUserMBTI]}
                                        alt={`${otherUserMBTI} avatar`}
                                        className={styles.avatarImg}
                                    />
                                )}
                            </div>
                            <div className={styles.chat_container}>
                                <p className={styles.userName}>{otherUserMBTI ? `${otherUserMBTI} 페르소나` : "알 수 없는 사용자"}</p>
                                <p>{room.latest_message ? room.latest_message : "최근 메시지가 없습니다."}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className={styles.noMateMessage}>채팅방이 없습니다.</p>
            )}
        </div>
    );
}

function Manageguide() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myGuides');

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

    return (
        <div className={styles.mainbox}>
            <header className={styles.header}>
                <img src={backBtn} className={styles.backButton} onClick={handleBack} alt="Back"/>
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
            
            <div className={styles.content}>
                {renderContent()}
            </div>

            <Footer />
        </div>
    );
}

export default Manageguide;