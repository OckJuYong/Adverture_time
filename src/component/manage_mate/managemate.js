import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "./managemate.module.css";

import backBtn from '../logininput/back.png';
import message from './Vector.png';

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

function Modal({ isOpen, onClose, travelUserId }) {
    if (!isOpen) return null;
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>X</button>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>User Info</h2>
            </div>
            <p>Travel User ID: {travelUserId}</p>
          </div>
        </div>
      </div>
    );
  }

function MyMates() {
    const [myMates, setMyMates] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [isSocketReady, setIsSocketReady] = useState(false);
    const [status, setStatus] = useState('');
    const [recipientId, setRecipientId] = useState('');

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
            } catch (error) {
                console.error('Error fetching my mates:', error);
            }
        };

        fetchMyMates();
    }, []);

    const itsme = localStorage.getItem("memberId");

    const ChatStart = async (userId) => {
        try {
            const response = await axios.post('https://port-0-travelproject-umnqdut2blqqevwyb.sel4.cloudtype.app/chat/rooms/', {
                travel_user_id: itsme,
                users: [    
                    { travel_user_id: userId }
                ]
            });

            const createdRoomId = response.data.id;
            setRoomId(createdRoomId);
            console.log('생성된 방 ID:', createdRoomId);

            const webSocketUrl = `wss://port-0-travelproject-umnqdut2blqqevwyb.sel4.cloudtype.app/ws/chat/${createdRoomId}/`;
            const socket = new WebSocket(webSocketUrl);

            socket.onopen = () => {
                console.log('웹소켓 연결 완료');
                setIsSocketReady(true);
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('서버로부터 메시지 수신:', data);
            };

            socket.onerror = (error) => {
                console.error('웹소켓 오류:', error);
                setIsSocketReady(false);
            };

            socket.onclose = (event) => {
                console.log('웹소켓 연결 종료.', event.code, event.reason);
                setIsSocketReady(false);
            };

            console.log('Chat Start');
        } catch (error) {
            console.error('Error creating chat room:', error.response?.data || error.message);
            setStatus('채팅방 생성 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>내 메이트 {myMates.length}명</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {myMates.length > 0 ? (
                myMates.map((mate) => (
                    <div key={mate.id} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container}>
                            <p className={styles.userName}>{mate.friendTravelUserDto.name}</p>
                            <p>한국형 페르소나</p>
                        </div>
                        <img 
                            src={message} 
                            className={styles.meesage} 
                            onClick={() => ChatStart(mate.friendTravelUserId)}
                        />
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>내 메이트가 아직 없습니다.</p>
            )}
        </div>
    );
}

