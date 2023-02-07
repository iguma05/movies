import { useState, useEffect } from 'react';
import { Space, Input, Menu, Layout, Pagination, Divider, Spin, Alert, message } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import { MovieItem } from './components/item';
const { Header, Content, Footer } = Layout;

function App() {
  const [movies, setMovies] = useState([]);
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState({});
  const [genresList, setGengesList] = useState({});
  const [page, setPage] = useState(1);
  const [fiteredMovies, setFiteredMovies] = useState(movies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const _key = 'b86a8d724a602ddbef697c551c95e01d';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${_key}&query=${value || 'return'}&page=${page}`;
  const urlGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${_key}`;

  const getData = async () => {
    setLoading(true);
    await fetch(urlGenres)
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
    await fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Шеф, все пропало');
        }
      })
      .then((res) => {
        setSearchData(res);
        setMovies(res.results);
      })
      .catch((e) => {
        setError(e);
        errorMessage(e);
      });
    setLoading(false);
  };
  useEffect(() => {
    getData();
    setValue('');
  }, [page]);

  const errorMessage = (error) => {
    messageApi.open({
      content: <Alert message={error.message} type="error" showIcon banner />,
      duration: 5,
    });
  };

  const searchInput = (event) => {
    setValue(event.target.value);
  };

  const getSearch = (event) => {
    setLoading(true);
    if (event.key === 'Enter') {
      if (value.length) {
        getData();
        setLoading(false);
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
                backgroundColor: '#f5f5f5',
                justifyContent: 'center',
              }}
            >
              {error && <Alert message={error.message} type="error" showIcon width="100%" />}
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
