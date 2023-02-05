import { useState, useEffect } from 'react';
import { Space, Input, Menu, Layout, Pagination, Divider } from 'antd';

import { MovieItem } from './components/item';
const { Header, Content, Footer } = Layout;

function App() {
  const [movies, setMovies] = useState([]);
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState({});
  const [genresList, setGengesList] = useState({});
  const [page, setPage] = useState(1);
  const [fiteredMovies, setFiteredMovies] = useState(movies);

  const _key = 'b86a8d724a602ddbef697c551c95e01d';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${_key}&query=${value || 'return'}&page=${page}`;
  const urlGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${_key}`;

  const getData = async () => {
    await fetch(urlGenres)
      .then((response) => response.json())
      .then((res) => setGengesList(res));
    await fetch(url)
      .then((response) => response.json())
      .then((res) => {
        setSearchData(res);
        setMovies(res.results);
      });
  };
  useEffect(() => {
    getData();
    setValue('');
  }, [page]);

  const searchInput = (event) => {
    setValue(event.target.value);
  };

  const getSearch = (event) => {
    if (event.key === 'Enter') {
      if (value.length) {
        getData();
      }
    }
  };
  const ratedMovies = () => {
    const id = JSON.parse(localStorage.getItem('id'));
    const newData = fiteredRatedMovies(id, movies);
    setFiteredMovies(newData);
  };
  const fiteredRatedMovies = (id, data) => {
    data.map((item) => {
      if (item.id === id) {
        setMovies([item]);
      }
    });
  };
  return (
    <div className="App">
      <Layout>
        <Header>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ justifyContent: 'center' }}
            items={[
              {
                key: 1,
                label: 'Search',
              },
              {
                key: 2,
                label: 'Rated',
              },
            ]}
            onClick={ratedMovies}
            onChange={() => fiteredRatedMovies(fiteredMovies, movies)}
          />
        </Header>
        <Content style={{ width: '1010px' }}>
          <Input
            style={{ width: '900px', margin: 30 }}
            placeholder="Type to search..."
            value={value}
            onChange={searchInput}
            onKeyUp={getSearch}
          />
          <Space
            style={{
              display: 'flex',
              // width: '100vw',

              // height: 570,
              flexWrap: 'wrap',
              backgroundColor: 'GrayText',
              justifyContent: 'center',
            }}
          >
            {/* {fiteredMovies &&
              fiteredMovies.map((movie) => {
                console.log(movie);
              })} */}
            {/* <Divider /> */}
            {fiteredMovies &&
              fiteredMovies.map((movie) => <MovieItem key={movie.id} {...movie} genresList={genresList} />)}
            {movies && movies.map((movie) => <MovieItem key={movie.id} {...movie} genresList={genresList} />)}
            <Divider />
          </Space>
        </Content>
        <Footer>
          <Pagination
            width="100vw"
            defaultCurrent={1}
            current={searchData.page}
            total={searchData.total_results}
            onChange={setPage}
          />
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
