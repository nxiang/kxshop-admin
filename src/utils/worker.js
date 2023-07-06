// const messageList = data => http('get', '/kxshop/admin/trade/message/list', data);

function createWorker(f) {
  const blob = new Blob([`(${  f.toString()  })()`]);
  const url = window.URL.createObjectURL(blob);
  const worker = new Worker(url);
  return worker;
}

const pollingWorker = createWorker(function(e) {
  setInterval(list => {
    this.postMessage('start1');
    fetch('http://localhost:8888/proxy/kxshop/admin/trade/message/list');

    // let data = {
    //   method: 'get',
    //   url: '/kxshop/admin/trade/message/list',
    //   headers: {
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     // appId: "20191105",
    //     // tId: 2,
    //     // appId: localStorage.getItem('appId') || '20200214',
    //     // tId: localStorage.getItem('tId') || 43,
    //     // token: localStorage.getItem('token'),
    //     // userId: localStorage.getItem('userId'),
    //     clientId: 10,
    //   },
    // };

    // if (!data) {
    //   self.close();
    //   return false;
    // }
    // if (data.data && data.data.list && data.data.list instanceof Array) {
    //   const arr = list.concat(data.data.list);
    //   this.postMessage(arr);
    //   return arr;
    // }
  }, 10000);
});

export default pollingWorker;
