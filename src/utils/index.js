import moment from "moment";

function setMomentLocale() {
  moment.locale("pt-br");
}

function onlyNumbers(value) {
  if (value) {
    return value.replace(/\D/g, "");
  }
  return null;
}

function isDate(value) {
  setMomentLocale();
  return moment(value, "DD/MM/YYYY", true).isValid();
}

function isDateOrEmpty(value) {
  setMomentLocale();
  console.log(value);
  if (!value || value.length === 0) return true;
  return moment(value, "DD/MM/YYYY", true).isValid();
}

function isCpf(cpf) {
  // var cpfRegex = /^(?:(\d{3}).(\d{3}).(\d{3})-(\d{2}))$/;
  // if (!cpfRegex.test(cpf)) {
  //   return false;
  // }

  var numeros = cpf.match(/\d/g).map(Number);
  var soma = numeros.reduce((acc, cur, idx) => {
    if (idx < 9) {
      return acc + cur * (10 - idx);
    }
    return acc;
  }, 0);

  var resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== numeros[9]) {
    return false;
  }

  soma = numeros.reduce((acc, cur, idx) => {
    if (idx < 10) {
      return acc + cur * (11 - idx);
    }
    return acc;
  }, 0);

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== numeros[10]) {
    return false;
  }

  return true;
}

function redirectHost() {
  window.location.href = window.location.protocol + "//" + window.location.host;
}

const optionsNumberPTBR = {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
};

const intlNumberFormatPTBR = new Intl.NumberFormat("pt-BR", optionsNumberPTBR);
const formatMoneyPTBR = (value) => {
  return intlNumberFormatPTBR.format(value);
};

const formatDateTimePTBR = (value) => {
  const date = new Date(value);
  if (date) {
    return date.toLocaleDateString("pt-BR");
  }
  return "";
};

const formatDateEn = (value) => {
  return moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
};

const formatClient = (client) => {
  const data = {
    cpf: client?.cpf,
    name: client?.name,
    sex: client?.sex,
    dateBirthday: isDate(client?.dateBirthday)
      ? formatDateEn(client?.dateBirthday)
      : null,
    email: client?.email,
    address: client?.address,
    cityId: client?.cityId,
    phoneOne: onlyNumbers(client?.phoneOne),
    phoneTwo: onlyNumbers(client?.phoneTwo),
  };
  return data;
};

const validation = {
  cpf: isCpf,
  date: isDate,
  dateOrEmpty: isDateOrEmpty,
};

const numbers = {
  onlyNumbers: onlyNumbers,
};

const formats = {
  money: formatMoneyPTBR,
  date: formatDateTimePTBR,
  client: formatClient,
};

const redirectTo = {
  host: redirectHost,
};

export { validation, numbers, redirectTo, formats };
