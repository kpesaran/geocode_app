import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostForm from '../components/post-form/PostForm';
import PostContainer from '../components/posts/PostContainer';
import fetchLocationData from '../utilities/locationUtils';
import './styles.css';

export default function Home() {
  const [location, setLocation] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('neighborhood');
  const [sortOn, setSortOn] = useState('');

  // const [locationProvided, setLocationProvided] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState('');

  // const [isLoading, setIsLoading] = useState(true)

  const fetchData = async (localLocation) => {
    // setIsLoading(true)
    try {
      // use location data to make your api requests
      const locationVal = localLocation[filter];

      let endpoint = `http://localhost:3001/api/v1/postings?`;
      if (locationVal) {
        const locationQuery = `${filter}=${locationVal}`;
        console.log(locationQuery);
        endpoint += locationQuery;
      }
      if (sortOn) {
        let sortQuery;
        if (sortOn === 'views') {
          sortQuery = `sort=views:desc`;
        } else if (sortOn === 'recent') {
          sortQuery = `sort=dateStamp:desc`;
        } else if (sortOn === 'oldest') {
          sortQuery = `sort=dateStamp:asc`;
        }
        if (sortQuery) {
          endpoint += `&${sortQuery}`;
        }
      }
      if (cuisineFilter && cuisineFilter !== 'All') {
        console.log(cuisineFilter);
        endpoint += `&category=${cuisineFilter}`;
      }

      const token = localStorage.getItem('token');

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      if (searchTerm != '') {
        const searchTermLowerCase = searchTerm.toLowerCase();

        const postsToDisplay = response.data.filter(
          (post) =>
            post.title && post.title.toLowerCase().includes(searchTermLowerCase)
        );

        setPosts([...postsToDisplay]);

        return;
      }

      setPosts(response.data);
    } catch (error) {
      console.error('failed to get posts:', error);
    }
  };

  function handleCuisineFilterChange(newCuisine) {
    setCuisineFilter(newCuisine);
  }
  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }
  function handleSearchChange(newTerm) {
    setSearchTerm(newTerm);
  }
  function handleSortChange(newSort) {
    setSortOn(newSort);
  }
  function updatePostViewCount(updatedPost) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }

  function onCloseForm() {
    setShowForm(false);
    console.log(showForm);
  }
  function handleSetShowForm() {
    setShowForm(true)
  }

  useEffect(() => {
    async function getLocation() {
      try {
        const locationData = await fetchLocationData();
        console.log(locationData);
        setLocation({ ...locationData });
        console.log(JSON.stringify(locationData));
        localStorage.setItem('location', JSON.stringify(locationData));
        fetchData(locationData);
      } catch (err) {
        console.error('Error fetching location:', err);
      }
    }
    const storedLocation = localStorage.getItem('location');

    if (storedLocation) {
      const storedLocationObj = JSON.parse(storedLocation);
      setLocation(storedLocationObj);
      fetchData(storedLocationObj);
    } else {
      getLocation();
    }
  }, [filter, searchTerm, sortOn, cuisineFilter]);
  console.log(sortOn);
  console.log(cuisineFilter);

  console.log(filter);
  return (
    <>
      {/* {isLoading ? <h4>Data is loading...</h4> : */}
      <div>
        {showForm ? (
          <PostForm
            location={location}
            onCreatePost={fetchData}
            onCloseForm={onCloseForm}
          />
        ) : (
          <div>
            <div></div>
            
            <PostContainer
              posts={posts}
              location={location}
              onSearch={handleSearchChange}
                onFilterChange={handleFilterChange}
                setShowForm ={handleSetShowForm}
              onSortChange={handleSortChange}
              onCuisineFilterChange={handleCuisineFilterChange}
              fetchPosts={fetchData}
              updatePostViewCount={updatePostViewCount}
            />
          </div>
        )}
      </div>
    </>
  );
}
