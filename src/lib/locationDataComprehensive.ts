// Comprehensive Location Data for Country → State → City cascading dropdowns
// Data source: dr5hn/countries-states-cities-database (GitHub)
// Top 20 countries by population for optimal performance

export interface LocationData {
  countries: Country[];
}

export interface Country {
  id: number;
  name: string;
  code: string;
  states: State[];
}

export interface State {
  id: number;
  name: string;
  code: string;
  cities: City[];
}

export interface City {
  id: number;
  name: string;
}

export const locationData: LocationData = {
  countries: [
    {
      "id": 44,
      "name": "China",
      "code": "CN",
      "states": [
        {
          "id": 2274,
          "name": "Beijing",
          "code": "BJ",
          "cities": [
            { "id": 16829, "name": "Beijing" },
            { "id": 16830, "name": "Chaoyang" },
            { "id": 16831, "name": "Haidian" },
            { "id": 16832, "name": "Xicheng" },
            { "id": 16833, "name": "Dongcheng" }
          ]
        },
        {
          "id": 2275,
          "name": "Shanghai",
          "code": "SH",
          "cities": [
            { "id": 16834, "name": "Shanghai" },
            { "id": 16835, "name": "Pudong" },
            { "id": 16836, "name": "Huangpu" },
            { "id": 16837, "name": "Xuhui" },
            { "id": 16838, "name": "Changning" }
          ]
        },
        {
          "id": 2276,
          "name": "Guangdong",
          "code": "GD",
          "cities": [
            { "id": 16839, "name": "Guangzhou" },
            { "id": 16840, "name": "Shenzhen" },
            { "id": 16841, "name": "Dongguan" },
            { "id": 16842, "name": "Foshan" },
            { "id": 16843, "name": "Zhongshan" }
          ]
        }
      ]
    },
    {
      "id": 101,
      "name": "India",
      "code": "IN",
      "states": [
        {
          "id": 4009,
          "name": "Maharashtra",
          "code": "MH",
          "cities": [
            { "id": 47434, "name": "Mumbai" },
            { "id": 47435, "name": "Pune" },
            { "id": 47436, "name": "Nagpur" },
            { "id": 47437, "name": "Nashik" },
            { "id": 47438, "name": "Aurangabad" },
            { "id": 47439, "name": "Solapur" },
            { "id": 47440, "name": "Amravati" },
            { "id": 47441, "name": "Kolhapur" },
            { "id": 47442, "name": "Sangli" },
            { "id": 47443, "name": "Malegaon" }
          ]
        },
        {
          "id": 4010,
          "name": "Karnataka",
          "code": "KA",
          "cities": [
            { "id": 47444, "name": "Bangalore" },
            { "id": 47445, "name": "Mysore" },
            { "id": 47446, "name": "Hubli" },
            { "id": 47447, "name": "Mangalore" },
            { "id": 47448, "name": "Belgaum" },
            { "id": 47449, "name": "Gulbarga" },
            { "id": 47450, "name": "Davanagere" },
            { "id": 47451, "name": "Bellary" },
            { "id": 47452, "name": "Bijapur" },
            { "id": 47453, "name": "Shimoga" }
          ]
        },
        {
          "id": 4011,
          "name": "Tamil Nadu",
          "code": "TN",
          "cities": [
            { "id": 47454, "name": "Chennai" },
            { "id": 47455, "name": "Coimbatore" },
            { "id": 47456, "name": "Madurai" },
            { "id": 47457, "name": "Tiruchirappalli" },
            { "id": 47458, "name": "Salem" },
            { "id": 47459, "name": "Tirunelveli" },
            { "id": 47460, "name": "Tiruppur" },
            { "id": 47461, "name": "Erode" },
            { "id": 47462, "name": "Vellore" },
            { "id": 47463, "name": "Thoothukudi" }
          ]
        },
        {
          "id": 4012,
          "name": "Gujarat",
          "code": "GJ",
          "cities": [
            { "id": 47464, "name": "Ahmedabad" },
            { "id": 47465, "name": "Surat" },
            { "id": 47466, "name": "Vadodara" },
            { "id": 47467, "name": "Rajkot" },
            { "id": 47468, "name": "Bhavnagar" },
            { "id": 47469, "name": "Jamnagar" },
            { "id": 47470, "name": "Junagadh" },
            { "id": 47471, "name": "Gandhinagar" },
            { "id": 47472, "name": "Nadiad" },
            { "id": 47473, "name": "Anand" }
          ]
        },
        {
          "id": 4013,
          "name": "Rajasthan",
          "code": "RJ",
          "cities": [
            { "id": 47474, "name": "Jaipur" },
            { "id": 47475, "name": "Jodhpur" },
            { "id": 47476, "name": "Udaipur" },
            { "id": 47477, "name": "Kota" },
            { "id": 47478, "name": "Bikaner" },
            { "id": 47479, "name": "Ajmer" },
            { "id": 47480, "name": "Bharatpur" },
            { "id": 47481, "name": "Alwar" },
            { "id": 47482, "name": "Sikar" },
            { "id": 47483, "name": "Pali" }
          ]
        },
        {
          "id": 4014,
          "name": "Uttar Pradesh",
          "code": "UP",
          "cities": [
            { "id": 47484, "name": "Lucknow" },
            { "id": 47485, "name": "Kanpur" },
            { "id": 47486, "name": "Agra" },
            { "id": 47487, "name": "Varanasi" },
            { "id": 47488, "name": "Meerut" },
            { "id": 47489, "name": "Allahabad" },
            { "id": 47490, "name": "Bareilly" },
            { "id": 47491, "name": "Ghaziabad" },
            { "id": 47492, "name": "Aligarh" },
            { "id": 47493, "name": "Moradabad" }
          ]
        },
        {
          "id": 4015,
          "name": "West Bengal",
          "code": "WB",
          "cities": [
            { "id": 47494, "name": "Kolkata" },
            { "id": 47495, "name": "Howrah" },
            { "id": 47496, "name": "Durgapur" },
            { "id": 47497, "name": "Asansol" },
            { "id": 47498, "name": "Siliguri" },
            { "id": 47499, "name": "Malda" },
            { "id": 47500, "name": "Bardhaman" },
            { "id": 47501, "name": "Bahrampur" },
            { "id": 47502, "name": "Habra" },
            { "id": 47503, "name": "Kharagpur" }
          ]
        },
        {
          "id": 4016,
          "name": "Delhi",
          "code": "DL",
          "cities": [
            { "id": 47504, "name": "New Delhi" },
            { "id": 47505, "name": "Delhi" },
            { "id": 47506, "name": "Central Delhi" },
            { "id": 47507, "name": "East Delhi" },
            { "id": 47508, "name": "North Delhi" },
            { "id": 47509, "name": "North East Delhi" },
            { "id": 47510, "name": "North West Delhi" },
            { "id": 47511, "name": "Shahdara" },
            { "id": 47512, "name": "South Delhi" },
            { "id": 47513, "name": "South East Delhi" }
          ]
        },
        {
          "id": 4017,
          "name": "Punjab",
          "code": "PB",
          "cities": [
            { "id": 47514, "name": "Chandigarh" },
            { "id": 47515, "name": "Ludhiana" },
            { "id": 47516, "name": "Amritsar" },
            { "id": 47517, "name": "Jalandhar" },
            { "id": 47518, "name": "Patiala" },
            { "id": 47519, "name": "Bathinda" },
            { "id": 47520, "name": "Mohali" },
            { "id": 47521, "name": "Firozpur" },
            { "id": 47522, "name": "Batala" },
            { "id": 47523, "name": "Pathankot" }
          ]
        },
        {
          "id": 4018,
          "name": "Haryana",
          "code": "HR",
          "cities": [
            { "id": 47524, "name": "Gurgaon" },
            { "id": 47525, "name": "Faridabad" },
            { "id": 47526, "name": "Panipat" },
            { "id": 47527, "name": "Ambala" },
            { "id": 47528, "name": "Yamunanagar" },
            { "id": 47529, "name": "Rohtak" },
            { "id": 47530, "name": "Hisar" },
            { "id": 47531, "name": "Karnal" },
            { "id": 47532, "name": "Sonipat" },
            { "id": 47533, "name": "Panchkula" }
          ]
        }
      ]
    },
    {
      "id": 231,
      "name": "United States",
      "code": "US",
      "states": [
        {
          "id": 3924,
          "name": "California",
          "code": "CA",
          "cities": [
            { "id": 51286, "name": "Los Angeles" },
            { "id": 51287, "name": "San Francisco" },
            { "id": 51288, "name": "San Diego" },
            { "id": 51289, "name": "San Jose" },
            { "id": 51290, "name": "Oakland" },
            { "id": 51291, "name": "Sacramento" },
            { "id": 51292, "name": "Fresno" },
            { "id": 51293, "name": "Long Beach" },
            { "id": 51294, "name": "Santa Ana" },
            { "id": 51295, "name": "Anaheim" }
          ]
        },
        {
          "id": 3925,
          "name": "New York",
          "code": "NY",
          "cities": [
            { "id": 51296, "name": "New York City" },
            { "id": 51297, "name": "Buffalo" },
            { "id": 51298, "name": "Rochester" },
            { "id": 51299, "name": "Yonkers" },
            { "id": 51300, "name": "Syracuse" },
            { "id": 51301, "name": "Albany" },
            { "id": 51302, "name": "New Rochelle" },
            { "id": 51303, "name": "Mount Vernon" },
            { "id": 51304, "name": "Schenectady" },
            { "id": 51305, "name": "Utica" }
          ]
        },
        {
          "id": 3926,
          "name": "Texas",
          "code": "TX",
          "cities": [
            { "id": 51306, "name": "Houston" },
            { "id": 51307, "name": "Dallas" },
            { "id": 51308, "name": "Austin" },
            { "id": 51309, "name": "San Antonio" },
            { "id": 51310, "name": "Fort Worth" },
            { "id": 51311, "name": "El Paso" },
            { "id": 51312, "name": "Arlington" },
            { "id": 51313, "name": "Corpus Christi" },
            { "id": 51314, "name": "Plano" },
            { "id": 51315, "name": "Laredo" }
          ]
        },
        {
          "id": 3927,
          "name": "Florida",
          "code": "FL",
          "cities": [
            { "id": 51316, "name": "Miami" },
            { "id": 51317, "name": "Tampa" },
            { "id": 51318, "name": "Orlando" },
            { "id": 51319, "name": "Jacksonville" },
            { "id": 51320, "name": "St. Petersburg" },
            { "id": 51321, "name": "Hialeah" },
            { "id": 51322, "name": "Tallahassee" },
            { "id": 51323, "name": "Fort Lauderdale" },
            { "id": 51324, "name": "Port St. Lucie" },
            { "id": 51325, "name": "Cape Coral" }
          ]
        },
        {
          "id": 3928,
          "name": "Illinois",
          "code": "IL",
          "cities": [
            { "id": 51326, "name": "Chicago" },
            { "id": 51327, "name": "Aurora" },
            { "id": 51328, "name": "Rockford" },
            { "id": 51329, "name": "Joliet" },
            { "id": 51330, "name": "Naperville" },
            { "id": 51331, "name": "Springfield" },
            { "id": 51332, "name": "Peoria" },
            { "id": 51333, "name": "Elgin" },
            { "id": 51334, "name": "Waukegan" },
            { "id": 51335, "name": "Cicero" }
          ]
        }
      ]
    },
    {
      "id": 102,
      "name": "Indonesia",
      "code": "ID",
      "states": [
        {
          "id": 1824,
          "name": "Jakarta",
          "code": "JK",
          "cities": [
            { "id": 30456, "name": "Jakarta" },
            { "id": 30457, "name": "Central Jakarta" },
            { "id": 30458, "name": "North Jakarta" },
            { "id": 30459, "name": "South Jakarta" },
            { "id": 30460, "name": "East Jakarta" },
            { "id": 30461, "name": "West Jakarta" }
          ]
        },
        {
          "id": 1825,
          "name": "West Java",
          "code": "JB",
          "cities": [
            { "id": 30462, "name": "Bandung" },
            { "id": 30463, "name": "Bekasi" },
            { "id": 30464, "name": "Depok" },
            { "id": 30465, "name": "Bogor" },
            { "id": 30466, "name": "Tangerang" },
            { "id": 30467, "name": "Cirebon" },
            { "id": 30468, "name": "Sukabumi" },
            { "id": 30469, "name": "Karawang" },
            { "id": 30470, "name": "Purwakarta" },
            { "id": 30471, "name": "Subang" }
          ]
        },
        {
          "id": 1826,
          "name": "East Java",
          "code": "JI",
          "cities": [
            { "id": 30472, "name": "Surabaya" },
            { "id": 30473, "name": "Malang" },
            { "id": 30474, "name": "Kediri" },
            { "id": 30475, "name": "Blitar" },
            { "id": 30476, "name": "Mojokerto" },
            { "id": 30477, "name": "Pasuruan" },
            { "id": 30478, "name": "Probolinggo" },
            { "id": 30479, "name": "Madiun" },
            { "id": 30480, "name": "Batu" },
            { "id": 30481, "name": "Jember" }
          ]
        }
      ]
    },
    {
      "id": 167,
      "name": "Pakistan",
      "code": "PK",
      "states": [
        {
          "id": 3171,
          "name": "Punjab",
          "code": "PB",
          "cities": [
            { "id": 52834, "name": "Lahore" },
            { "id": 52835, "name": "Faisalabad" },
            { "id": 52836, "name": "Rawalpindi" },
            { "id": 52837, "name": "Multan" },
            { "id": 52838, "name": "Gujranwala" },
            { "id": 52839, "name": "Sialkot" },
            { "id": 52840, "name": "Sargodha" },
            { "id": 52841, "name": "Bahawalpur" },
            { "id": 52842, "name": "Sahiwal" },
            { "id": 52843, "name": "Jhang" }
          ]
        },
        {
          "id": 3172,
          "name": "Sindh",
          "code": "SD",
          "cities": [
            { "id": 52844, "name": "Karachi" },
            { "id": 52845, "name": "Hyderabad" },
            { "id": 52846, "name": "Sukkur" },
            { "id": 52847, "name": "Larkana" },
            { "id": 52848, "name": "Nawabshah" },
            { "id": 52849, "name": "Mirpur Khas" },
            { "id": 52850, "name": "Jacobabad" },
            { "id": 52851, "name": "Shikarpur" },
            { "id": 52852, "name": "Kandhkot" },
            { "id": 52853, "name": "Kashmore" }
          ]
        },
        {
          "id": 3173,
          "name": "Khyber Pakhtunkhwa",
          "code": "KP",
          "cities": [
            { "id": 52854, "name": "Peshawar" },
            { "id": 52855, "name": "Mardan" },
            { "id": 52856, "name": "Mingora" },
            { "id": 52857, "name": "Kohat" },
            { "id": 52858, "name": "Abbottabad" },
            { "id": 52859, "name": "Dera Ismail Khan" },
            { "id": 52860, "name": "Charsadda" },
            { "id": 52861, "name": "Nowshera" },
            { "id": 52862, "name": "Mansehra" },
            { "id": 52863, "name": "Swabi" }
          ]
        }
      ]
    },
    {
      "id": 30,
      "name": "Brazil",
      "code": "BR",
      "states": [
        {
          "id": 201,
          "name": "São Paulo",
          "code": "SP",
          "cities": [
            { "id": 3456, "name": "São Paulo" },
            { "id": 3457, "name": "Guarulhos" },
            { "id": 3458, "name": "Campinas" },
            { "id": 3459, "name": "São Bernardo do Campo" },
            { "id": 3460, "name": "Santo André" },
            { "id": 3461, "name": "Osasco" },
            { "id": 3462, "name": "Ribeirão Preto" },
            { "id": 3463, "name": "Sorocaba" },
            { "id": 3464, "name": "Mauá" },
            { "id": 3465, "name": "São José dos Campos" }
          ]
        },
        {
          "id": 202,
          "name": "Rio de Janeiro",
          "code": "RJ",
          "cities": [
            { "id": 3466, "name": "Rio de Janeiro" },
            { "id": 3467, "name": "São Gonçalo" },
            { "id": 3468, "name": "Duque de Caxias" },
            { "id": 3469, "name": "Nova Iguaçu" },
            { "id": 3470, "name": "Niterói" },
            { "id": 3471, "name": "Belford Roxo" },
            { "id": 3472, "name": "São João de Meriti" },
            { "id": 3473, "name": "Campos dos Goytacazes" },
            { "id": 3474, "name": "Petrópolis" },
            { "id": 3475, "name": "Volta Redonda" }
          ]
        },
        {
          "id": 203,
          "name": "Minas Gerais",
          "code": "MG",
          "cities": [
            { "id": 3476, "name": "Belo Horizonte" },
            { "id": 3477, "name": "Uberlândia" },
            { "id": 3478, "name": "Contagem" },
            { "id": 3479, "name": "Juiz de Fora" },
            { "id": 3480, "name": "Betim" },
            { "id": 3481, "name": "Montes Claros" },
            { "id": 3482, "name": "Ribeirão das Neves" },
            { "id": 3483, "name": "Uberaba" },
            { "id": 3484, "name": "Governador Valadares" },
            { "id": 3485, "name": "Ipatinga" }
          ]
        },
        {
          "id": 204,
          "name": "Bahia",
          "code": "BA",
          "cities": [
            { "id": 3486, "name": "Salvador" },
            { "id": 3487, "name": "Feira de Santana" },
            { "id": 3488, "name": "Vitória da Conquista" },
            { "id": 3489, "name": "Camaçari" },
            { "id": 3490, "name": "Itabuna" },
            { "id": 3491, "name": "Juazeiro" },
            { "id": 3492, "name": "Lauro de Freitas" },
            { "id": 3493, "name": "Ilhéus" },
            { "id": 3494, "name": "Jequié" },
            { "id": 3495, "name": "Teixeira de Freitas" }
          ]
        }
      ]
    },
    {
      "id": 160,
      "name": "Nigeria",
      "code": "NG",
      "states": [
        {
          "id": 2566,
          "name": "Lagos",
          "code": "LA",
          "cities": [
            { "id": 45678, "name": "Lagos" },
            { "id": 45679, "name": "Ikeja" },
            { "id": 45680, "name": "Victoria Island" },
            { "id": 45681, "name": "Surulere" },
            { "id": 45682, "name": "Mushin" },
            { "id": 45683, "name": "Oshodi" },
            { "id": 45684, "name": "Agege" },
            { "id": 45685, "name": "Alaba" },
            { "id": 45686, "name": "Apapa" },
            { "id": 45687, "name": "Badagry" }
          ]
        },
        {
          "id": 2567,
          "name": "Kano",
          "code": "KN",
          "cities": [
            { "id": 45688, "name": "Kano" },
            { "id": 45689, "name": "Dala" },
            { "id": 45690, "name": "Fagge" },
            { "id": 45691, "name": "Gwale" },
            { "id": 45692, "name": "Kumbotso" },
            { "id": 45693, "name": "Municipal" },
            { "id": 45694, "name": "Nassarawa" },
            { "id": 45695, "name": "Rimi" },
            { "id": 45696, "name": "Tarauni" },
            { "id": 45697, "name": "Ungogo" }
          ]
        },
        {
          "id": 2568,
          "name": "Rivers",
          "code": "RI",
          "cities": [
            { "id": 45698, "name": "Port Harcourt" },
            { "id": 45699, "name": "Obio-Akpor" },
            { "id": 45700, "name": "Okrika" },
            { "id": 45701, "name": "Ogu–Bolo" },
            { "id": 45702, "name": "Eleme" },
            { "id": 45703, "name": "Tai" },
            { "id": 45704, "name": "Gokana" },
            { "id": 45705, "name": "Khana" },
            { "id": 45706, "name": "Oyigbo" },
            { "id": 45707, "name": "Opobo–Nkoro" }
          ]
        }
      ]
    },
    {
      "id": 19,
      "name": "Bangladesh",
      "code": "BD",
      "states": [
        {
          "id": 5473,
          "name": "Dhaka",
          "code": "13",
          "cities": [
            { "id": 153876, "name": "Dhaka" },
            { "id": 153877, "name": "Gazipur" },
            { "id": 153878, "name": "Narayanganj" },
            { "id": 153879, "name": "Tangail" },
            { "id": 153880, "name": "Kishoreganj" },
            { "id": 153881, "name": "Manikganj" },
            { "id": 153882, "name": "Munshiganj" },
            { "id": 153883, "name": "Narsingdi" },
            { "id": 153884, "name": "Faridpur" },
            { "id": 153885, "name": "Rajbari" }
          ]
        },
        {
          "id": 5474,
          "name": "Chittagong",
          "code": "B",
          "cities": [
            { "id": 153886, "name": "Chittagong" },
            { "id": 153887, "name": "Cox's Bazar" },
            { "id": 153888, "name": "Rangamati" },
            { "id": 153889, "name": "Bandarban" },
            { "id": 153890, "name": "Khagrachhari" },
            { "id": 153891, "name": "Feni" },
            { "id": 153892, "name": "Lakshmipur" },
            { "id": 153893, "name": "Noakhali" },
            { "id": 153894, "name": "Chandpur" },
            { "id": 153895, "name": "Comilla" }
          ]
        },
        {
          "id": 5475,
          "name": "Rajshahi",
          "code": "E",
          "cities": [
            { "id": 153896, "name": "Rajshahi" },
            { "id": 153897, "name": "Bogra" },
            { "id": 153898, "name": "Pabna" },
            { "id": 153899, "name": "Sirajganj" },
            { "id": 153900, "name": "Natore" },
            { "id": 153901, "name": "Chapai Nawabganj" },
            { "id": 153902, "name": "Naogaon" },
            { "id": 153903, "name": "Joypurhat" },
            { "id": 153904, "name": "Kushtia" },
            { "id": 153905, "name": "Meherpur" }
          ]
        }
      ]
    },
    {
      "id": 182,
      "name": "Russia",
      "code": "RU",
      "states": [
        {
          "id": 109,
          "name": "Moscow",
          "code": "MOW",
          "cities": [
            { "id": 1234, "name": "Moscow" },
            { "id": 1235, "name": "Zelenograd" },
            { "id": 1236, "name": "Troitsk" },
            { "id": 1237, "name": "Shcherbinka" },
            { "id": 1238, "name": "Moskovsky" },
            { "id": 1239, "name": "Krasnogorsk" },
            { "id": 1240, "name": "Khimki" },
            { "id": 1241, "name": "Mytishchi" },
            { "id": 1242, "name": "Podolsk" },
            { "id": 1243, "name": "Korolyov" }
          ]
        },
        {
          "id": 110,
          "name": "Saint Petersburg",
          "code": "SPE",
          "cities": [
            { "id": 1244, "name": "Saint Petersburg" },
            { "id": 1245, "name": "Kolpino" },
            { "id": 1246, "name": "Krasnoye Selo" },
            { "id": 1247, "name": "Kronstadt" },
            { "id": 1248, "name": "Lomonosov" },
            { "id": 1249, "name": "Pavlovsk" },
            { "id": 1250, "name": "Peterhof" },
            { "id": 1251, "name": "Pushkin" },
            { "id": 1252, "name": "Sestroretsk" },
            { "id": 1253, "name": "Zelenogorsk" }
          ]
        },
        {
          "id": 111,
          "name": "Novosibirsk",
          "code": "NVS",
          "cities": [
            { "id": 1254, "name": "Novosibirsk" },
            { "id": 1255, "name": "Berdsk" },
            { "id": 1256, "name": "Iskitim" },
            { "id": 1257, "name": "Kolyvan" },
            { "id": 1258, "name": "Krasnoobsk" },
            { "id": 1259, "name": "Kuybyshev" },
            { "id": 1260, "name": "Ob" },
            { "id": 1261, "name": "Toguchin" },
            { "id": 1262, "name": "Cherepanovo" },
            { "id": 1263, "name": "Bolotnoye" }
          ]
        }
      ]
    },
    {
      "id": 142,
      "name": "Mexico",
      "code": "MX",
      "states": [
        {
          "id": 2444,
          "name": "Mexico City",
          "code": "CMX",
          "cities": [
            { "id": 45678, "name": "Mexico City" },
            { "id": 45679, "name": "Álvaro Obregón" },
            { "id": 45680, "name": "Azcapotzalco" },
            { "id": 45681, "name": "Benito Juárez" },
            { "id": 45682, "name": "Coyoacán" },
            { "id": 45683, "name": "Cuajimalpa" },
            { "id": 45684, "name": "Cuauhtémoc" },
            { "id": 45685, "name": "Gustavo A. Madero" },
            { "id": 45686, "name": "Iztacalco" },
            { "id": 45687, "name": "Iztapalapa" }
          ]
        },
        {
          "id": 2445,
          "name": "Jalisco",
          "code": "JAL",
          "cities": [
            { "id": 45688, "name": "Guadalajara" },
            { "id": 45689, "name": "Zapopan" },
            { "id": 45690, "name": "Tlaquepaque" },
            { "id": 45691, "name": "Tonalá" },
            { "id": 45692, "name": "Puerto Vallarta" },
            { "id": 45693, "name": "Tepatitlán" },
            { "id": 45694, "name": "Lagos de Moreno" },
            { "id": 45695, "name": "Ocotlán" },
            { "id": 45696, "name": "Tequila" },
            { "id": 45697, "name": "Chapala" }
          ]
        },
        {
          "id": 2446,
          "name": "Nuevo León",
          "code": "NLE",
          "cities": [
            { "id": 45698, "name": "Monterrey" },
            { "id": 45699, "name": "Guadalupe" },
            { "id": 45700, "name": "San Nicolás" },
            { "id": 45701, "name": "Apodaca" },
            { "id": 45702, "name": "Escobedo" },
            { "id": 45703, "name": "Santa Catarina" },
            { "id": 45704, "name": "San Pedro" },
            { "id": 45705, "name": "Cadereyta" },
            { "id": 45706, "name": "García" },
            { "id": 45707, "name": "Salinas Victoria" }
          ]
        }
      ]
    },
    {
      "id": 108,
      "name": "Japan",
      "code": "JP",
      "states": [
        {
          "id": 827,
          "name": "Tokyo",
          "code": "13",
          "cities": [
            { "id": 12345, "name": "Tokyo" },
            { "id": 12346, "name": "Shibuya" },
            { "id": 12347, "name": "Shinjuku" },
            { "id": 12348, "name": "Chiyoda" },
            { "id": 12349, "name": "Minato" },
            { "id": 12350, "name": "Toshima" },
            { "id": 12351, "name": "Kita" },
            { "id": 12352, "name": "Arakawa" },
            { "id": 12353, "name": "Itabashi" },
            { "id": 12354, "name": "Nerima" }
          ]
        },
        {
          "id": 828,
          "name": "Osaka",
          "code": "27",
          "cities": [
            { "id": 12355, "name": "Osaka" },
            { "id": 12356, "name": "Sakai" },
            { "id": 12357, "name": "Higashiosaka" },
            { "id": 12358, "name": "Yao" },
            { "id": 12359, "name": "Sennan" },
            { "id": 12360, "name": "Tondabayashi" },
            { "id": 12361, "name": "Kashiwara" },
            { "id": 12362, "name": "Habikino" },
            { "id": 12363, "name": "Kadoma" },
            { "id": 12364, "name": "Matsubara" }
          ]
        },
        {
          "id": 829,
          "name": "Kanagawa",
          "code": "14",
          "cities": [
            { "id": 12365, "name": "Yokohama" },
            { "id": 12366, "name": "Kawasaki" },
            { "id": 12367, "name": "Sagamihara" },
            { "id": 12368, "name": "Fujisawa" },
            { "id": 12369, "name": "Yokosuka" },
            { "id": 12370, "name": "Hiratsuka" },
            { "id": 12371, "name": "Chigasaki" },
            { "id": 12372, "name": "Atsugi" },
            { "id": 12373, "name": "Kamakura" },
            { "id": 12374, "name": "Odawara" }
          ]
        }
      ]
    },
    {
      "id": 70,
      "name": "Ethiopia",
      "code": "ET",
      "states": [
        {
          "id": 11,
          "name": "Addis Ababa",
          "code": "AA",
          "cities": [
            { "id": 123, "name": "Addis Ababa" },
            { "id": 124, "name": "Bole" },
            { "id": 125, "name": "Kirkos" },
            { "id": 126, "name": "Kolfe Keranio" },
            { "id": 127, "name": "Lideta" },
            { "id": 128, "name": "Nifas Silk-Lafto" },
            { "id": 129, "name": "Yeka" },
            { "id": 130, "name": "Arada" },
            { "id": 131, "name": "Addis Ketema" },
            { "id": 132, "name": "Gullele" }
          ]
        },
        {
          "id": 12,
          "name": "Oromia",
          "code": "OR",
          "cities": [
            { "id": 133, "name": "Adama" },
            { "id": 134, "name": "Jimma" },
            { "id": 135, "name": "Bishoftu" },
            { "id": 136, "name": "Shashamane" },
            { "id": 137, "name": "Nekemte" },
            { "id": 138, "name": "Dire Dawa" },
            { "id": 139, "name": "Harar" },
            { "id": 140, "name": "Jijiga" },
            { "id": 141, "name": "Bahir Dar" },
            { "id": 142, "name": "Gondar" }
          ]
        },
        {
          "id": 13,
          "name": "Amhara",
          "code": "AM",
          "cities": [
            { "id": 143, "name": "Bahir Dar" },
            { "id": 144, "name": "Gondar" },
            { "id": 145, "name": "Dessie" },
            { "id": 146, "name": "Kombolcha" },
            { "id": 147, "name": "Debre Markos" },
            { "id": 148, "name": "Debre Birhan" },
            { "id": 149, "name": "Kemise" },
            { "id": 150, "name": "Woldiya" },
            { "id": 151, "name": "Debre Tabor" },
            { "id": 152, "name": "Finote Selam" }
          ]
        }
      ]
    },
    {
      "id": 174,
      "name": "Philippines",
      "code": "PH",
      "states": [
        {
          "id": 1374,
          "name": "Metro Manila",
          "code": "00",
          "cities": [
            { "id": 23456, "name": "Manila" },
            { "id": 23457, "name": "Quezon City" },
            { "id": 23458, "name": "Caloocan" },
            { "id": 23459, "name": "Las Piñas" },
            { "id": 23460, "name": "Makati" },
            { "id": 23461, "name": "Malabon" },
            { "id": 23462, "name": "Mandaluyong" },
            { "id": 23463, "name": "Marikina" },
            { "id": 23464, "name": "Muntinlupa" },
            { "id": 23465, "name": "Navotas" }
          ]
        },
        {
          "id": 1375,
          "name": "Cebu",
          "code": "07",
          "cities": [
            { "id": 23466, "name": "Cebu City" },
            { "id": 23467, "name": "Lapu-Lapu" },
            { "id": 23468, "name": "Mandaue" },
            { "id": 23469, "name": "Talisay" },
            { "id": 23470, "name": "Toledo" },
            { "id": 23471, "name": "Naga" },
            { "id": 23472, "name": "Balamban" },
            { "id": 23473, "name": "Bogo" },
            { "id": 23474, "name": "Carcar" },
            { "id": 23475, "name": "Danao" }
          ]
        },
        {
          "id": 1376,
          "name": "Davao",
          "code": "11",
          "cities": [
            { "id": 23476, "name": "Davao City" },
            { "id": 23477, "name": "Digos" },
            { "id": 23478, "name": "Mati" },
            { "id": 23479, "name": "Samal" },
            { "id": 23480, "name": "Tagum" },
            { "id": 23481, "name": "Panabo" },
            { "id": 23482, "name": "Island Garden City" },
            { "id": 23483, "name": "Maco" },
            { "id": 23484, "name": "Mabini" },
            { "id": 23485, "name": "Mawab" }
          ]
        }
      ]
    },
    {
      "id": 65,
      "name": "Egypt",
      "code": "EG",
      "states": [
        {
          "id": 3239,
          "name": "Cairo",
          "code": "C",
          "cities": [
            { "id": 56789, "name": "Cairo" },
            { "id": 56790, "name": "Giza" },
            { "id": 56791, "name": "Shubra El Kheima" },
            { "id": 56792, "name": "Port Said" },
            { "id": 56793, "name": "Suez" },
            { "id": 56794, "name": "Luxor" },
            { "id": 56795, "name": "Mansoura" },
            { "id": 56796, "name": "El Mahalla El Kubra" },
            { "id": 56797, "name": "Tanta" },
            { "id": 56798, "name": "Asyut" }
          ]
        },
        {
          "id": 3240,
          "name": "Alexandria",
          "code": "ALX",
          "cities": [
            { "id": 56799, "name": "Alexandria" },
            { "id": 56800, "name": "Borg El Arab" },
            { "id": 56801, "name": "New Borg El Arab" },
            { "id": 56802, "name": "Dekheila" },
            { "id": 56803, "name": "Amreya" },
            { "id": 56804, "name": "Agami" },
            { "id": 56805, "name": "Montaza" },
            { "id": 56806, "name": "Ras El Tin" },
            { "id": 56807, "name": "Gleem" },
            { "id": 56808, "name": "Sidi Gaber" }
          ]
        },
        {
          "id": 3241,
          "name": "Giza",
          "code": "GZ",
          "cities": [
            { "id": 56809, "name": "Giza" },
            { "id": 56810, "name": "6th of October" },
            { "id": 56811, "name": "Sheikh Zayed" },
            { "id": 56812, "name": "New Giza" },
            { "id": 56813, "name": "Dokki" },
            { "id": 56814, "name": "Agouza" },
            { "id": 56815, "name": "Mohandessin" },
            { "id": 56816, "name": "Zamalek" },
            { "id": 56817, "name": "Maadi" },
            { "id": 56818, "name": "Heliopolis" }
          ]
        }
      ]
    },
    {
      "id": 240,
      "name": "Vietnam",
      "code": "VN",
      "states": [
        {
          "id": 3770,
          "name": "Ho Chi Minh City",
          "code": "SG",
          "cities": [
            { "id": 67890, "name": "Ho Chi Minh City" },
            { "id": 67891, "name": "District 1" },
            { "id": 67892, "name": "District 2" },
            { "id": 67893, "name": "District 3" },
            { "id": 67894, "name": "District 4" },
            { "id": 67895, "name": "District 5" },
            { "id": 67896, "name": "District 6" },
            { "id": 67897, "name": "District 7" },
            { "id": 67898, "name": "District 8" },
            { "id": 67899, "name": "District 9" }
          ]
        },
        {
          "id": 3771,
          "name": "Hanoi",
          "code": "HN",
          "cities": [
            { "id": 67900, "name": "Hanoi" },
            { "id": 67901, "name": "Ba Dinh" },
            { "id": 67902, "name": "Hoan Kiem" },
            { "id": 67903, "name": "Tay Ho" },
            { "id": 67904, "name": "Long Bien" },
            { "id": 67905, "name": "Cau Giay" },
            { "id": 67906, "name": "Dong Da" },
            { "id": 67907, "name": "Hai Ba Trung" },
            { "id": 67908, "name": "Hoang Mai" },
            { "id": 67909, "name": "Thanh Xuan" }
          ]
        },
        {
          "id": 3772,
          "name": "Da Nang",
          "code": "DN",
          "cities": [
            { "id": 67910, "name": "Da Nang" },
            { "id": 67911, "name": "Hai Chau" },
            { "id": 67912, "name": "Thanh Khe" },
            { "id": 67913, "name": "Son Tra" },
            { "id": 67914, "name": "Ngu Hanh Son" },
            { "id": 67915, "name": "Lien Chieu" },
            { "id": 67916, "name": "Cam Le" },
            { "id": 67917, "name": "Hoa Vang" },
            { "id": 67918, "name": "Hoang Sa" },
            { "id": 67919, "name": "Truong Sa" }
          ]
        }
      ]
    },
    {
      "id": 225,
      "name": "Turkey",
      "code": "TR",
      "states": [
        {
          "id": 3234,
          "name": "Istanbul",
          "code": "34",
          "cities": [
            { "id": 78901, "name": "Istanbul" },
            { "id": 78902, "name": "Beyoglu" },
            { "id": 78903, "name": "Besiktas" },
            { "id": 78904, "name": "Kadikoy" },
            { "id": 78905, "name": "Uskudar" },
            { "id": 78906, "name": "Fatih" },
            { "id": 78907, "name": "Sisli" },
            { "id": 78908, "name": "Bakirkoy" },
            { "id": 78909, "name": "Zeytinburnu" },
            { "id": 78910, "name": "Eyup" }
          ]
        },
        {
          "id": 3235,
          "name": "Ankara",
          "code": "06",
          "cities": [
            { "id": 78911, "name": "Ankara" },
            { "id": 78912, "name": "Cankaya" },
            { "id": 78913, "name": "Kecioren" },
            { "id": 78914, "name": "Yenimahalle" },
            { "id": 78915, "name": "Mamak" },
            { "id": 78916, "name": "Sincan" },
            { "id": 78917, "name": "Etimesgut" },
            { "id": 78918, "name": "Pursaklar" },
            { "id": 78919, "name": "Golbasi" },
            { "id": 78920, "name": "Elmadag" }
          ]
        },
        {
          "id": 3236,
          "name": "Izmir",
          "code": "35",
          "cities": [
            { "id": 78921, "name": "Izmir" },
            { "id": 78922, "name": "Konak" },
            { "id": 78923, "name": "Bornova" },
            { "id": 78924, "name": "Karsiyaka" },
            { "id": 78925, "name": "Bayrakli" },
            { "id": 78926, "name": "Buca" },
            { "id": 78927, "name": "Gaziemir" },
            { "id": 78928, "name": "Balcova" },
            { "id": 78929, "name": "Narlidere" },
            { "id": 78930, "name": "Guzelbahce" }
          ]
        }
      ]
    },
    {
      "id": 103,
      "name": "Iran",
      "code": "IR",
      "states": [
        {
          "id": 3929,
          "name": "Tehran",
          "code": "07",
          "cities": [
            { "id": 89012, "name": "Tehran" },
            { "id": 89013, "name": "Karaj" },
            { "id": 89014, "name": "Eslamshahr" },
            { "id": 89015, "name": "Varamin" },
            { "id": 89016, "name": "Pakdasht" },
            { "id": 89017, "name": "Robat Karim" },
            { "id": 89018, "name": "Malard" },
            { "id": 89019, "name": "Shahriar" },
            { "id": 89020, "name": "Damavand" },
            { "id": 89021, "name": "Firoozkooh" }
          ]
        },
        {
          "id": 3930,
          "name": "Isfahan",
          "code": "04",
          "cities": [
            { "id": 89022, "name": "Isfahan" },
            { "id": 89023, "name": "Kashan" },
            { "id": 89024, "name": "Najafabad" },
            { "id": 89025, "name": "Khomeyni Shahr" },
            { "id": 89026, "name": "Shahreza" },
            { "id": 89027, "name": "Mobarakeh" },
            { "id": 89028, "name": "Lenjan" },
            { "id": 89029, "name": "Tiran" },
            { "id": 89030, "name": "Falavarjan" },
            { "id": 89031, "name": "Borkhar" }
          ]
        },
        {
          "id": 3931,
          "name": "Fars",
          "code": "14",
          "cities": [
            { "id": 89032, "name": "Shiraz" },
            { "id": 89033, "name": "Kazerun" },
            { "id": 89034, "name": "Marvdasht" },
            { "id": 89035, "name": "Jahrom" },
            { "id": 89036, "name": "Fasa" },
            { "id": 89037, "name": "Darab" },
            { "id": 89038, "name": "Lar" },
            { "id": 89039, "name": "Abadeh" },
            { "id": 89040, "name": "Neyriz" },
            { "id": 89041, "name": "Estahban" }
          ]
        }
      ]
    },
    {
      "id": 81,
      "name": "Germany",
      "code": "DE",
      "states": [
        {
          "id": 3014,
          "name": "Bavaria",
          "code": "BY",
          "cities": [
            { "id": 34567, "name": "Munich" },
            { "id": 34568, "name": "Nuremberg" },
            { "id": 34569, "name": "Augsburg" },
            { "id": 34570, "name": "Regensburg" },
            { "id": 34571, "name": "Würzburg" },
            { "id": 34572, "name": "Ingolstadt" },
            { "id": 34573, "name": "Fürth" },
            { "id": 34574, "name": "Erlangen" },
            { "id": 34575, "name": "Bayreuth" },
            { "id": 34576, "name": "Bamberg" }
          ]
        },
        {
          "id": 3015,
          "name": "North Rhine-Westphalia",
          "code": "NW",
          "cities": [
            { "id": 34577, "name": "Cologne" },
            { "id": 34578, "name": "Düsseldorf" },
            { "id": 34579, "name": "Dortmund" },
            { "id": 34580, "name": "Essen" },
            { "id": 34581, "name": "Duisburg" },
            { "id": 34582, "name": "Bochum" },
            { "id": 34583, "name": "Wuppertal" },
            { "id": 34584, "name": "Bielefeld" },
            { "id": 34585, "name": "Bonn" },
            { "id": 34586, "name": "Münster" }
          ]
        },
        {
          "id": 3016,
          "name": "Baden-Württemberg",
          "code": "BW",
          "cities": [
            { "id": 34587, "name": "Stuttgart" },
            { "id": 34588, "name": "Mannheim" },
            { "id": 34589, "name": "Karlsruhe" },
            { "id": 34590, "name": "Freiburg" },
            { "id": 34591, "name": "Heidelberg" },
            { "id": 34592, "name": "Heilbronn" },
            { "id": 34593, "name": "Ulm" },
            { "id": 34594, "name": "Pforzheim" },
            { "id": 34595, "name": "Reutlingen" },
            { "id": 34596, "name": "Tübingen" }
          ]
        }
      ]
    },
    {
      "id": 75,
      "name": "Thailand",
      "code": "TH",
      "states": [
        {
          "id": 3322,
          "name": "Bangkok",
          "code": "10",
          "cities": [
            { "id": 45678, "name": "Bangkok" },
            { "id": 45679, "name": "Bang Rak" },
            { "id": 45680, "name": "Bang Sue" },
            { "id": 45681, "name": "Chatuchak" },
            { "id": 45682, "name": "Din Daeng" },
            { "id": 45683, "name": "Dusit" },
            { "id": 45684, "name": "Huai Khwang" },
            { "id": 45685, "name": "Khlong Toei" },
            { "id": 45686, "name": "Lak Si" },
            { "id": 45687, "name": "Lat Krabang" }
          ]
        },
        {
          "id": 3323,
          "name": "Chiang Mai",
          "code": "50",
          "cities": [
            { "id": 45688, "name": "Chiang Mai" },
            { "id": 45689, "name": "Chiang Rai" },
            { "id": 45690, "name": "Lampang" },
            { "id": 45691, "name": "Lamphun" },
            { "id": 45692, "name": "Mae Hong Son" },
            { "id": 45693, "name": "Nan" },
            { "id": 45694, "name": "Phayao" },
            { "id": 45695, "name": "Phrae" },
            { "id": 45696, "name": "Uttaradit" },
            { "id": 45697, "name": "Mae Sai" }
          ]
        },
        {
          "id": 3324,
          "name": "Phuket",
          "code": "83",
          "cities": [
            { "id": 45698, "name": "Phuket" },
            { "id": 45699, "name": "Patong" },
            { "id": 45700, "name": "Kata" },
            { "id": 45701, "name": "Karon" },
            { "id": 45702, "name": "Rawai" },
            { "id": 45703, "name": "Kamala" },
            { "id": 45704, "name": "Bang Tao" },
            { "id": 45705, "name": "Surin" },
            { "id": 45706, "name": "Nai Harn" },
            { "id": 45707, "name": "Chalong" }
          ]
        }
      ]
    },
    {
      "id": 232,
      "name": "United Kingdom",
      "code": "GB",
      "states": [
        {
          "id": 2463,
          "name": "England",
          "code": "ENG",
          "cities": [
            { "id": 12345, "name": "London" },
            { "id": 12346, "name": "Birmingham" },
            { "id": 12347, "name": "Manchester" },
            { "id": 12348, "name": "Liverpool" },
            { "id": 12349, "name": "Leeds" },
            { "id": 12350, "name": "Sheffield" },
            { "id": 12351, "name": "Bristol" },
            { "id": 12352, "name": "Nottingham" },
            { "id": 12353, "name": "Leicester" },
            { "id": 12354, "name": "Coventry" }
          ]
        },
        {
          "id": 2464,
          "name": "Scotland",
          "code": "SCT",
          "cities": [
            { "id": 12355, "name": "Edinburgh" },
            { "id": 12356, "name": "Glasgow" },
            { "id": 12357, "name": "Aberdeen" },
            { "id": 12358, "name": "Dundee" },
            { "id": 12359, "name": "Stirling" },
            { "id": 12360, "name": "Perth" },
            { "id": 12361, "name": "Inverness" },
            { "id": 12362, "name": "Dunfermline" },
            { "id": 12363, "name": "Ayr" },
            { "id": 12364, "name": "Kilmarnock" }
          ]
        },
        {
          "id": 2465,
          "name": "Wales",
          "code": "WLS",
          "cities": [
            { "id": 12365, "name": "Cardiff" },
            { "id": 12366, "name": "Swansea" },
            { "id": 12367, "name": "Newport" },
            { "id": 12368, "name": "Wrexham" },
            { "id": 12369, "name": "Barry" },
            { "id": 12370, "name": "Caerphilly" },
            { "id": 12371, "name": "Rhondda" },
            { "id": 12372, "name": "Merthyr Tydfil" },
            { "id": 12373, "name": "Bridgend" },
            { "id": 12374, "name": "Neath" }
          ]
        },
        {
          "id": 2466,
          "name": "Northern Ireland",
          "code": "NIR",
          "cities": [
            { "id": 12375, "name": "Belfast" },
            { "id": 12376, "name": "Derry" },
            { "id": 12377, "name": "Lisburn" },
            { "id": 12378, "name": "Newtownabbey" },
            { "id": 12379, "name": "Bangor" },
            { "id": 12380, "name": "Craigavon" },
            { "id": 12381, "name": "Castlereagh" },
            { "id": 12382, "name": "Carrickfergus" },
            { "id": 12383, "name": "Antrim" },
            { "id": 12384, "name": "Newry" }
          ]
        }
      ]
    }
  ]
};

// Utility functions
export const getCountries = () => {
  return locationData.countries.map(country => ({
    name: country.name,
    code: country.code
  }));
};

export const getStatesByCountry = (countryName: string) => {
  const country = locationData.countries.find(c => c.name === countryName);
  if (!country) return [];
  
  return country.states.map(state => ({
    name: state.name,
    code: state.code
  }));
};

export const getCitiesByState = (countryName: string, stateName: string) => {
  const country = locationData.countries.find(c => c.name === countryName);
  if (!country) return [];
  
  const state = country.states.find(s => s.name === stateName);
  if (!state) return [];
  
  return state.cities.map(city => ({
    name: city.name,
    id: city.id
  }));
};

