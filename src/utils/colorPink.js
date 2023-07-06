export const ColorPink = () => {
  const backList = [
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(180deg, rgba(72,74,85,1) 0%, rgba(66,69,82,1) 100%)',
    },
    {
      color: '#454754',
      backColor: 'linear-gradient(135deg, rgba(253,235,113,1) 0%, rgba(248,216,0,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(171,220,255,1) 0%, rgba(3,150,255,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(254,182,146,1) 0%, rgba(234,84,85,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(206,159,252,1) 0%, rgba(115,103,240,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(255,246,183,1) 0%, rgba(246,65,108,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(129,251,184,1) 0%, rgba(40,199,111,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(146,255,192,1) 0%, rgba(0,38,97,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(94,252,232,1) 0%, rgba(115,110,254,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(254,193,99,1) 0%, rgba(222,67,19,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(255,170,133,1) 0%, rgba(179,49,95,1) 100%)',
    },
    {
      color: '#FFFFFF',
      backColor: 'linear-gradient(135deg, rgba(67,203,255,1) 0%, rgba(151,8,204,1) 100%)',
    },
  ];

  // 兼容认养一头牛，后续支持用户上传后删除
  const appId = localStorage.getItem('appId') || '';
  const tId = localStorage.getItem('tId') || '';
  console.log(appId, tId);
  if (appId == '20200314' && tId == '54' || appId == '2020032076' && tId == '119') {
    backList.push({
      color: '#FFFFFF',
      backColor:
        'url("https://img.kxll.com/admin_manage/brand/memberCard/xinren.png")',
    });
    backList.push({
      color: '#FFFFFF',
      backColor:
        'url("https://img.kxll.com/admin_manage/brand/memberCard/daren.png")',
    });
    backList.push({
      color: '#FFFFFF',
      backColor:
        'url("https://img.kxll.com/admin_manage/brand/memberCard/hongren.png")',
    });
    backList.push({
      color: '#FFFFFF',
      backColor:
        'url("https://img.kxll.com/admin_manage/brand/memberCard/hehuoren.png")',
    });
  }
  return backList;
};
