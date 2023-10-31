import servicesData from "../../../data/services";

export default function (form){
  const formatToNumber = ['days', 'perDay', 'total', 'deposit']; // список объектов которые будут преобразованы в числа
  const personalProp = ['name', 'tel', 'series', 'nom', 'issued', 'issuedDate', 'registration', 'license', 'description'];
  const personalRentProp = ['status', 'carId', 'from', 'to', 'days', 'rate'];
  const rentProp = ['name', 'id', 'type', 'carId', 'from', 'to', 'days', 'date', 'perDay', 'total', 'deposit', 'status', 'rate', 'type']
  const servicesList = Object.keys(servicesData)

  const clientData = {};
  const personalRentData = {};
  const rentData = {};
  const services = {};

  for (const [key, value] of Object.entries(form)){

    const parsedValue = formatToNumber.includes(key)
      ? parseInt(value)
      : value;

    if (personalProp.includes(key)){
      clientData[key] = parsedValue
    }

    if (personalRentProp.includes(key)){
      personalRentData[key] = parsedValue
    }

    if (rentProp.includes(key)) {
      rentData[key] = parsedValue;
    }

    if (servicesList.includes(key)) {
      services[key] = parsedValue;
    }
  };

  return { clientData, personalRentData, rentData, services }
}