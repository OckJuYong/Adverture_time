import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Potopagestyle from "./potoupload.module.css";
import infoImg from './info.png';
import closeBtn from './closeBtn.png';

function Potouploadpage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [mbti, setMbti] = useState('');
  const [visitedPlaces, setVisitedPlaces] = useState('');
  const [desiredPlaces, setDesiredPlaces] = useState('');
  const [travelAnswers, setTravelAnswers] = useState(null);

  useEffect(() => {
    const userInfo = location.state;
    if (userInfo) {
      setTravelAnswers(userInfo.travelAnswers || []);
      setMbti(userInfo.mbti || '');
      setVisitedPlaces(userInfo.visitedPlaces || '');
      setDesiredPlaces(userInfo.desiredPlaces || '');
      console.log("Received User Info:", userInfo);
    }
  }, [location]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prevImages => [...prevImages, ...files].slice(0, 12));
    setShowWarning(false);
  };

  const handleImageBoxClick = () => {
    fileInputRef.current.click();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUpload = async () => {
    if (selectedImages.length >= 1) {
      const formData = new FormData();
      selectedImages.slice(0, 15).forEach((image, index) => {
        formData.append(`picture${index + 1}`, image, `image${index + 1}.jpg`);
      });
      
      const memberId = localStorage.getItem('memberId') || '12345'; // fallback to '12345' if not found
      formData.append('travel_user_id', memberId);
      
      if (mbti) formData.append('mbti', mbti);
      if (visitedPlaces) formData.append('visited_places', visitedPlaces);
      if (desiredPlaces) formData.append('desired_places', desiredPlaces);
      
      if (travelAnswers && Array.isArray(travelAnswers)) {
        travelAnswers.forEach((answer, index) => {
          formData.append(`question${index + 1}`, answer);
        });
      }

      try {
        const response = await axios.post('https://seominjae.duckdns.org/persona/create_user_info/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: false,
        });
        console.log("Server Response:", response.data.tendency);
        localStorage.setItem('taste_travel', JSON.stringify(response.data.tendency));

        navigate('/potocompage', { state: { analysisResult: response.data } });
      } catch (error) {
        console.error('Error during image upload:', error);
        setShowWarning(true);
      }
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className={Potopagestyle.container}>
      <img src={infoImg} className={Potopagestyle.infoImg} onClick={toggleModal} alt="Info"/>
      <h1 className={Potopagestyle.title1}>좋아하는 여행 사진을</h1>
      <h1 className={Potopagestyle.title2}>선택해 주세요!</h1>
      <p className={Potopagestyle.subtitle}>선택한 사진을 분석해 재진님의 여행 페르소나를 생성합니다.</p>
      
      <div className={Potopagestyle.imageGrid} onClick={handleImageBoxClick}>
        {[...Array(12)].map((_, index) => (
          <div key={index} className={Potopagestyle.imageBox}>
            {selectedImages[index] ? (
              <>
                <img
                  src={URL.createObjectURL(selectedImages[index])}
                  alt={`Selected ${index + 1}`}
                  className={Potopagestyle.image}
                />
                <div className={Potopagestyle.checkCircle}>
                  <div className={Potopagestyle.checkMark}></div>
                </div>
              </>
            ) : (
              <div className={Potopagestyle.emptyCircle}></div>
            )}
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={fileInputRef}
        className={Potopagestyle.fileInput}
      />
      <button onClick={handleUpload} className={Potopagestyle.selectButton}>
        {selectedImages.length >= 1 && selectedImages.length <= 10 ? "페르소나 생성하기" : `${selectedImages.length}개 선택 완료`}
      </button>

      {showWarning && (
        <p className={Potopagestyle.warningMessage}>
          아직 사진을 선택하지 않았거나 업로드 중 오류가 발생했습니다.
        </p>
      )}

      {isModalOpen && (
        <div className={Potopagestyle.modalOverlay} onClick={toggleModal}>
          <div className={Potopagestyle.modalContent} onClick={e => e.stopPropagation()}>
            <img src={closeBtn} onClick={toggleModal} className={Potopagestyle.close_modal}/>
            <p className={Potopagestyle.tip}>사진 선택 tip</p>
            <h2>본인을 잘 나타낼 수 있는 사진을 고르세요</h2>
            <p>페르소나 생성 이미지 분석은 사진에 드러나는 요소들을 분석해 사용자의 페르소나를 생성합니다.</p>
            <h2>중복되는 사진은 최대한 피해주세요.</h2>
            <p>비슷한 사진을 중복해서 선택하면 적절한 사용자 페르소나 생성이 어려울 수 있습니다.</p>
            <h2>1~10장까지의 사진을 넣을 수 있지만 사진을 많이 넣을수록 정확도가 올라갑니다.</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Potouploadpage;