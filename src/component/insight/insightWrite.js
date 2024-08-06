import React, { useState, useEffect, useRef } from "react";
import styles from "./insightWrite.module.css";
import { useNavigate } from 'react-router-dom';
import backBtn from '../logininput/back.png';
import loading from '../persona/Loading.png';

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

const questions = [
  "누구랑 같이 언제, 어디로 여행지를 갔다왔어??",
  "언제 어떤 여행을 즐겼고, 어떤 것들을 경험했어??",
  "가장 인상 깊었던 음식은 무엇이고, 그 지역과 어떤 연관성이 있어?",
  "이번 여행에서 아쉬웠던 점은 무엇이였어?",
  "이번 여행에서 가장 좋았던 경험은 무엇이었어?",
  "이번 여행에서 특별한 에피소드 같은 게 있어??",
  "여행하면서 기분이 어땠고, 왜 그 기분이 들었어?",
  "해당 여행지에 대해 어떤 감정 변화나 인식 변화가 생겼어?",
  "여행을 갔다옴으로써 너의 심정이나 마음 변화가 바뀐 게 있니??",
  "체험하면서 나왔던 비용들은 어땠고, 어떤 기분이 들었니?",
  "추가적으로 더 기록이 되었으면 하는 내용이나 에피소드가 있어?",
  "또 다른 체험이나 즐겼던 내용이 있니?",
  "더 즐기고 싶던 내용이 있니?"
];

const mandatoryQuestions = [0, 1];
const middleQuestions = [2, 3, 4, 5, 6, 7, 8, 9];
const lastQuestions = [10, 11, 12];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomQuestions() {
  const shuffledMiddle = shuffleArray([...middleQuestions]);
  const selectedMiddle = shuffledMiddle.slice(0, 6);
  const shuffledLast = shuffleArray([...lastQuestions]);
  const selectedLast = shuffledLast.slice(0, 2);
  return [...mandatoryQuestions, ...selectedMiddle, ...selectedLast];
}

function InsightWrite() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForAIResponse, setIsWaitingForAIResponse] = useState(false);
  const [userMBTI, setUserMBTI] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState([]);
  const chatContentRef = useRef(null);
  const [showTitleModal, setShowTitleModal] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const loadMessages = () => {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      setIsLoading(false);
    };

    const loadUserMBTI = () => {
      const mbti = localStorage.getItem('taste_travel');
      if (mbti) {
        const cleanedMBTI = mbti.replace(/['"]+/g, '').toUpperCase();
        setUserMBTI(cleanedMBTI);
      }
    };

    loadMessages();
    loadUserMBTI();
    setQuestionOrder(getRandomQuestions());
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && !showTitleModal && messages.length === 0 && questionOrder.length > 0) {
      setMessages([{ text: questions[questionOrder[0]], sender: 'ai' }]);
    }
  }, [isLoading, showTitleModal, questionOrder]);

  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  const goBack = () => {
    navigate('/insight');
  }

  const getBackgroundImage = () => {
    if (userMBTI && mbtiImages[userMBTI]) {
      return mbtiImages[userMBTI];
    }
    return null;
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      localStorage.setItem('title', title);
      setShowTitleModal(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      setIsWaitingForAIResponse(true);
      setTimeout(() => {
        setMessages(prevMessages => {
          const nextQuestionIndex = currentQuestionIndex + 1;
          let aiMessage;
          if (nextQuestionIndex < questionOrder.length) {
            aiMessage = { text: questions[questionOrder[nextQuestionIndex]], sender: 'ai' };
            setCurrentQuestionIndex(nextQuestionIndex);
          } else {
            aiMessage = { text: "모든 질문에 답변해 주셔서 감사합니다. 여행 일기를 생성하시겠습니까?", sender: 'ai' };
          }
          return [...prevMessages, aiMessage];
        });
        setIsWaitingForAIResponse(false);
      }, 1000);
    }
  }

  const handleCreateDiary = () => {
    const chatMessages = localStorage.getItem('chatMessages');
    const parsedMessages = chatMessages ? JSON.parse(chatMessages) : [];
    const savedTitle = localStorage.getItem('title');
    
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('title');
    
    navigate('/createDiary', { 
      state: { 
        messages: parsedMessages,
        title: savedTitle
      } 
    });
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { background, textBackground } = userMBTI ? mbtiColors[userMBTI] : { background: '#FFFFFF', textBackground: '#000000' };
  const backgroundImage = getBackgroundImage();

  return (
    <div className={styles.chatFullScreen} style={{ backgroundColor: "white" }}>
      {showTitleModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.title}>이번 여행의 제목을 정해주세요</h2>
            <form onSubmit={handleTitleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="여행 제목 입력"
                className={styles.titleInput}
              />
              <button type="submit" className={styles.titleSubmitButton}>완료</button>
            </form>
          </div>
        </div>
      )}
      
      {!showTitleModal && (
        <>
          {backgroundImage && (
            <img src={backgroundImage} alt="Background" className={styles.backgroundImage} />
          )}
          <div className={styles.chatGradient}></div>
          <div className={styles.header}>
            <img onClick={goBack} src={backBtn} className={styles.back_btn} alt="Go Back" />
          </div>
          <div className={styles.chatWrapper}>
            <div className={styles.chatContent} ref={chatContentRef}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`${styles.message} ${styles[message.sender]}`}
                  style={{
                    backgroundColor: message.sender === 'user' ? textBackground : '#FFFFFF'
                  }}
                >
                  {message.text}
                </div>
              ))}          
              {messages.length >= 20 && (
                <span onClick={goBack} className={styles.ChatEndButton}>
                  대화종료
                </span>)}

              {isWaitingForAIResponse && (
                <div className={`${styles.message} ${styles.ai}`}>
                  <img src={loading} alt="Loading" />
                </div>
              )}
              {messages.length >= 20 && (
                <div className={styles.buttonContainer}>
                  <button onClick={handleCreateDiary} className={styles.createDiaryButton}>
                    여행일기 생성
                  </button>
                </div>
              )}
            </div>
          </div>
          {messages.length < 20 && (
            <form onSubmit={handleSend} className={styles.inputArea}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지 입력"
                className={styles.inputField}
              />
              <button type="submit" className={styles.sendButton}>전송</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default InsightWrite;