import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./createguide.module.css"
import useGeoLocation from '../GPS/Gps';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
};

function Createguide() {
    const [address, setAddress] = useState("");
    const { location, address: geoAddress, error } = useGeoLocation(geolocationOptions);

    useEffect(() => {
        if (geoAddress) {
          const locationName = geoAddress.city || geoAddress.town || geoAddress.village || geoAddress.county;
          setAddress(locationName);
        }
      }, [geoAddress]);

    const [proposal, setProposal] = useState({
        area: '',
        price: '10000',
        goal: '',
        schedule: '',
        travelStartDate: '',
        travelEndDate: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProposal(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const postData = {
            area: address,
            price: parseInt(proposal.price),
            goal: proposal.goal,
            schedule: proposal.schedule,
            travelStartDate: proposal.travelStartDate,
            travelEndDate: proposal.travelEndDate
        };
    
        console.log('Posting data:', JSON.stringify(postData, null, 2));
    
        try {
            const response = await axios.post(
                'https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/guide-proposal/creation',
                postData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('Guide proposal created successfully', response.data);

            if (response.data && response.data.guideProposalId) {
                localStorage.setItem('guideProposalId', response.data.guideProposalId);
                console.log('guideProposalId stored in localStorage:', response.data.guideProposalId);
            }

            alert('가이드 제안이 성공적으로 생성되었습니다!');
            navigate('/guide-proposals');
        } catch (error) {
            console.error('Error creating guide proposal:', error);
            alert('가이드 제안 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header_container}>
                <h1 className={styles.title}>현지 프로그램 만들기</h1>
                <div className={styles.address}>{address}</div>
            </div>
            <div className={styles.line}></div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="goal">여행 목적</label>
                    <textarea
                        id="goal"
                        name="goal"
                        value={proposal.goal}
                        onChange={handleChange}
                        required
                        placeholder="프로그램 제목을 작성해주세요"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="schedule">일정 계획</label>
                    <textarea
                        id="schedule"
                        name="schedule"
                        value={proposal.schedule}
                        onChange={handleChange}
                        required
                        placeholder="프로그램 일정 계획"
                    />
                </div>
                <div>여행 기간</div>
                <div className={styles.dateGroup}>
                    <div className={styles.formGroup}>
                        <input
                            type="datetime-local"
                            id="travelStartDate"
                            name="travelStartDate"
                            value={proposal.travelStartDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.anfruf}>-</div>
                    <div className={styles.formGroup}>
                        <input
                            type="datetime-local"
                            id="travelEndDate"
                            name="travelEndDate"
                            value={proposal.travelEndDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className={styles.formGroup_won}>
                    <label htmlFor="price">금액</label>
                    <select
                        id="price"
                        name="price"
                        value={proposal.price}
                        onChange={handleChange}
                        required
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num * 10000} className={styles.won}>
                                {num * 10000}원
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className={styles.submitButton}>제안 생성</button>
            </form>
        </div>
    );
}

export default Createguide;