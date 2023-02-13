import { useState, useEffect } from 'react';
import { Menu, Layout, Pagination, Alert, message } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import { Context } from './Context';
import { ContentMovies } from './components/content-movies';
const { Header, Footer } = Layout;

function App() {
  const [movies, setMovies] = useState([]);
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

  const getGenres = async () => {
    const urlGenres = 'https://api.themoviedb.org/3/genre/movie/list?api_key=b86a8d724a602ddbef697c551c95e01d';
    setLoading(true);
    await fetch(urlGenres)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Сервер не подгрузил жанры');
        }
      })
      .then((res) => {
        setGengesList(res);
      })
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
      <Context.Provider value={genresList}>
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
            <ContentMovies
              movies={movies}
              fiteredMovies={fiteredMovies}
              genresList={genresList}
              loading={loading}
              error={error}
              getData={getData}
            />
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
      </Context.Provider>
    </div>
  );
}

export default App;
