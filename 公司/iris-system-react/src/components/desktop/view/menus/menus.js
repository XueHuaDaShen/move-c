/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import iconhome from 'static/img/leftbar/home.png';
import iconhomed from 'static/img/leftbar/homeed.png';
import iconcjsb from 'static/img/leftbar/cjsb.png';
import iconcjsbed from 'static/img/leftbar/cjsbed.png';
import iconcjdata from 'static/img/leftbar/cjdata.png';
import iconcjdataed from 'static/img/leftbar/cjdataed.png';
import iconsbdata from 'static/img/leftbar/sbdata.png';
import iconsbdataed from 'static/img/leftbar/sbdataed.png';
import iconinfo from 'static/img/leftbar/info.png';
import iconinfoed from 'static/img/leftbar/infoed.png';
// import iconset from 'static/img/leftbar/set.png';
// import iconseted from 'static/img/leftbar/seted.png';
import Home from '../home/home';
import Cj from '../cjsb/cj/cj';
import Sb from '../cjsb/sb/sb';
import Hy from '../cjsb/hy/hy';
import CjLog from '../cjData/log/log';
import CjCountPeople from '../cjData/countPeople/countPeople';
import CjCountTime from '../cjData/countTime/countTime';
import CjSearchId from '../cjData/searchId/searchId';
import SbLog from '../sbData/log/log';
import SbCountPeople from '../sbData/countPeople/countPeople';
import SbCountTime from '../sbData/countTime/countTime';
import SbSearchId from '../sbData/searchId/searchId';
import Admin from '../baseInfo/admin/admin';
import DeviceParam from '../baseInfo/deviceParam/deviceParam';
// import Personal from '../baseInfo/personal/personal';

const menus = [
  {
    name: '主页',
    order: '1',
    url: 'home',
    icon: iconhome,
    iconed: iconhomed,
    content: callback => <Home onSelectMenu={callback} />,
  },
  {
    name: '采集识别',
    order: '2',
    icon: iconcjsb,
    iconed: iconcjsbed,
    child: [
      {
        name: '虹膜采集',
        url: 'cj',
        content: callback => <Cj onSelectMenu={callback} />,
      },
      {
        name: '虹膜识别',
        url: 'sb',
        content: callback => <Hy onSelectMenu={callback} />,
      }, // 识别和核验的页面内容反了，所以直接换模板 ⬇
      {
        name: '虹膜核验',
        url: 'hy',
        content: callback => <Sb onSelectMenu={callback} />,
      }, // 识别和核验的页面内容反了，所以直接换模板 ⬆
    ],
  },
  {
    name: '采集数据管理',
    order: '3',
    icon: iconcjdata,
    iconed: iconcjdataed,
    child: [
      {
        name: '采集记录',
        url: 'cj_log',
        content: callback => <CjLog onSelectMenu={callback} />,
      },
      {
        name: '采集量统计(人)',
        url: 'cj_count_pepole',
        content: callback => <CjCountPeople onSelectMenu={callback} />,
      },
      {
        name: '采集量统计(时间)',
        url: 'cj_count_time',
        content: callback => <CjCountTime onSelectMenu={callback} />,
      },
      {
        name: '批量查询(采集)',
        url: 'cj_search_id',
        content: callback => <CjSearchId onSelectMenu={callback} />,
      },
    ],
  },
  {
    name: '识别数据管理',
    order: '4',
    icon: iconsbdata,
    iconed: iconsbdataed,
    child: [
      {
        name: '识别记录',
        url: 'sb_log',
        content: callback => <SbLog onSelectMenu={callback} />,
      },
      {
        name: '识别量统计(人)',
        url: 'sb_count_pepole',
        content: callback => <SbCountPeople onSelectMenu={callback} />,
      },
      {
        name: '识别量统计(时间)',
        url: 'sb_count_time',
        content: callback => <SbCountTime onSelectMenu={callback} />,
      },
      {
        name: '批量查询(识别)',
        url: 'sb_search_id',
        content: callback => <SbSearchId onSelectMenu={callback} />,
      },
    ],
  },
  {
    name: '基础信息管理',
    order: '5',
    icon: iconinfo,
    iconed: iconinfoed,
    child: [
      // { name: '人员信息维护', url: 'personal', content: callback => <Personal onSelectMenu={callback} /> },
      {
        name: '操作员管理',
        url: 'admin',
        content: callback => <Admin onSelectMenu={callback} />,
      },
      {
        name: '设备请求参数',
        url: 'deviceParam',
        content: callback => <DeviceParam onSelectMenu={callback} />,
      },
    ],
  },
  // {
  //   name: '系统设置',
  //   order: '6',
  //   icon: iconset,
  //   iconed: iconseted,
  //   child: [
  //     { name: '虹膜采集', url: '虹膜采集' },
  //     { name: '虹膜识别', url: '虹膜识别' },
  //   ],
  // },
];
export const fomartMenu = (data, arr = []) => {
  if (data.length === 0) return arr;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    menus.map(menu => {
      if (item.name === menu.name) {
        if (
          menu.child &&
          menu.child.length > 0 &&
          item.child.length !== menu.child.length
        ) {
          const obj = {
            name: menu.name,
            order: menu.order,
            icon: menu.icon,
            iconed: menu.iconed,
            child: [],
          };
          item.child.map(v => {
            menu.child.map(m => {
              if (v.name === m.name) {
                obj.child.push(m);
              }
            });
          });
          arr.push(obj);
        } else {
          arr.push(menu);
        }
      }
    });
  }
  return arr;
};
export const matchMenu = url => {
  if (!url) return {};
  const arr = [];
  menus.map(menu => {
    if (menu.child) {
      arr.push(...menu.child);
    } else {
      arr.push(menu);
    }
  });
  const obj = arr.filter(menu => menu.url === url)[0];
  return obj;
};
