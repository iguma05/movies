import { useState, useEffect, useMemo } from 'react';
import { Space, Input, Menu, Layout, Pagination, Divider, Spin, Alert, message } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import debounce from 'lodash.debounce';

import { MovieItem } from './components/item';
const { Header, Content, Footer } = Layout;

function App() {
  const [movies, setMovies] = useState([]);
  const [text, setText] = useState('');
  const [searchData, setSearchData] = useState({});
  const [genresList, setGengesList] = useState({});
  const [page, setPage] = useState(1);
  const [fiteredMovies, setFiteredMovies] = useState(movies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getData = async (value) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=b86a8d724a602ddbef697c551c95e01d&query=${
      value || 'return'
    }&page=${page}`;
    setLoading(true);
    setError(null);
    await fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Шеф, все пропало');
        }
      })
      .then((res) => {
        console.log(res);
        setSearchData(res);
        setMovies(res.results);
        if (!res.results.length) {
          throw new Error('Ничего не найдено');
        }
      })
      .catch((e) => {
        setError(e);
        errorMessage(e);
      });
    setLoading(false);
  };

  const getGenres = () => {
    const urlGenres = 'https://api.themoviedb.org/3/genre/movie/list?api_key=b86a8d724a602ddbef697c551c95e01d';
    setLoading(true);
    fetch(urlGenres)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Сервер не подгрузил жанры');
        }
      })
      .then((res) => setGengesList(res))
      .catch((e) => {
        errorMessage(e);
      });
  };

  useEffect(() => {
    setLoading(true);
    getData();
  }, [page]);

  useEffect(() => {
    setLoading(true);
    getGenres();
  }, []);

  const errorMessage = (error) => {
    messageApi.open({
      content: <Alert message={error.message} type="error" showIcon banner />,
      duration: 3,
    });
  };

  const searchInput = (event) => {
    setText(event.target.value);
    debouceSearchInput(event.target.value);
  };
  const debouceSearchInput = useMemo(() => debounce(getData, 500), []);

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
      <Offline>
        <Alert message="Отсутствует соединение с интернетом, проверьте подключение" type="error" showIcon />
      </Offline>
      <Online>
        {contextHolder}
        <Layout>
          <Header style={{ padding: 0 }}>
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
              {!loading &&
                fiteredMovies &&
                fiteredMovies.map((movie) => <MovieItem key={movie.id} {...movie} genresList={genresList} />)}
              {!loading &&
                movies &&
                movies.map((movie) => <MovieItem key={movie.id} {...movie} genresList={genresList} />)}
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
      </Online>
    </div>
  );
}

export default App;
