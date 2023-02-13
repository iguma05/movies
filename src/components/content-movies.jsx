import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Space, Input, Layout, Divider, Spin, Alert } from 'antd';

// import { Context } from '../Context';

import { MovieItem } from './item';

const { Content } = Layout;

export function ContentMovies({ movies, fiteredMovies, loading, error, getData }) {
  const [text, setText] = useState('');

  const searchInput = (event) => {
    setText(event.target.value);
    debouceSearchInput(event.target.value);
  };
  const debouceSearchInput = useMemo(() => debounce(getData, 500), []);

  return (
    <Content style={{ width: '1010px' }}>
      <Input
        style={{ width: '930px', margin: '30px 40px' }}
        placeholder="Type to search..."
        value={text}
        onChange={searchInput}
      />
      <Space
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          backgroundColor: '#f5f5f5',
          justifyContent: 'center',
        }}
      >
        {error && <Alert message={error.message} type="error" showIcon style={{ width: '900px' }} />}
        {loading && <Spin size="large" spinning={loading} tip="Loading..." />}
        {!loading && fiteredMovies && fiteredMovies.map((movie) => <MovieItem key={movie.id} {...movie} />)}
        {!loading && movies && movies.map((movie) => <MovieItem key={movie.id} {...movie} />)}
        <Divider />
      </Space>
    </Content>
  );
}
