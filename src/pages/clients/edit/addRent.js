import informationSeporator from "../../../components/schedule/tools/information_seporator.js"
import Router from "../../../router/index.js";


export default function(clientForm){
    const formData = Object.fromEntries(clientForm.entries()); // преобразую clientForm в объект

    const [ hh, mm ] = formData.time.split(':') 
    delete formData.time;
    const from = new Date (formData.from);
    from.setHours(hh);
    from.setMinutes(mm);
    delete formData.time // удаляю теперь не актуальное время
    const to = new Date (formData.to)
    formData.from = from.getTime();
    formData.to = to.getTime();
    formData.date = new Date().getTime();
    formData.status = 'open'; // измененяю статус аренды с booked на open

    const { clientData, personalRentData, rentData } = informationSeporator(formData);
    clientData.status = "open";
    rentData.type = "rent";
    
    for (const [key, value] of Object.entries(clientData)) this.client[key] = value;
    for (const [key, value] of Object.entries(personalRentData)) this.rent[key] = value;
    
    this.report.push(rentData)

    const router = Router.instance();
    router.navigate('/')

}