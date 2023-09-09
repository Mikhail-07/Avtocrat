# Avtocrat (CRM/ERP system)

## Описание:

**"Автократ"** - это CRM/ERP система управления, предназначенная для автоматизации рабочих процессов и управления ими для повышения эффективности работы компании по прокату автомобилей. Приложение наглядно отображает текущее состояние всех автомобилей, благодаря его возможностям оформление новых клиентов занимает не больше 1 минуты, а уже внесенных в базу не более 15 секунд. Данная система уже внедряется в реальный бизнес компании по прокату автомобилей с автопарком более 100 машин, так же программа может быть полезна и для других направлений, занимающихся сдачей какого-либо имущества в аренду.

## Структура:

**1. График**

Основными элементом программы являются график, который представляет из себя таблицу. В шапке таблицы отображаются даты, а слева от таблицы располагается перечень машин.

[![main.png](https://i.postimg.cc/gJH32gt1/main.png)](https://postimg.cc/bDdZ69hR)

Таблица отображает информацию по всем машинам одновременно. В ячейках таблицы находятся различные данные, касающиеся конкретных автомобилей, такие как: аренда, запись клиента, предупреждение о возможном техническом обслуживании и т.д. 

Программа также предоставляет варианты редактирования данных в таблице. Пользователь может взаимодействовать с записями, изменять, переносить их или удалять.

Взаимодействие с таблицей:

  1. Таблица состоит из бесконечной череды месяцев, идущих друг за другом. Во время горизонтальной прокрутки таблицы по достижению первого дня месяца создается предыдущий месяц, а при достижении последнего дня - следующий;

 2. При клике ПКМ по ячейке вызывается контекстное меню, содержимое которого формируется исходя из типа ячейки, по которой произошел клик;
  2.1 при клике по пустой ячейке можно создать бронь на конкретный автомобиль и дату;
  2.2 при клике на желтую ячейку можно перейти в раздел создания договора;
  2.3 при клике по фиолетовой ячейке можно завершить аренду клиента;
  2.4 при клике по голубой ячейке можно завершить аренду клиента или продлить ее по выбранный день;
   

 3. При выборе одного из пунктов контекстного меню открывается модальное окно, наполнение которого происходит исходя их выбранного пункта;

  [![Modal.png](https://i.postimg.cc/Y0Xg1hH3/Modal.png)](https://postimg.cc/ZvdCmY0B)

 5. Перенос желтых ячеек с бронью осуществляется по принципу Drag&Drop;
 6. Продление аренды происходит путем перемещения границы между оплаченными и неоплаченными днями (Drag&Drop). В процессе перемещения возникает подсказка с текущим количеством дней продления;
 7. Временная шкала, рассекающая весь график по вертикали, перемещается в соответствии с текущей датой, и в случае задолженности у клиента автоматически заполняет дни долга голубым цветом;
 8. Кнопка "Today" плавно перемещает экран к сегодняшней дате;

**2. Отчет**

Все взаимодействия с клиентами в разделе "График", касающихся финансовых расчетов (аренда, продление, доп. услуги и т.д.), отображаются в таблице раздела "Отчет". Отсортировать данные таблицы можно кликнув по заголовкам столбцов, по умолчанию сортировка происходит по дате добавления записи от новой к старой. Так же для удобства поиска можно отфильтровать список по ФИО клиента или по статусу платежа.  

[![report.png](https://i.postimg.cc/ncmn520t/report.png)](https://postimg.cc/fJw4SxGH)

**3. Клиенты**

Раздел "Клиенты" отображает клиентскую базу компании. Он состоит из основной таблицы с данными клиентов и блока с фильтрами. При добавлении новой брони в разделе "График" информация о клиенте тут же заносится в данную таблицу со статусом "бронь". При клике на строку с записью открывается карточка клиента.

[![clients.png](https://i.postimg.cc/K8ymyTH3/clients.png)](https://postimg.cc/kBw0Q297)

Карточка клиента - это клиентский подраздел состоящий из двух частей: в первой отображаются все данные необходимые для составления договора, а во второй история всех поездок клиента и финансовые расчеты.

[![client.png](https://i.postimg.cc/fTf44Pnm/client.png)](https://postimg.cc/D80pLBzw)

В случае необходимости внесения дополнительного водителя необходимо нажать на кнопку справа от блока с данными, при клике на него форма расширится.

Для оформления клиента и начала аренды необходимо в разделе "График" нажать на ячейку с бронью ПКМ и в контекстном меню выбрать пункт "Создать договор". В открывшейся карточке клиента нужно проверить данные и нажать на кнопку "Добавить аренду". После этого аренда отобразиться в графике и в отчете, а в разделе "Клиенты" у водителя изменится статус с "бронь" на "в аренде". 

**4. Автомобили**

В этом разделе можно найти всю информацию о ближайших профилактических работах и технических обслуживаниях.
[![cars.png](https://i.postimg.cc/Lsb7mK8Q/cars.png)](https://postimg.cc/Mc1tYLR1)

**Для запуска проекта в режиме разработчика:**
* `npm i` - установит необходимые зависимости
* `npm run build-dev` - соберет проект в dev режиме
* `npm run start` - запустит "WebpackDevServer"

**Требования:**
* nodejs >=16.13.1
* npm >= 7.10.0

**Контакты:**
* **tg:** @Goddem02
* **mail:** lma6490544@gmail.com


