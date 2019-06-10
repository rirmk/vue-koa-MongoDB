function getCurrentTime() {
  let date = new Date()
  let res = date.getFullYear() + '-' + String(Number(date.getMonth()) + 1) + '-' +
    date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return res

}
export default getCurrentTime;
