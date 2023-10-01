import React, { SetStateAction, useEffect, useState } from 'react';
import './BagDisplay.css';
import Axios from 'axios';
import { Paper, InputBase, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';


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

  const handleSearch = (e: {
    preventDefault: () => void;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();
    setUserId(e.target.value);
  };
  

  useEffect(() => {
    console.log(bag);
  }, [bag]);

  return (
    <div className="bag-container">
      <h1>Disc Golf Bag</h1>
      <div className="search-container">
        <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
              {/* <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={handleClickPopover}>
                <FilterListOutlinedIcon/>
              </IconButton> */}
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for Ted, Teddy or AI Token ID"
                inputProps={{ 'aria-label': 'Search for Ted, Teddy or AI Token ID' }}
                onChange={handleSearch}
                value={userId}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
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
                <Card sx={{ maxWidth: 345 }} key={index}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <button onClick={() => toggleDisc(disc.id)} className="toggle-button">
                    {expandedDiscs[disc.id] ? '-' : '+'}
                  </button>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {disc.disc_name}
                    </Typography>
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
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
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
