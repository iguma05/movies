import { useState, useEffect } from 'react';
import { Menu, Layout, Pagination, Alert, message } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import { Context } from './Context';
import { ContentMovies } from './components/content-movies';
const { Header, Footer } = Layout;

const _key = 'b86a8d724a602ddbef697c551c95e01d';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [genresList, setGengesList] = useState({});
  const [page, setPage] = useState(1);
  const [fiteredMovies, setFiteredMovies] = useState([]);
  const [ratedMoviesList, setRatedMoviesList] = useState([]);
  const [clickRate, setClickRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getData = async (value) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${_key}&query=${value || 'return'}&page=${page}`;
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
    const urlGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${_key}`;
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

  const createGuestSession = async () => {
    if (!localStorage.getItem('guest_session')) {
      const urlGuestSession =
        'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=b86a8d724a602ddbef697c551c95e01d';
      await fetch(urlGuestSession)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Сессия не создана');
          }
        })
        .then((res) => localStorage.setItem('guest_session', JSON.stringify(res)));
    }
  };

  const getRatedMoviesGuest = async () => {
    const { guest_session_id } = JSON.parse(localStorage.getItem('guest_session'));
    const urlRatedMovies = `https://api.themoviedb.org/3/guest_session/${guest_session_id}/rated/movies?api_key=${_key}&language=en-US&sort_by=created_at.asc`;

    await fetch(urlRatedMovies)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Что-то пошло не так с оцененными фильмами');
        }
      })
      .then((res) => setFiteredMovies(res))
      .catch((e) => {
        setError(e);
      });
  };

  useEffect(() => {
    setLoading(true);
    getData();
  }, [page]);

  useEffect(() => {
    setLoading(true);
    getGenres();
    createGuestSession();
  }, []);
  useEffect(() => {
    getRatedMoviesGuest();
  }, [fiteredMovies]);

  const errorMessage = (error) => {
    messageApi.open({
      content: <Alert message={error.message} type="error" showIcon banner />,
      duration: 3,
    });
  };
  const ratedMessage = ({ status_message }) => {
    messageApi.open({
      type: 'success',
      content: status_message,
      duration: 3,
    });
  };

  const ratedMovies = (event) => {
    if (event.key === '2') {
      const { results } = fiteredMovies;
      setClickRate(true);
      if (results) {
        setRatedMoviesList(results);
      }
    }
    if (event.key === '1') {
      setClickRate(false);
      setRatedMoviesList(null);
    }
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
              />
            </Header>
            <ContentMovies
              movies={movies}
              genresList={genresList}
              loading={loading}
              error={error}
              getData={getData}
              ratedMoviesList={ratedMoviesList}
              clickRate={clickRate}
              ratedMessage={ratedMessage}
            />
            <Footer>
              {!clickRate ? (
                <Pagination
                  width="100vw"
                  defaultCurrent={1}
                  current={searchData.page}
                  total={searchData.total_results}
                  onChange={setPage}
                />
              ) : (
                <Pagination
                  width="100vw"
                  defaultCurrent={1}
                  current={fiteredMovies.page}
                  total={fiteredMovies.total_results}
                  onChange={setPage}
                />
              )}
            </Footer>
          </Layout>
        </Online>
      </Context.Provider>
    </div>
  );
}

export default App;
