export function formatTimestampToDate(timestamp: number): string {
  // 將秒轉換為毫秒
  const date = new Date(timestamp * 1000);

  // 獲取年份
  const year = date.getFullYear();

  // 獲取月份，月份從0開始，所以需要加1
  const month = date.getMonth() + 1;

  // 獲取日期
  const day = date.getDate();

  // 格式化月份和日期，確保它們是兩位數
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  // 格式化為 YYYY-MM-DD
  return `${year}-${formattedMonth}-${formattedDay}`;
}