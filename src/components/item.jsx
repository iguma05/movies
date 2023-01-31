import React, { useState, useEffect } from 'react';
import { Card, Space, Image, Tag, Typography } from 'antd';
// import { format } from 'date-fns';
// import {  } from 'date-fns/locale/eo';

const { Meta, Grid } = Card;
const { Paragraph, Text, Title } = Typography;

export function MovieItem() {
  const _key = 'b86a8d724a602ddbef697c551c95e01d';
  const _idMovie = '550';
  const url = `https://api.themoviedb.org/3/movie/${_idMovie}?api_key=${_key}&language=es_US`;

  const [movie, setMovie] = useState({});
  const { title, release_date, overview, genres, poster_path } = movie;

  //
  // const date = format(new Date(release_date), 'do "de" MMMM yyyy', {
  //   locale: eoLocale,
  // });

  const getData = async () => {
    await fetch(url)
      .then((response) => response.json())
      .then((res) => setMovie(res));
  };
  // console.log(movie);
  useEffect(() => getData(), []);

  const CreateGenres = () => {
    let newGenres = [];
    for (let index in genres) {
      newGenres.push({ key: genres[index]['id'], name: genres[index]['name'] });
    }
    return newGenres.map((genre) => <Tag key={genre.key}>{genre.name}</Tag>);
  };

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
    <>
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
        <Card hoverable style={{ height: 280, padding: 1 }}>
          <Grid style={{ maxHeight: 280 }}>
            <Meta
              style={{ width: 405, textAlign: 'start' }}
              title={
                <Title level={3} style={{ margin: 0 }}>
                  {title}
                </Title>
              }
              description={
                <>
                  <Text type="secondary">{release_date}</Text>
                  <Paragraph style={{ margin: 5, marginLeft: 0 }}>
                    <CreateGenres />
                  </Paragraph>
                  <EllipsisMod suffixCount={103}>{overview}</EllipsisMod>
                </>
              }
              avatar={<Image src={`https://image.tmdb.org/t/p/original${poster_path}`} width={153} height={240} />}
            />
          </Grid>
        </Card>
      </Space>
    </>
  );
}
