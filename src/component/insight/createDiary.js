import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NoneImg from './NoneImg.png';
import backImg from '../logininput/back.png';
import CreateDiarySty from './createDiary.module.css';

import H_T from './H_T.png';
import H_F from './H_F.png';

function CreateDiary() {  
  const navigate = useNavigate();
  const location = useLocation();

  const [travel, setTravel] = useState("");
  const [day, setDay] = useState("");
  const [summary, setSummary] = useState(""); // 요약 상태 추가
  const [isHeart, setIsHeart] = useState(false);
  const [diary, setDiary] = useState(null);  // diary 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    setDay(formattedDate);

    if (location.state?.messages && location.state?.title) {
      const { messages, title } = location.state;
      setTravel(title);
      const formattedData = formatMessagesForBackend(messages, title);
      sendDataToBackend(formattedData);
    }
  }, [location.state]);

  const formatMessagesForBackend = (messages, title) => {
    const formattedData = { 
      title: title,
    };
    let questionCount = 1;
    let answerCount = 1;

    messages.slice(0, -1).forEach(message => {
      if (message.sender === 'ai') {
        formattedData[`question${questionCount}`] = message.text;
        questionCount++;
      } else if (message.sender === 'user') {
        formattedData[`answer${answerCount}`] = message.text;
        answerCount++;
      }
    });

    return formattedData;
  };

  const sendDataToBackend = async (data) => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      console.error('Member ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.post(`https://seominjae.duckdns.org/diary/${memberId}/`, data, {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Data sent successfully:', response.data);
      setDiary(response.data);
      setSummary(response.data.diary); // 요약 설정
      const createdDate = response.data.created_at.split('T')[0]; // 날짜 포맷 설정
      setDay(createdDate);
      setLoading(false);  // 로딩 상태를 false로 설정
    } catch (error) {
      console.error('Error sending data to backend:', error);
      console.log(data);
      setLoading(false);  // 로딩 상태를 false로 설정
    }
  };

  const goBack = () => {
    navigate(-1);
  }

  const ReusltBtn = () => {
    navigate("/Insight");
  }

  const toggleHeart = () => {
    setIsHeart(!isHeart);
  }

  return (
    <div className={CreateDiarySty.pageContainer}>
      <img src={backImg} className={CreateDiarySty.backBtn} onClick={goBack} alt="Back"/>
      <div className={CreateDiarySty.container}>
        {loading ? (
          <div>Loading...</div> // 로딩 메시지 표시
        ) : (
          <>
            <img 
              src={diary?.real_picture ? `http://43.202.121.14:8000${diary.real_picture}` : NoneImg} 
              alt="Diary"
              className={CreateDiarySty.img}
            />
            <div className={CreateDiarySty.headerContainer}>
              <div className={CreateDiarySty.leftHeaderContainer}>
                <h2>{travel}</h2>
                <p>{day}</p>
              </div>
              <div className={CreateDiarySty.rightHeaderContainer}>
                <div className={CreateDiarySty.profileCircle}></div>
                <p>with 연아님</p>
              </div>
            </div>
            <div className={CreateDiarySty.mainContainer}>
              <div className={CreateDiarySty.section}>
                <h3>요약</h3>
                <p>{summary}</p>
              </div>
            </div>
            <div className={CreateDiarySty.footer_container}>
              <button onClick={ReusltBtn} className={CreateDiarySty.confirmButton}>확인</button>
              <img 
                src={isHeart ? H_T : H_F} 
                className={CreateDiarySty.H_T}
                onClick={toggleHeart}
                alt="Heart"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateDiary;
