import moment from "moment";
import uniqid from "uniqid";

export function getImageLogoAcademy(cnpj) {
  return "https://www.mels.com.br/Down/anunciantes/" + cnpj + "/" + cnpj + ".jpg?id=" + uniqid();
}

export function getShowPdf(value) {
  return "https://www.mels.com.br/Down/avaliacoes/" + value;
}

export function compareDateEn(date1, date2) {
  setMomentLocale();
  const d1 = moment(date1, "YYYY-MM-DDTHH:mm:ss", true);
  const d2 = moment(date2, "YYYY-MM-DDTHH:mm:ss", true);
  if (d1 && d2) {
    return d2 > d1;
  }
  return false;
}

function setMomentLocale() {
  moment.locale("pt-br");
}
function nowDateTime() {
  setMomentLocale();
  return moment().format("YYYY-MM-DDTHH:mm:ss");
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
    return date.toLocaleDateString("pt-BR") + (date.toLocaleTimeString() !== "00:00:00" ? " " + date.toLocaleTimeString() : "");
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
    dateBirthday: isDate(client?.dateBirthday) ? formatDateEn(client?.dateBirthday) : null,
    email: client?.email,
    address: client?.address,
    cityId: client?.cityId,
    phoneOne: onlyNumbers(client?.phoneOne),
    phoneTwo: onlyNumbers(client?.phoneTwo),
    academyId: client?.academyId,
    addressNumber: client?.addressNumber,
    district: client?.district,
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
  nowDateTime,
  compareDateEn,
  dataURIToBlob,
};

const redirectTo = {
  host: redirectHost,
};

function dataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(",");
  const byteString = splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new Blob([ia], { type: mimeString });
}

export { validation, numbers, redirectTo, formats };
