import React, { useState, useEffect } from 'react';
import Footer from '../footer/footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Sty from './insight.module.css';

import list from './list.png';
import heart from './heart.png';

function Home() {  
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiary, setSelectedDiary] = useState(null);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      setError('Member ID not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://seominjae.duckdns.org/diary/8/`, {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setDiaries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setError('Failed to fetch diaries');
      setLoading(false);
    }
  };

  const insightWrite = () => {
    navigate('/insightWrite');
  }

  const openModal = (diary) => {
    setSelectedDiary(diary);
  };

  const closeModal = () => {
    setSelectedDiary(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={Sty.body}>
      <h1>여행일기</h1>
      <div className={Sty.main_container}>
        <div className={Sty.header}>
          <img src={list} className={Sty.list} alt="List"/>
          <img src={heart} className={Sty.heart} alt="Heart"/>
        </div>
        {diaries.length > 0 ? (
          <div className={Sty.diaries_grid}>
            {diaries.map((diary, index) => (
              <div key={index} className={Sty.diary_item} onClick={() => openModal(diary)}>
                <img src={diary.picture} alt={`Diary ${index + 1}`} className={Sty.diary_image}/>
              </div>
            ))}
          </div>
        ) : (
          <div className={Sty.notInfo_container}>
            <h2 className={Sty.NotYet}>아직 여행 일기가 없습니다.</h2>
            <div className={Sty.Sub}>
              <p>내 페르소나와 여행에 대한</p>
              <p>대화를 하며 커버 이미지와 함께</p>
              <p>여행 일기를 생성해줍니다.</p>
            </div>
          </div>
        )}
        <button className={Sty.Write_btn} onClick={insightWrite}>여행 일기 쓰기</button>
        <Footer /> 
      </div>
      {selectedDiary && (
        <Modal diary={selectedDiary} closeModal={closeModal} />
      )}
    </div>
  );
}

function Modal({ diary, closeModal }) {
  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className={Sty.modalOverlay}>
      <div className={Sty.modal}>
        <button className={Sty.closeButton} onClick={closeModal}>X</button>
        <img src={diary.picture} alt="Diary" className={Sty.modalImage} />
        <div className={Sty.modalContent}>
          <div className={Sty.modalHeader}>
            <h2>{diary.title}</h2>
            <p>{formatDate(diary.created_at)}</p>
          </div>
          <p>with 연아님</p>
          <p>{diary.diary}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
