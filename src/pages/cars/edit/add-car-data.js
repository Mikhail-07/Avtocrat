import cars from "../../../data/cars.js";
import informationSeporator from "../../../assets/lib/information_seporator.js";


export default function(carForm){
  const formData = Object.fromEntries(carForm.entries()); // преобразую clientForm в объект
  const carId = formData.carId

  const car = cars.find( item => item.id === carId)

  //проверяет чек боксы и меняет дынные в автомобиле
  car.lastCheckUp = car.mileage
  car.nextCheckUp = car.mileage + 10000
  const works = ['belt', 'oil', 'wheelAlignment']
  for (const work of Object.keys(formData)){
    if (works.includes(work)){
      car[work] = car.mileage
    }
  }
}