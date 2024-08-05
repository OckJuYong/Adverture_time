import React, { useState, useEffect, useRef } from "react";
import personastyle from "./persona.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const mbtiImages = {
  ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP,
  INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP
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
function Persona() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userMBTI, setUserMBTI] = useState(null);
  const chatWrapperRef = useRef(null);

  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    const mbti = localStorage.getItem('taste_travel');
    
    if (mbti) {
      const cleanedMBTI = mbti.replace(/['"]+/g, '').toUpperCase();
      setUserMBTI(cleanedMBTI);
    }

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://43.202.121.14:8000/chat/${memberId}/`);
        console.log("서버 응답 데이터:", response.data);
        if (response.data.history && response.data.history.length > 0) {
          const parsedMessages = response.data.history.map(item => {
            const [sender, text] = item.split(': ', 2);
            return { sender: sender.toLowerCase(), text };
          });
          setMessages(parsedMessages.slice(-5)); // 최근 6개 메시지만 표시
        } else if (response.data.ai_tell) {
          setMessages([{ sender: 'ai', text: response.data.ai_tell }]);
        }
      } catch (error) {
        console.error('채팅 기록을 불러오는 데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (!isLoading && chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const personaChat = () => {
    navigate('/persona');
  };

  const getBackgroundImage = () => {
    if (userMBTI && mbtiImages[userMBTI]) {
      return mbtiImages[userMBTI];
    }
    return null;
  };

  const getColors = () => {
    if (userMBTI && mbtiColors[userMBTI]) {
      return mbtiColors[userMBTI];
    }
    return { background: '#FFFFFF', textBackground: '#000000' };
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { background, textBackground } = getColors();

  return (
    <div
      className={personastyle.PerContainer}
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundColor: background,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <div className={personastyle.chatWrapper} ref={chatWrapperRef} >
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`${personastyle.message} ${personastyle[message.sender]}`} 
            style={{ 
              backgroundColor: message.sender === 'user' ? textBackground : '#FFFFFF'
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className={personastyle.inputPersonmain_container}
                onClick={personaChat}
                style={{ 
                  backgroundColor: textBackground
                }}>
        <div className={personastyle.inputPersonmain}              
          style={{ 
                  backgroundColor: textBackground
                }}
        ></div>
      </div>

      {getBackgroundImage() && (
        <img src={getBackgroundImage()} alt={userMBTI} className={personastyle.backgroundImage} />
      )}
    </div>
  );
}

export default Persona;