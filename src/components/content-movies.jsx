// import { useState, useMemo } from 'react';
import { Space, Input, Layout, Spin, Alert } from 'antd';
import './styles.css';

import { MovieItem } from './item';

const { Content } = Layout;

export function ContentMovies({ movies, loading, error, ratedMessage, clickRate, searchInput, text }) {
  return (
    <Content>
      {clickRate || <Input placeholder="Type to search..." value={text} onChange={searchInput} className="inputText" />}
      <Space className="contentMovies">
        {error && <Alert message={error.message} type="error" showIcon className="error" />}
        {loading && <Spin size="large" spinning={loading} tip="Loading..." />}
        {!loading &&
          movies &&
          movies.map((movie) => <MovieItem key={movie.id} {...movie} ratedMessage={ratedMessage} />)}
      </Space>
    </Content>
  );
}
