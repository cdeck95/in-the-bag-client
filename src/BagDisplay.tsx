import React, { useEffect, useState } from 'react';
import './BagDisplay.css';
import Axios from 'axios';

interface Disc {
  id: number;
  brand?: string;
  disc_name: string;
  speed?: number;
  glide?: number;
  turn?: number;
  fade?: number;
  category: string;
}

interface Bag {
  'Distance Drivers'?: Disc[];
  'Fairway Drivers'?: Disc[];
  'Mid-Ranges'?: Disc[];
  'Putt/Approach'?: Disc[];
}

const API_BASE_URL = 'http://localhost:3001';

const BagDisplay: React.FC = () => {
  const [userId, setUserId] = useState<string>('285853646271545344');
  const [bag, setBag] = useState<Bag>({
    'Distance Drivers': [],
    'Fairway Drivers': [],
    'Mid-Ranges': [],
    'Putt/Approach': [],
  });
  const [expandedDiscs, setExpandedDiscs] = useState<{ [key: number]: boolean }>({});
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const [error, setError] = useState<string | null>(null);

  const searchBag = () => {
    const URL = userId ? `${API_BASE_URL}/bag/${userId}` : `${API_BASE_URL}/bag`;
    Axios.get(URL)
      .then((response) => {
        setBag(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response ? err.response.data : 'An error occurred.');
        setBag({
          'Distance Drivers': [],
          'Fairway Drivers': [],
          'Mid-Ranges': [],
          'Putt/Approach': [],
        });
      });
  };

  const toggleDisc = (discId: number) => {
    setExpandedDiscs((prevExpandedDiscs) => ({
      ...prevExpandedDiscs,
      [discId]: !prevExpandedDiscs[discId],
    }));
  };

  const collapseAll = () => {
    setExpandedDiscs({});
  };
  
  const expandAll = () => {
    const allDiscIds = [
      ...(bag['Distance Drivers'] ?? []),
      ...(bag['Fairway Drivers'] ?? []),
      ...(bag['Mid-Ranges'] ?? []),
      ...(bag['Putt/Approach'] ?? []),
    ].map((disc) => disc?.id);
  
    const allExpanded: { [key: number]: boolean } = {};

    allDiscIds.forEach((discId) => {
      allExpanded[discId] = true;
    });

  setExpandedDiscs(allExpanded);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prevExpandedCategories) => ({
      ...prevExpandedCategories,
      [category]: !prevExpandedCategories[category],
    }));
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
        <button onClick={collapseAll}>Collapse All</button>
        <button onClick={expandAll}>Expand All</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="bag-list">
      {Object.entries(bag).map(([category, discs]) => (
        <div key={category} className="category">
          <button
            onClick={() => toggleCategory(category)}
            className="category-toggle-button"
          >
            {expandedCategories[category] ? '🔽' : '🔼'}
          </button>
          <h3>{category}</h3>
          {expandedCategories[category] && (
            <ul>
              {discs.map((disc: Disc, index: number) => (
                <li key={index}>
                  <div className="disc-item">
                  <button onClick={() => toggleDisc(disc.id)} className="toggle-button">
                    {expandedDiscs[disc.id] ? '-' : '+'}
                  </button>
                    {disc.disc_name}
                  </div>
                  {expandedDiscs[disc.id] && (
                    <table>
                      <tbody>
                        <tr>
                          <th>Brand</th>
                          <td>{disc.brand}</td>
                        </tr>
                        <tr>
                          <th>Speed</th>
                          <td>{disc.speed}</td>
                        </tr>
                        <tr>
                          <th>Glide</th>
                          <td>{disc.glide}</td>
                        </tr>
                        <tr>
                          <th>Turn</th>
                          <td>{disc.turn}</td>
                        </tr>
                        <tr>
                          <th>Fade</th>
                          <td>{disc.fade}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </li>
              ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BagDisplay;
