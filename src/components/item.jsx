import React, { useState } from 'react';
import { Card, Image, Tag, Typography, Rate } from 'antd';
import { format } from 'date-fns';

import { Context } from '../Context';

const { Meta, Grid } = Card;
const { Paragraph, Text, Title } = Typography;
const _key = 'b86a8d724a602ddbef697c551c95e01d';

export function MovieItem({ id, genre_ids, title, overview, poster_path, release_date, vote_average }) {
  const EllipsisMod = ({ children }) => {
    const text = children;
    return (
      <Paragraph
        ellipsis={{
          rows: 6,
        }}
        height={129}
      >
        {text}
      </Paragraph>
    );
  };
  const desc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [rated, setRated] = useState(null);

  const editColor = (rate) => {
    if (rate > 0 && rate < 3) {
      return '#E90000';
    } else if (rate >= 3 && rate < 5) {
      return '#E97E00';
    } else if (rate >= 5 && rate < 7) {
      return '#E9D100';
    } else if (rate >= 7) {
      return '#66E900';
    }
  };
  const filterRanked = async (id, rated) => {
    if (rated > 0) {
      const item = { id: id, rated: rated };
      const sessionData = JSON.parse(sessionStorage.getItem('guest_session'));
      const { guest_session_id } = sessionData;
      await postRatedMovies(id, rated, guest_session_id);
      const oldData = JSON.parse(sessionStorage.getItem('ratedMovies'));
      if (oldData) {
        const newData = [...oldData, item];
        sessionStorage.setItem('ratedMovies', JSON.stringify(newData));
      } else {
        sessionStorage.setItem('ratedMovies', JSON.stringify([item]));
      }
    }
  };
  const renderGenres = (genre, genresList) => {
    const { genres } = genresList;
    let newGenres = [];
    if (genres) {
      newGenres = genres.filter((item) => item.id === genre);
    }
    return newGenres.map((item) => <Tag key={genre}>{item.name}</Tag>);
  };
  const postRatedMovies = async (movieId, value, sessionId) => {
    const urlRate = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${_key}&guest_session_id=${sessionId}`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: value }),
    };
    await fetch(urlRate, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Что-то пошло не так с отправкой оценки');
        }
      })
      .then((res) => console.log(res))
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Card hoverable style={{ padding: 1, width: '454px', margin: 10 }}>
      <Grid style={{ height: 'auto' }}>
        <Meta
          style={{ width: 405, textAlign: 'start', padding: '12px 9px', height: 300, position: 'relative' }}
          title={
            <>
              {title && (
                <Title level={5} style={{ margin: 0 }}>
                  <Text style={{ width: 250 }}>{title}</Text>
                  <Text
                    style={{
                      border: `2px solid ${editColor(vote_average) || '#E9D100'}`,
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 30,
                      height: 30,
                      textAlign: 'center',
                    }}
                  >
                    {vote_average}
                  </Text>
                </Title>
              )}
            </>
          }
          description={
            <>
              <Text type="secondary">{release_date && format(new Date(release_date), 'MMMM d, yyyy')}</Text>
              <Paragraph style={{ margin: 5, marginLeft: 0 }}>
                {genre_ids &&
                  genre_ids.map((genre) => (
                    <Context.Consumer key={genre}>{(value) => renderGenres(genre, value)}</Context.Consumer>
                  ))}
              </Paragraph>
              {overview && <EllipsisMod>{overview}</EllipsisMod>}
              <Rate
                tooltips={desc}
                onChange={setRated}
                value={rated}
                count={10}
                style={{ fontSize: 14 }}
                onClick={filterRanked(id, rated)}
              />
            </>
          }
          avatar={
            poster_path && <Image src={`https://image.tmdb.org/t/p/original${poster_path}`} width={153} height={280} />
          }
        />
      </Grid>
    </Card>
  );
}
