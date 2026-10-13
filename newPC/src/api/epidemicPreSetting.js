import { systemFetch } from '@/utils/fetch';

export function covidAbcfyUpdateSyncSchool() {
  return systemFetch({
      url: 'covidAbcfy/updateSyncSchool',
      method: 'get'
  });
}

export function covidAbcfyUpdateSyncStudentBatch() {
  return systemFetch({
      url: 'covidAbcfy/updateSyncStudentBatch',
      method: 'get'
  });
}