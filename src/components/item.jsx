import React, { useState, useEffect } from 'react';
import { Card, Space, Image, Tag, Typography } from 'antd';
import { format } from 'date-fns';

const { Meta, Grid } = Card;
const { Paragraph, Text, Title } = Typography;

export function MovieItem() {
  const _key = 'b86a8d724a602ddbef697c551c95e01d';
  const _idMovie = '550';
  const url = `https://api.themoviedb.org/3/movie/${_idMovie}?api_key=${_key}&language=es_US`;

  const [movie, setMovie] = useState({});
  const { title, release_date, overview, genres, poster_path } = movie;

  const getData = async () =>
    await fetch(url)
      .then((response) => response.json())
      .then((res) => setMovie(res));
  useEffect(() => {
    getData();
  }, []);

  const EllipsisMod = ({ children }) => {
    const text = children;
    return (
      <Paragraph
        ellipsis={{
          rows: 6,
          expandable: true,
          symbol: '...',
        }}
      >
        {text}
      </Paragraph>
    );
  };

  return (
    <Space
      style={{
        display: 'flex',
        width: 1010,
        height: 570,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        backgroundColor: 'GrayText',
      }}
    >
      <Card hoverable style={{ padding: 1 }}>
        <Grid style={{ height: 'auto' }}>
          <Meta
            style={{ width: 405, textAlign: 'start' }}
            title={
              title && (
                <Title level={3} style={{ margin: 0 }}>
                  {title}
                </Title>
              )
            }
            description={
              <>
                <Text type="secondary">{release_date && format(new Date(release_date), 'MMMM d, yyyy')}</Text>
                <Paragraph style={{ margin: 5, marginLeft: 0 }}>
                  {genres && genres.map((genre) => <Tag key={genre.id}>{genre.name}</Tag>)}
                </Paragraph>
                {overview && <EllipsisMod>{overview}</EllipsisMod>}
              </>
            }
            avatar={
              poster_path && (
                <Image src={`https://image.tmdb.org/t/p/original${poster_path}`} width={153} height={240} />
              )
            }
          />
        </Grid>
      </Card>
    </Space>
  );
}
