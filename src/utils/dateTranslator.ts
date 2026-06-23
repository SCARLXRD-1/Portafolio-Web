export function translateDate(dateStr: string, isEs: boolean): string {
  if (isEs || !dateStr) return dateStr;

  const dictionary: Record<string, string> = {
    'enero': 'January',
    'febrero': 'February',
    'marzo': 'March',
    'abril': 'April',
    'mayo': 'May',
    'junio': 'June',
    'julio': 'July',
    'agosto': 'August',
    'septiembre': 'September',
    'octubre': 'October',
    'noviembre': 'November',
    'diciembre': 'December',
    'presente': 'Present',
    'actualidad': 'Present'
  };

  let translated = dateStr;
  Object.keys(dictionary).forEach(esWord => {
    // case-insensitive replacement
    const regex = new RegExp(String.raw`\b${esWord}\b`, 'gi');
    translated = translated.replace(regex, dictionary[esWord]);
  });

  return translated;
}
