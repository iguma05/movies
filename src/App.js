import { useState, useEffect } from 'react';
import { Space, Input, Menu, Layout, Pagination } from 'antd';

import { MovieItem } from './components/item';
const { Header, Content } = Layout;

function App() {
  const [movies, setMovies] = useState([]);
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState({});
  const [page, setPage] = useState(1);

  const _key = 'b86a8d724a602ddbef697c551c95e01d';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${_key}&query=${value || 'return'}&page=${page}`;

  const getData = async () =>
    await fetch(url)
      .then((response) => response.json())
      .then((res) => {
        setSearchData(res);
        setMovies(res.results);
      });
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
  // console.log(movies);
  // console.log(searchData);

  return (
    <div className="App">
      {/* <MovieItem /> */}
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
          />
        </Header>
        <Content>
          <Input
            style={{ width: '90vw', margin: 30 }}
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
            {movies &&
              movies.map((movie) => {
                return <MovieItem key={movie.id} {...movie} />;
              })}
            <Pagination
              width="100vw"
              defaultCurrent={1}
              current={searchData.page}
              total={searchData.total_results}
              onChange={setPage}
            />
          </Space>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
