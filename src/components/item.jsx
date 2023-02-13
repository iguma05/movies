import React, { useState } from 'react';
import { Card, Image, Tag, Typography, Rate } from 'antd';
import { format } from 'date-fns';

import { Context } from '../Context';

const { Meta, Grid } = Card;
const { Paragraph, Text, Title } = Typography;

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
  const [rated, setRated] = useState(0);

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
  const filterRanked = (id, rated) => {
    if (rated > 0) {
      localStorage.setItem('id', id);
      localStorage.setItem('rated', rated);
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
