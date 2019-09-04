/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import { request } from 'tool';
import JrMessage from 'ui/JrMessage';

const nationData = localStorage.getItem('nationData'); // 民族列表
const countryData = localStorage.getItem('countryData'); // 国家列表
const cardTypeData = localStorage.getItem('cardTypeData'); // 证件类型列表
const perTypeData = localStorage.getItem('perTypeData'); // 人员类别
const sexData = localStorage.getItem('sexData'); // 性别列表
const noIdeaData = localStorage.getItem('noIdeaData'); // 左右缺失情况列表

const globdata = {
  nationData: JSON.parse(nationData) || [],
  countryData: JSON.parse(countryData) || [],
  cardTypeData: JSON.parse(cardTypeData) || [],
  perTypeData: JSON.parse(perTypeData) || [],
  sexData: JSON.parse(sexData) || [],
  noIdeaData: JSON.parse(noIdeaData) || [],
};

// 获取各种类型列表
const getDataList = (name, key, text) => {
  request({
    url: `/${name}/list?t=${new Date() * 1}`,
    param: {},
    method: 'get',
    // onError: err => {
    //   console.log('err---', err);
    // },
  }).then(res => {
    if (res.code === 200) {
      // const arr = [{ code: '', name: '请选择' }];
      const arr = [];
      for (let i = 0; i < res.content.length; i++) {
        arr.push(res.content[i]);
      }
      localStorage.setItem(key, JSON.stringify(arr));
      globdata[key] = arr;
    } else {
      JrMessage.error(`${text}获取失败`, '', 0.5);
    }
    // console.log(`${name}--------`,res)
  });
};
const getNationList = () => {
  getDataList('nation', 'nationData', '民族列表'); // nation/list 民族列表
};
const getCountryList = () => {
  getDataList('country', 'countryData', '国家列表'); // nation/list 国家列表
};
const getCardgroupList = () => {
  getDataList('cardgroup', 'cardTypeData', '证件类型列表'); // nation/list 证件类型列表
};
const getSyusergroupList = () => {
  getDataList('syusergroup', 'perTypeData', '人员类别'); // nation/list 人员类别
};
const getSexList = () => {
  getDataList('sex', 'sexData', '性别列表'); // nation/list 性别列表
};
const getNoIdeaList = () => {
  getDataList('syeyehurttype', 'noIdeaData', '左右眼缺失情况列表'); // nation/list 性别列表
};
export const getDataByName = name => {
  if (name === 'nation') {
    getNationList();
  }
  if (name === 'country') {
    getCountryList();
  }
  if (name === 'cardgroup') {
    getCardgroupList();
  }
  if (name === 'syusergroup') {
    getSyusergroupList();
  }
  if (name === 'sex') {
    getSexList();
  }
  if (name === 'syeyehurttype') {
    getNoIdeaList();
  }
};
if (globdata.nationData.length === 0) {
  getNationList();
}
if (globdata.countryData.length === 0) {
  getCountryList();
}
if (globdata.cardTypeData.length === 0) {
  getCardgroupList();
}
if (globdata.perTypeData.length === 0) {
  getSyusergroupList();
}
if (globdata.sexData.length === 0) {
  getSexList();
}
if (globdata.noIdeaData.length === 0) {
  getNoIdeaList();
}

const getDataOfLength = (tag, dataName, text) => {
  getDataList(tag, dataName, text);
};

export const getData = () => globdata;

export const allDataMapFn = (tag, key, val) => {
  const {
    nationData,
    countryData,
    cardTypeData,
    perTypeData,
    sexData,
    noIdeaData,
  } = globdata;
  let data = [];
  let dataName = '';
  let text = '';
  if (tag === 'nation') {
    data = nationData;
    dataName = 'nationData';
    text = '民族列表';
  }
  if (tag === 'country') {
    data = countryData;
    dataName = 'countryData';
    text = '国家列表';
  }
  if (tag === 'cardgroup') {
    data = cardTypeData;
    dataName = 'cardTypeData';
    text = '证件类型列表';
  }
  if (tag === 'syusergroup') {
    data = perTypeData;
    dataName = 'perTypeData';
    text = '人员类别';
  }
  if (tag === 'sex') {
    data = sexData;
    dataName = 'sexData';
    text = '性别列表';
  }
  if (tag === 'syeyehurttype') {
    data = noIdeaData;
    dataName = 'noIdeaData';
    text = '左右眼缺失情况列表';
  }
  if (data.length === 0) {
    getDataOfLength(tag, dataName, text);
  }
  const arr = data.filter(item => item[key] === val)[0];
  let value = '';
  $.each(arr, (k, v) => {
    if (k === 'name') {
      value = v;
    }
  });
  return value;
};

export const nationMapFn = (key, val) => {
  const { nationData } = globdata;
  const arr = nationData.filter(item => item[key] === val)[0];
  let value = '';
  $.each(arr, (k, v) => {
    if (k === 'name') {
      value = v;
    }
  });
  return value;
};

export const countryMapFn = (key, val) => {
  const { countryData } = globdata;
  const arr = countryData.filter(item => item[key] === val)[0];
  let value = '';
  $.each(arr, (k, v) => {
    if (k === 'name') {
      value = v;
    }
  });
  return value;
};

export const cardTypeMapFn = (key, val) => {
  const { cardTypeData } = globdata;
  const arr = cardTypeData.filter(item => item[key] === val)[0];
  let value = '';
  $.each(arr, (k, v) => {
    if (k === 'name') {
      value = v;
    }
  });
  return value;
};

export const perTypeMapFn = (key, val) => {
  const { perTypeData } = globdata;
  const arr = perTypeData.filter(item => item[key] === val)[0];
  let value = '';
  $.each(arr, (k, v) => {
    if (k === 'name') {
      value = v;
    }
  });
  return value;
};

export const sexMapFn = (key, val) => {
  const { sexData } = globdata;
  const arr = sexData.filter(item => item[key] === val)[0];
  let value = '';
  $.each(arr, (k, v) => {
    if (k === 'name') {
      value = v;
    }
  });
  return value;
};
