export function formatDateString(dateString: string): string {
  const date = new Date(dateString);

  // 연도: 뒤 두 자릿수 (e.g. 2024 -> "24")
  const year = date.getFullYear().toString().slice(-2);

  // 월, 일
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // 요일
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  // 시, 분
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // 초
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 오전/오후 구분
  const period = hours < 12 ? '오전' : '오후';

  // 12시간제 시각 (0시 -> 12로 표시)
  const formattedHours = (hours % 12 || 12).toString();

  return `${year}.${month}.${day}(${dayOfWeek}) ${period} ${formattedHours}:${minutes}:${seconds}`;
}
