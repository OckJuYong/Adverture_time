import React, { useState, useEffect } from 'react';
import Footer from '../footer/footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Sty from './insight.module.css';

import list from './list.png'; // 기본 리스트 이미지
import heart from './heart.png'; // 기본 하트 이미지
import NoneImg from './NoneImg.png'; // 기본 None 이미지

import Group_F from './Group_F.png'; // 클릭 시 변경될 리스트 이미지
import heart_T from './heart_T.png'; // 클릭 시 변경될 하트 이미지

import heart_img from './Img_heart.png'; // 좋아요 아이콘 이미지

function Home() {  
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 활성화된 탭 상태 추가

  useEffect(() => {
    fetchDiaries();
  }, [activeTab]); // activeTab 상태가 변경될 때마다 다이어리 목록을 새로 가져옵니다.

  const fetchDiaries = async () => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      setError('Member ID not found');
      setLoading(false);
      return;
    }

    try {
      const url = activeTab === 'liked' 
        ? `http://43.202.121.14:8000/diary/${memberId}/liked/` 
        : `http://43.202.121.14:8000/diary/${memberId}/`;

      const response = await axios.get(url, {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setDiaries(response.data);
      console.log(response.data);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabImage = () => {
    if (activeTab === 'liked') {
      return {
        listImg: Group_F,
        heartImg: heart_T
      };
    } else {
      return {
        listImg: list,
        heartImg: heart
      };
    }
  };

  const { listImg, heartImg } = getTabImage();

  const toggleLike = async (diary) => {
    const memberId = localStorage.getItem('memberId');
    const newLikeStatus = !diary.like;
    
    try {
      await axios.post(`http://43.202.121.14:8000/diary/${memberId}/detail/${diary.id}/`, {
        like: newLikeStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // 좋아요 상태를 업데이트합니다.
      setSelectedDiary({
        ...diary,
        like: newLikeStatus
      });

      // 리스트에서도 좋아요 상태를 업데이트합니다.
      setDiaries(prevDiaries => prevDiaries.map(d => d.id === diary.id ? { ...d, like: newLikeStatus } : d));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={Sty.body}>
      <h1>여행일기</h1>
      <div className={Sty.main_container}>
        <div className={Sty.header}>
          <img 
            src={listImg} 
            className={`${Sty.list} ${activeTab === 'list' ? Sty.active : ''}`} 
            alt="List" 
            onClick={() => handleTabClick('list')} // 리스트 아이콘 클릭 시 탭 변경
          />
          <img 
            src={heartImg} 
            className={`${Sty.heart} ${activeTab === 'liked' ? Sty.active : ''}`} 
            alt="Heart" 
            onClick={() => handleTabClick('liked')} // 하트 아이콘 클릭 시 탭 변경
          />
        </div>
        {diaries.length > 0 ? (
          <div className={Sty.diaries_grid}>
            {diaries.map((diary, index) => (
              <div key={index} className={Sty.diary_item} onClick={() => openModal(diary)}>
                <div className={Sty.imageWrapper}>
                  <img 
                    src={diary.picture ? `http://43.202.121.14:8000/${diary.picture}` : NoneImg} 
                    alt={`Diary ${index + 1}`} 
                    className={Sty.diary_image} 
                  />
                  {diary.like && (
                    <img src={heart_img} alt="Liked" className={Sty.likeIcon} />
                  )}
                </div>
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
        <Modal diary={selectedDiary} closeModal={closeModal} toggleLike={toggleLike} />
      )}
    </div>
  );
}

function Modal({ diary, closeModal, toggleLike }) {
  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className={Sty.modalOverlay}>
      <div className={Sty.modal}>
        <button className={Sty.closeButton} onClick={closeModal}>X</button>
        <img 
          src={diary.picture ? `http://43.202.121.14:8000/${diary.picture}` : NoneImg} 
          alt="Diary" 
          className={Sty.modalImage} 
        />
        <div className={Sty.modalContent}>
          <div className={Sty.modalHeader}>
            <h2>{diary.title}</h2>
            <div className={Sty.like_container}>
              <p>{formatDate(diary.created_at)}</p>
              <button className={Sty.likeButton} onClick={() => toggleLike(diary)}>
                {diary.like ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
          <p>with 연아님</p>
          <p>{diary.diary}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
