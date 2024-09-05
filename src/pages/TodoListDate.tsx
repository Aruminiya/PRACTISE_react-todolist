import { useState, useContext, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { HexApiContext } from '../context/HexApiContextProvider.tsx';
import { formatTimestampToDate } from '../utils/dateUtils.ts';

import { Container, Box } from '@mui/material';

const localizer = momentLocalizer(moment); 
/*
  `react-big-calendar` 庫中的一個函數，用於設置日曆的本地化（localization）。
  這個函數接受一個日期處理庫（如 `moment`、`globalize` 或 `Luxon`）作為參數，並返回一個本地化器（localizer）對象，
  該對象將用於格式化和解析日曆中的日期和時間。
*/

/*
  本地化（Localization，通常縮寫為 L10n）是指將軟件或應用程序調整為適應特定地區或語言的過程。這包括但不限於以下幾個方面：

  1. **語言翻譯**：將應用程序中的文本翻譯成目標語言。
  2. **日期和時間格式**：根據地區習慣顯示日期和時間。例如，美國通常使用 MM/DD/YYYY 格式，而大多數歐洲國家使用 DD/MM/YYYY 格式。
  3. **數字和貨幣格式**：根據地區習慣顯示數字和貨幣。例如，千位分隔符和小數點的使用在不同地區可能不同。
  4. **度量單位**：根據地區習慣使用不同的度量單位。例如，美國使用英制單位（如英里、華氏度），而大多數其他國家使用公制單位（如公里、攝氏度）。
  5. **文化習慣**：考慮到不同地區的文化習慣和禁忌，調整應用程序的內容和功能。
*/

export default function TodoListDate() {
  const [events, setEvents] = useState<Event[]>([
    { title: "吃東西", start: new Date("2024-09-06 14:35"), end: new Date("2024-09-06 14:35"), allDay: false },
    { title: "全天事件", start: new Date("2024-09-11"), end: new Date("2024-09-11"), allDay: false },
  ]);

  const HexApiCtx = useContext(HexApiContext);
  const { getTodo } = HexApiCtx;

  async function getTodoEvent () {
    const result = await getTodo();
    const todoDatas: [] = result.data;
    const todoDatatoDateEvent = todoDatas.map((todoData: { content: string, createTime: number }) => (
      {
        title: todoData.content,
        content: {todoData},
        start: new Date(formatTimestampToDate(todoData.createTime)),
        end: new Date(formatTimestampToDate(todoData.createTime)),
        allDay: true
      }
    ));
    console.log(todoDatatoDateEvent);
    setEvents((prev) => [...prev, ...todoDatatoDateEvent]);
  }

  useEffect(() => {
    getTodoEvent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Box my={4} className="myCustomHeight">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(e)=>{console.log(e)}}
        />
      </Box>
    </Container>
  );
};