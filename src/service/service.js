// import { Component } from 'react';

class Service {
  _key = 'b86a8d724a602ddbef697c551c95e01d';
  BASE_URL = 'https://api.themoviedb.org/3/';

  getData = async (value, page) => {
    const url = `${this.BASE_URL}search/movie?api_key=${this._key}&query=${value || 'return'}&page=${page || '1'}`;
    return await fetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Шеф, все пропало');
      }
    });
  };

  getGenres = async () => {
    const urlGenres = `${this.BASE_URL}genre/movie/list?api_key=${this._key}`;
    return await fetch(urlGenres).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Сервер не подгрузил жанры');
      }
    });
  };

  createGuestSession = async () => {
    if (!localStorage.getItem('guest_session')) {
      const urlGuestSession = `${this.BASE_URL}authentication/guest_session/new?api_key=${this._key}`;
      return await fetch(urlGuestSession)
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

  getRatedMoviesGuest = async () => {
    const { guest_session_id } = JSON.parse(localStorage.getItem('guest_session'));
    const urlRatedMovies = `${this.BASE_URL}guest_session/${guest_session_id}/rated/movies?api_key=${this._key}&language=en-US&sort_by=created_at.asc`;

    return await fetch(urlRatedMovies).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Что-то пошло не так с оцененными фильмами');
      }
    });
  };
  postRatedMovies = async (movieId, value, sessionId) => {
    const urlRate = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this._key}&guest_session_id=${sessionId}`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: value }),
    };
    return await fetch(urlRate, requestOptions).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Что-то пошло не так с отправкой оценки');
      }
    });
  };
}

const service = new Service();

export default service;
