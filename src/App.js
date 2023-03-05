import { useState, useEffect, useMemo } from 'react';
import { Tabs, Layout, Pagination, Alert, message } from 'antd';
import debounce from 'lodash.debounce';

// import { Offline, Online } from 'react-detect-offline';

import { Context } from './Context';
import { ContentMovies } from './components/content-movies';
import service from './service/service';

const { Footer } = Layout;

function App() {
  const [movies, setMovies] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [genresList, setGengesList] = useState({});
  const [page, setPage] = useState(1);
  const [fiteredMovies, setFiteredMovies] = useState([]);
  const [ratedMoviesList, setRatedMoviesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [clickRate, setClickRate] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    setLoading(true);
    service
      .getGenres()
      .then((res) => {
        setGengesList(res);
      })
      .catch((e) => {
        errorMessage(e);
      });
    service.createGuestSession();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    service
      .getData(null, page)
      .then((res) => {
        setLoading(false);
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
  }, [page]);

  const errorMessage = (error) => {
    messageApi.open({
      content: <Alert message={error.message} type="error" showIcon banner />,
      duration: 3,
    });
  };
  const ratedMessage = ({ status_message }) => {
    if (status_message) {
      messageApi.open({
        type: 'success',
        content: status_message,
        duration: 3,
      });
    }
  };
  const searchInput = (event) => {
    setText(event.target.value);
    debouceSearchInput(event.target.value);
  };

  const getSearchMovies = (text) => {
    setLoading(true);
    console.log(text);

    service
      .getData(text, page)
      .then((res) => {
        setLoading(false);
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
  };
  const debouceSearchInput = useMemo(() => debounce(getSearchMovies, 500), []);

  const items = [
    {
      key: '1',
      label: 'Search',
      children: (
        <>
          <ContentMovies
            movies={movies}
            genresList={genresList}
            loading={loading}
            error={error}
            // getData={service.getData} //<--debounce здесь
            ratedMoviesList={ratedMoviesList}
            ratedMessage={ratedMessage}
            clickRate={clickRate}
            searchInput={searchInput}
            // searchInput={debouceSearchInput}
            text={text}
          />
          <Footer>
            <Pagination
              width="100vw"
              defaultCurrent={1}
              current={searchData.page}
              total={searchData.total_results}
              onChange={setPage}
              pageSize={20}
            />
          </Footer>
        </>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: (
        <>
          <ContentMovies
            movies={ratedMoviesList}
            genresList={genresList}
            loading={loading}
            error={error}
            getData={service.getData}
            ratedMessage={ratedMessage}
            clickRate={clickRate}
          />
          <Footer>
            <Pagination
              width="100vw"
              defaultCurrent={1}
              current={fiteredMovies.page}
              total={fiteredMovies.total_results}
              onChange={setPage}
              pageSize={20}
            />
          </Footer>
        </>
      ),
    },
  ];

  const ratedMovies = (event) => {
    setLoading(true);
    if (event == 2) {
      setClickRate(true);
      service
        .getRatedMoviesGuest()
        .then((res) => {
          setLoading(false);
          setFiteredMovies(res);
          setRatedMoviesList(res.results);
        })
        .catch((e) => {
          setError(e);
        });
    }
    if (event == 1) {
      setClickRate(false);
      service
        .getData(null, 1)
        .then((res) => {
          setLoading(false);
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
    }
  };

  // console.log(loading);
  return (
    <div className="App">
      {/* <Offline>
          <Alert message="Отсутствует соединение с интернетом, проверьте подключение" type="error" showIcon />
        </Offline>
        <Online> */}
      <Context.Provider value={genresList}>
        {contextHolder}
        <Layout>
          <Tabs defaultActiveKey="1" centered items={items} onChange={ratedMovies} />
        </Layout>
      </Context.Provider>
      {/* </Online> */}
    </div>
  );
}

export default App;
