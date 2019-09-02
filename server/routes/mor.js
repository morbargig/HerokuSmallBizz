const moment = require('moment')

// let h = ['0000', '0100', '0200', '0300', '0400', '0500', '0600', '0700', '0800', '0900', '1000', '1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900', '2000', '2100', '2200', '2300']
// let hh = []

// for (let i of h) {
//     hh.push(i)
//     hh.push(i[0] + i[1] + '15')
//     hh.push(i[0] + i[1] + '30')
//     hh.push(i[0] + i[1] + '45')
// }
// console.log(hh)



// obj = {
//     Catgories:
//         [{ name: 'BarberShop', img: 'bjhm', description: 'jhdskjkjhfk' },
//         {
//             name: 'Beauty',
//             img: 'hbkhbhjbJHBJHhb',
//             description: 'jhdskjkjhfk'
//         },
//         { name: 'Travels', img: 'kjbk', description: 'jhdskjkjhfk' },
//         { name: 'Maintenance', img: 'ugiu', description: 'jhdskjkjhfk' },
//         { name: 'Haircuts', img: 'kugk', description: 'jhdskjkjhfk' }]
// }


// obj1 = {
//     Catgories:
//         [{ name: 'BarberShop', img: 'bjhm', description: 'jhdskjkjhfk' },
//         {
//             name: 'Beauty',
//             img: 'hbkhbhjbJHBJHhb',
//             description: 'jhdskjkjhfk'
//         },
//         { name: 'Travels', img: 'kjbk', description: 'jhdskjkjhfk' },
//         { name: 'Maintenance', img: 'ugiu', description: 'jhdskjkjhfk' },
//         { name: 'Haircuts', img: 'kugk', description: 'jhdskjkjhfk' }]
// }



// { [moment().add(x + 1, 'day').format('L')]: dailySchedule } && (x +=1) 
// let x  = moment((moment().add(1, 'day').format('L'))).format('dddd')
// console.log(x)

let dailySchedule = [
    "8:0",
    "8:10",
    "8:20",
    "8:30",
    "8:40",
]

let daysOfWork = ["Monday", "Sunday", "Thursday"]
let obj = {}
let x = 0
for (let i = 0; x < 10; i++) {
    if (daysOfWork.find(d => d === moment((moment().add(i, 'day').format('L'))).format('dddd'))) {
        obj[moment().add(i, 'day').format('L')] = dailySchedule
        x++
    }
}

availableAppointments = [
    { regularDay: dailySchedule },
    obj
]
// console.log(Object.keys(obj))

console.log(availableAppointments)



let x =
{
    id: '5d62ea1f8cf5dc39488c1000',
    Catgories:
        [{
            name: 'mor',
            img:
                'https://scontent-yyz1-1.cdninstagram.com/vp/6903e1186277b1657580c0550efb1f23/5D83E201/t51.2885-19/s150x150/55833138_789927684710950_8067812279866884096_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&se=8',
            description: 'best ever!'
        },
        {
            name: 'bar',
            img:
                'https://scontent-yyz1-1.cdninstagram.com/vp/6903e1186277b1657580c0550efb1f23/5D83E201/t51.2885-19/s150x150/55833138_789927684710950_8067812279866884096_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&se=8',
            description: 'best ever!'
        },
        {
            name: 'Other',
            img:
                'https://scontent-yyz1-1.cdninstagram.com/vp/6903e1186277b1657580c0550efb1f23/5D83E201/t51.2885-19/s150x150/55833138_789927684710950_8067812279866884096_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&se=8',
            description: 'best ever!'
        },
        {
            name: 'carssss',
            img:
                'https://static.carsdn.co/cldstatic/wp-content/uploads/HP2019AudiA7.jpg',
            description: 'jhvjhvjhvj'
        }]
}
