const solutionList = [
  {
    title: '智慧出行',
    showImg: require('@/assets/img/solution/1.jpg'),
    info: '为积极响应“四型机场”战略部署，机场内部人员分级管控，乘客身份高效精准识别显得尤为重要。利用虹膜人脸融合识别技术实现乘客从取票——托运——差异化安检——登机一条龙精准服务，提高机场安全与效率，增强乘客体验。同时对机场工作区进行分级管控，减少内部人员疏漏导致的安全事故。',
    infoImg: require('@/assets/img/solution/info1.png'),
    infoData: [
      {
        img: require('@/assets/img/solution/1/1.png'),
        title: '双重精度确保人员身份',
      },
      {
        img: require('@/assets/img/solution/1/2.png'),
        title: '差异化安检提升乘客体验',
      },
      {
        img: require('@/assets/img/solution/1/3.png'),
        title: '秒级响应提高安检效率',
      }
    ]
  },
  {
    title: '智慧安防',
    showImg: require('@/assets/img/solution/2.jpg'),
    info: '现行出入境安检识别乘客身份及信息主要采用护照、票面信息和人工辨识面部特征来辨别，智能化程度低，验放效率低，且存在着识别不准确的隐患，使得不法分子有机可乘，不能很好的起到防范作用，给港口及乘客的安全带来了隐患。建设以虹膜识别为核心的出入境人员身份识别系统，安检时对出入境人员与重点关注人员库进行实时比对，有效防止人员伪装身份的恐怖分子造成危害。',
    infoImg: require('@/assets/img/solution/info2.png'),
    infoData: [
      {
        img: require('@/assets/img/solution/2/1.png'),
        title: '秒级响应提高通关效率',
      },
      {
        img: require('@/assets/img/solution/2/2.png'),
        title: '防止人员身份洗白回流',
      },
      {
        img: require('@/assets/img/solution/2/3.png'),
        title: '适用于海/陆/空港部署',
      }
    ]
  },
  {
    title: '智慧工地',
    showImg: require('@/assets/img/solution/3.jpg'),
    info: '智慧工地建设有效避免出现各种意外疏漏，自然就能大程度降低施工环境出现的损失，提高施工安全性，在现代智慧工地发展进程中，具有重要的意义和作用。智慧工地建设主要体现在施工人员实名制管理与监控系统智能化提升两个方面。虹膜识别弥补了工地环境复杂导致指纹、人脸等传统身份认证方式不可行疏漏。烟火检测、安全帽检测等智能算法对原有监控系统进行改进，有效排除工地安全隐患。',
    infoImg: require('@/assets/img/solution/info3.png'),
    infoData: [
      {
        img: require('@/assets/img/solution/3/1.png'),
        title: '方便与住建部劳务系统对接',
      },
      {
        img: require('@/assets/img/solution/3/2.png'),
        title: '快速依靠已有基础设施改造',
      },
      {
        img: require('@/assets/img/solution/3/3.png'),
        title: '身份精准管理隐患提前预报',
      }
    ]
  },
  {
    title: '智慧金融',
    showImg: require('@/assets/img/solution/4.jpg'),
    info: '随着银行机构内部作案、内外联合作案日益增多，银行安全防范系统提升尤为重要，其中门禁系统和银行业务系统在银行整个安防系统中占据了最主要的地位。利用虹膜人脸融合的身份识别方式，严格按照权限进行门禁管理、业务系统登录管理，提高银行安全规范化、科学化的管理水平，用高效的技术防范手段对银行安全实行事前的主动防范，是银行安全防范的必要发展趋势。',
    infoImg: require('@/assets/img/solution/info4.png'),
    infoData: [
      {
        img: require('@/assets/img/solution/4/1.png'),
        title: '多重识别确保人员身份',
      },
      {
        img: require('@/assets/img/solution/4/2.png'),
        title: '易于集成快速对接',
      },
      {
        img: require('@/assets/img/solution/4/3.png'),
        title: '三维交互提高客户体验',
      }
    ]
  },
  {
    title: '智慧考试',
    showImg: require('@/assets/img/solution/5.jpg'),
    info: '我国正式实施的《刑法修正案(九)》明确，在法律规定的国家考试中，组织作弊等行为将入刑定罪，替考是作弊行为的一种，因此考生身份精准识别与安全管理尤为重要。建立考生虹膜人脸数据库，量子加密下发考生信息到考场识别设备，有效的保证了考试公平性，国家选拔人才的公正性。',
    infoImg: require('@/assets/img/solution/info5.png'),
    infoData: [
      {
        img: require('@/assets/img/solution/5/1.png'),
        title: '双重精度确保人员身份',
      },
      {
        img: require('@/assets/img/solution/5/2.png'),
        title: '量子加密保护信息安全',
      },
      {
        img: require('@/assets/img/solution/5/3.png'),
        title: '秒级响应提高入场效率',
      }
    ]
  },
]


// 给每一项添加唯一id
const addId = () => {
  for(let i=0; i<solutionList.length; i++) {
    solutionList[i].id = (i+1)
  }
}
addId();

export default solutionList;