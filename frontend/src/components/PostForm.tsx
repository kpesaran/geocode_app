import React, { useState } from 'react';
import axios from 'axios';

interface CategoryOptions {
  label: string;
  value: 'event' | 'recipe' | 'podcast' | 'music';
}

const categoryOptions: CategoryOptions[] = [
  { label: 'Event', value: 'event' },
  { label: 'Recipe', value: 'recipe' },
  { label: 'Podcast', value: 'podcast' },
  { label: 'Music', value: 'music' },
];

const PostForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [selectedCategory, setSelectedCatergory] = useState('');

  const options = categoryOptions.map((category) => {
    return <option value={category.value}> {category.label} </option>;
  });
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      try {
    e.preventDefault();
      console.log('attemping to send user post to backend');
      const userPost = {
        title: title,
        body: body,
        category: selectedCategory,
      };

     
      const endpoint = 'http://localhost:3001/api/v1/postings';
      const response = await axios.post(endpoint, userPost);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <form onSubmit={handleFormSubmit} className='flex flex-col border 8'>
        {/* title */}
        <input
          className='border 6'
          type='string'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter Title'
          required
        ></input>
        {/* body */}
        <input
          className='border 4 h-96 '
          type='string'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='Write post'
        ></input>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCatergory(e.target.value)}
        >
          {options}
        </select>
        <button type='submit'> Submit Form</button>
      </form>
    </>
  );
};

export default PostForm;
