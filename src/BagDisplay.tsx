// src/components/BagDisplay.tsx
import React, { useEffect, useState } from 'react';
import './BagDisplay.css';
import Axios from 'axios';


interface Disc {
    brand?: string;
    name: string;
    speed?: number;
    glide?: number;
    turn?: number;
    fade?: number;
    category: string;
  }

  interface Bag {
    DistanceDrivers?: Disc[];
    FairwayDrivers: Disc[];
    MidRanges?: Disc[];
    PuttAndApproach?: Disc[];
  }


const API_BASE_URL = 'http://localhost:3001';

const BagDisplay: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [bag, setBag] = useState<Bag>({
        DistanceDrivers: [],
        FairwayDrivers: [],
        MidRanges: [],
        PuttAndApproach: [],
      });
    const [error, setError] = useState<string | null>(null);
  
    const searchBag = () => {
      const URL = userId ? `${API_BASE_URL}/bag/${userId}` : `${API_BASE_URL}/bag`;
      console.log(URL);
      Axios.get(URL)
        .then(response => {
          console.log(response.status);
          console.log(response.data);
          // Set the bag state with the response data (already categorized)
          setBag({
            DistanceDrivers: response.data['Distance Drivers'].map((name: string) => ({ name, category: 'Distance Drivers' })),
            FairwayDrivers: response.data['Fairway Drivers'].map((name: string) => ({ name, category: 'Fairway Drivers' })),
            MidRanges: response.data['Mid-Ranges'].map((name: string) => ({ name, category: 'Mid-Ranges' })),
            PuttAndApproach: response.data['Putt/Approach'].map((name: string) => ({ name, category: 'Putt/Approach' })),
          });
          setError(null);
        })
        .catch(err => {
          console.log(err.status);
          console.log(err.data);
          setError(err.response ? err.response.data : 'An error occurred.');
          setBag({
            DistanceDrivers: [],
            FairwayDrivers: [],
            MidRanges: [],
            PuttAndApproach: [],
          });
        });
    };

    useEffect(() => {
        console.log(bag);
    }, [bag]);
  
    return (
      <div className="bag-container">
        <h1>Disc Golf Bag</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={searchBag}>Search</button>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="bag-list">
        {Object.entries(bag).map(([category, discs]) => (
            <div key={category} className="category">
            <h3>{category}</h3>
            <ul>
                {discs.map((disc: Disc, index: number) => (
                <li key={index}>{disc.name}</li>
                ))}
            </ul>
            </div>
        ))}
        </div>
      </div>
    );
  };
  

export default BagDisplay;