function ReceivedRequests() {
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchReceivedRequests = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

                const config = {
                    withCredentials: true,
                    headers: {
                        'Cookie': `jwtToken=${jwtToken}; jwtRefreshToken=${jwtRefreshToken}`
                    }
                };

                const response = await axios.get('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/standby-list', config);
                setReceivedRequests(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching received requests:', error);
            }
        };

        fetchReceivedRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

            const config = {
                withCredentials: true,
                headers: {
                    'Cookie': `jwtToken=${jwtToken}; jwtRefreshToken=${jwtRefreshToken}`
                }
            };

            const response = await axios.patch('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/acceptance', {
                friendTravelUserId: receivedRequests[0].friendTravelUserId
            }, config);

            console.log(`Request ${requestId} accepted`, response.data);
            setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

            const config = {
                withCredentials: true,
                headers: {
                    'Cookie': `jwtToken=${jwtToken}; jwtRefreshToken=${jwtRefreshToken}`
                }
            };

            const response = await axios.patch('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/refusal', {
                friendTravelUserId: receivedRequests[0].friendTravelUserId
            }, config);

            console.log(`Request ${requestId} rejected`, response.data);
            setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const openModal = (userId) => {
        setSelectedUserId(userId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedUserId(null);
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>받은 요청 {receivedRequests.length}개</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {receivedRequests.length > 0 ? (
                receivedRequests.map((request) => (
                    <div key={request.id} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container} onClick={() => openModal(request.friendTravelUserId)}>
                            <p className={styles.userName}>{request.name}</p>
                            <p>{request.location} • 궁합 {request.percentage}%</p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button className={styles.acceptButton} onClick={() => handleAccept(request.id)}>수락</button>
                            <button className={styles.rejectButton} onClick={() => handleReject(request.id)}>거절</button>
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>받은 요청이 없습니다.</p>
            )}
            <Modal isOpen={modalOpen} onClose={closeModal} travelUserId={selectedUserId} />
        </div>
    );
}

function SentRequests() {
    const [sentRequests, setSentRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

                const config = {
                    withCredentials: true,
                    headers: {
                        'Cookie': `jwtToken=${jwtToken}; jwtRefreshToken=${jwtRefreshToken}`
                    }
                };

                const response = await axios.get('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/friend/request-list', config);
                setSentRequests(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching sent requests:', error);
            }
        };

        fetchSentRequests();
    }, []);

    const openModal = (userId) => {
        setSelectedUserId(userId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedUserId(null);
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>보낸 요청 {sentRequests.length}개</p>
                <button className={styles.editButton}>편집</button>
            </div>
            {sentRequests.length > 0 ? (
                sentRequests.map((request) => (
                    <div key={request.id} className={styles.selectedMateInfo}>
                        <div className={styles.img}></div>
                        <div className={styles.chat_container} onClick={() => openModal(request.friendTravelUserId)}>
                            <p className={styles.userName}>{request.friendTravelUserDto.name}</p>
                            <p>{request.friendTravelUserDto.location} • 궁합 {request.friendTravelUserDto.percentage}%</p>
                        </div>
                        <p className={styles.pendingStatus}>대기중</p>
                    </div>
                ))
            ) : (
                <p className={styles.noMateMessage}>보낸 요청이 없습니다.</p>
            )}
            <Modal isOpen={modalOpen} onClose={closeModal} travelUserId={selectedUserId} />
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
        navigate(`/chat-room/${roomId}`);  // roomId를 포함하여 해당 채팅방으로 이동
    };

    return (
        <div className={styles.content}>
            <div className={styles.header_container}>
                <p className={styles.count}>채팅방 {chatRooms.length}개</p>
            </div>
            {chatRooms.length > 0 ? (
                chatRooms.map((room) => {
                    // 현재 사용자가 아닌 다른 사용자의 travel_user_id를 찾습니다.
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
function Managemate() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myMates');
    const [selectedMate, setSelectedMate] = useState(null);

    useEffect(() => {
        if (location.state && location.state.selectedMate) {
            setSelectedMate(location.state.selectedMate);
        }
    }, [location]);

    const handleBack = () => {
        navigate(-1);
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'myMates':
                return <MyMates />;
            case 'receivedRequests':
                return <ReceivedRequests />;
            case 'sentRequests':
                return <SentRequests />;
            case 'chatRooms':
                return <ChatRoomList />;
            default:
                return <MyMates />;
        }
    };

    return (
        <div className={styles.mainbox}>
            <header className={styles.header}>
                <img src={backBtn} className={styles.backButton} onClick={handleBack}/>
                <h1 className={styles.title}>메이트 관리</h1>
            </header>
            
            <nav className={styles.tabNav}>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'myMates' ? styles.active : ''}`}
                    onClick={() => setActiveTab('myMates')}
                >
                    내 메이트
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'receivedRequests' ? styles.active : ''}`}
                    onClick={() => setActiveTab('receivedRequests')}
                >
                    받은 요청
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'sentRequests' ? styles.active : ''}`}
                    onClick={() => setActiveTab('sentRequests')}
                >
                    보낸 요청
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'chatRooms' ? styles.active : ''}`}
                    onClick={() => setActiveTab('chatRooms')}
                >
                    채팅방
                </button>
            </nav>
            
            {renderContent()}

            <Footer />
        </div>
    );
}

export default Managemate;
