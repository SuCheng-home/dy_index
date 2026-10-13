import fetch from '@/utils/fetch';

export function getList() {
  return fetch({
    url: '/article/list',
    method: 'post'
  });
}

export function getArticle() {
  return fetch({
    url: '/article/detail',
    method: 'post'
  });
}

