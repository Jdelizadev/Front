
const capitalizeName = (str) => {
  if (!str) return ''; // Maneja el caso en que la cadena sea nula o vacía
  
  // 1. Convierte todo a minúsculas y divide la cadena por espacios
  return str.toLowerCase().split(' ')
    .map((word) => {
      // 2. Si la palabra no está vacía, capitaliza la primera letra
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    // 3. Une las palabras de nuevo con un espacio
    .join(' ');
};

export { capitalizeName }