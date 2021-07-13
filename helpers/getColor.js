const getColor = (c) => {
  c = c.substr(0, 1).toUpperCase();
  switch(c){
    case 'A':
      return '#007aff';
    case 'B':
      return '#2b8339';
    case 'C':
      return '#2a9d8f';
    case 'D':
      return '#b5179e';
    case 'E':
      return '#f77f00';
    case 'F':
      return '#3F51B5';
    case 'G':
      return '#5f0f40';
    case 'H':
      return '#fca311';
    case 'I':
      return '#6b705c';
    case 'J':
      return '#606c38';
    case 'K':
      return '#0077b6';
    case 'L':
      return '#06d6a0';
    case 'M':
      return '#8338ec';
    case 'N':
      return '#9c6644';
    case 'O':
      return '#fb5607';
    case 'P':
      return '#ffc300';
    case 'Q':
      return '#ef476f';
    case 'R':
      return '#6d6875';
    case 'S':
      return '#774936';
    case 'T':
      return '#00bbf9';
    case 'U':
      return '#006d77';
    case 'V':
      return '#f48c06';
    case 'W':
      return '#38b000';
    case 'X':
      return '#457b9d';
    case 'Y':
      return '#3F51B5';
    case 'Z':
      return '#ed2f2f';
    default:
      return '#000';
  }
}

export default getColor;