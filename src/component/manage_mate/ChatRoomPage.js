import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatSty from './ChatRoomPage.module.css';

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

const ChatRoomPage = () => {
    const { roomId } = useParams();
    const [isSocketReady, setIsSocketReady] = useState(false);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [otherUserMBTI, setOtherUserMBTI] = useState(null);  // 상대방 MBTI 상태 추가
    const socketRef = useRef(null);
    const myTravelUserId = parseInt(localStorage.getItem("memberId")); 

    const mbtiImages = {
        ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP,
        INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP
    };

    useEffect(() => {
        const fetchPreviousMessages = async () => {
            try {
                const response = await axios.get(`https://port-0-travelproject-umnqdut2blqqevwyb.sel4.cloudtype.app/chat/${roomId}/messages/`);
                setChatMessages(response.data);
    
                // 메시지 외에도 participants 정보가 포함되어 있을 경우 처리
                if (response.data.some(msg => msg.type === 'participants')) {
                    const participantsData = response.data.find(msg => msg.type === 'participants');
                    const otherParticipant = participantsData.participants.find(participant => participant.travel_user_id !== myTravelUserId);
                    if (otherParticipant) {
                        const otherUserMBTI = localStorage.getItem(otherParticipant.travel_user_id);
                        setOtherUserMBTI(otherUserMBTI);
                    }
                }
            } catch (error) {
                console.error('이전 메시지 가져오기 오류:', error);
            }
        };
    
        fetchPreviousMessages();
    
        const connectWebSocket = () => {
            const webSocketUrl = `wss://port-0-travelproject-umnqdut2blqqevwyb.sel4.cloudtype.app/ws/chat/${roomId}/`;
            socketRef.current = new WebSocket(webSocketUrl);
    
            socketRef.current.onopen = () => {
                console.log('웹소켓 연결 완료');
                setIsSocketReady(true);
            };
    
            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('서버로부터 메시지 수신:', data);
    
                if (data.type === 'participants') {
                    const otherParticipant = data.participants.find(participant => participant.travel_user_id !== myTravelUserId);
                    if (otherParticipant) {
                        const otherUserMBTI = localStorage.getItem(otherParticipant.travel_user_id);
                        setOtherUserMBTI(otherUserMBTI);
                    }
                } else {
                    setChatMessages(prevMessages => [...prevMessages, data]);
                }
            };
    
            socketRef.current.onerror = (error) => {
                console.error('웹소켓 오류:', error);
                setIsSocketReady(false);
            };
    
            socketRef.current.onclose = (event) => {
                console.log('웹소켓 연결 종료.', event.code, event.reason);
                setIsSocketReady(false);
            };
        };
    
        connectWebSocket();
    
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [roomId]);

    const sendMessage = () => {
        if (isSocketReady && socketRef.current) {
            const messageData = {
                type: "message",
                sender_id: myTravelUserId,
                message: message,
            };
            socketRef.current.send(JSON.stringify(messageData));
            console.log('메시지 전송:', messageData);
            setMessage('');
        } else {
            console.log('웹소켓이 연결되지 않았습니다.');
        }
    };

    return (
        <div className={ChatSty['chat-container']}>
            <h1 className={ChatSty.main_title}>채팅방 {roomId}</h1>
            <div className={ChatSty['messages-container']}>
                {chatMessages.map((msg, index) => {
                    const senderTravelUserId = msg.sender?.travel_user_id;
    
                    // 트래블 유저 아이디를 기준으로 메시지를 좌우로 배치
                    const isSelf = senderTravelUserId === myTravelUserId;
    
                    console.log(`Message ${index}: isSelf=${isSelf}, senderId=${senderTravelUserId}`);
    
                    return (
                        <div 
                            key={index} 
                            className={`${ChatSty['message-row']} ${isSelf ? ChatSty['self'] : ChatSty['other']}`}
                        >
                            {!isSelf && (
                                <div className={ChatSty['message-avatar']}>
                                    {/* 상대방의 MBTI에 따라 이미지 변경 */}
                                    {otherUserMBTI && (
                                        <img 
                                            src={mbtiImages[otherUserMBTI]} 
                                            alt="Avatar" 
                                            className={ChatSty['avatar-img']}
                                        />
                                    )}
                                </div>
                            )}
                            <div className={`${ChatSty['message-bubble']} ${isSelf ? ChatSty['self-bubble'] : ChatSty['other-bubble']}`}>
                                {msg.text || msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={ChatSty['message-input-container']}>
                <input
                    className={ChatSty['message-input']}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지 입력"
                />
                <button 
                    className={ChatSty['message-send-button']}
                    onClick={sendMessage}
                >
                    메시지 보내기
                </button>
            </div>
        </div>
    );
    
};

export default ChatRoomPage;
