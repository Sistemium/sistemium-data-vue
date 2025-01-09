import lo from 'lodash'
import axios, { AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import personData from './personData'
import { BaseItem, OFFSET_HEADER } from 'sistemium-data'
import matches from 'sistemium-data/lib/util/predicates'

export const people = personData()
export const PAGE_SIZE_HEADER = 'x-page-size'

export default function () {
  const axiosInstance = axios.create()
  const mock = new MockAdapter(axiosInstance)

  mock.onGet(/\/?Person\/.+/).reply(getPerson)
  mock.onGet(/\/?Person$/).reply(getPersonArray)
  mock.onPost(/\/?Person$/).reply(createPerson)
  mock.onPatch(/\/?Person\/.+/).reply(patchPerson)
  mock.onDelete(/\/?Person\/.+/).reply(deletePerson)

  mock.onAny().reply((config) => {
    console.error('mockAxios undefined route', config.method, config.url)
    return [401, '']
  })

  return axiosInstance
}

function deletePerson(config: AxiosRequestConfig) {
  // console.log(config);
  const id = getIdFromUrl(config.url)
  lo.remove(people, { id })
  return [204, '']
}

function createPerson(config: AxiosRequestConfig) {
  // console.log(config);
  const { data } = config
  const person = JSON.parse(data)
  person[OFFSET_HEADER] = new Date().getTime().toString()
  people.push(person)
  return [201, data]
}

function patchPerson(config: AxiosRequestConfig) {
  const id = getIdFromUrl(config.url)
  const { data } = config
  // console.log(data);
  const idx = lo.findIndex(people, { id })
  if (idx === -1) {
    return [404]
  }
  const newData = {
    ...people[idx],
    ...JSON.parse(data),
  }
  people.splice(idx, 1, newData)
  return [200, newData]
}

function getPerson(config: AxiosRequestConfig) {
  // console.log(config);

  const id = getIdFromUrl(config.url)
  const res = lo.find(people, { id })
  return [res ? 200 : 404, res]
}

function getPersonArray(config: AxiosRequestConfig): [number, any, BaseItem?] {
  // console.log(config);

  let response: any[] = []
  const headers: BaseItem = {}

  const {
    params,
    headers: { [OFFSET_HEADER]: offset, [PAGE_SIZE_HEADER]: pageSize },
  } = config as BaseItem & { params: BaseItem }

  if (params.emptyResponse) {
    return [204, null]
  }

  if (Object.keys(params).length) {
    const isMatch = matches(params)
    Array.prototype.push.apply(response, lo.filter(people, isMatch))
  } else {
    response.push(...people)
  }

  if (offset) {
    response = lo.filter(response, (person) => person[OFFSET_HEADER] > offset)
  }

  if (pageSize) {
    response = lo.take(response, pageSize)
  }

  if (offset) {
    headers[OFFSET_HEADER] = (lo.maxBy(response, OFFSET_HEADER) || {})[OFFSET_HEADER] || offset
  }

  return [response.length ? 200 : 204, response, headers]
}

function getIdFromUrl(url: string = '') {
  const [, id] = url.match(/\/(.+)$/) || []
  return id
}
