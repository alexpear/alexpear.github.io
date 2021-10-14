'use strict';

const Util = require('../../util/util.js');

// Sketch of populations of nested regions in 2020 Earth.
// For the Cape Demographics fan project.
class RegionTree {
    static fullTree () {
        return {
            total: 7_715_214_000,
            eurasia: {
                total: 5_360_000_000,
                china: {
                    total: 1_400_000_000,
                    guangdong: {
                        total: 104000000
                    },
                    shandong: {
                        total: 96000000
                    },
                    henan: {
                        total: 94000000
                    },
                    sichuan: {
                        total: 80000000
                    },
                    jiangsu: {
                        total: 79000000
                    },
                    hebei: {
                        total: 72000000
                    },
                    hunan: {
                        total: 66000000
                    },
                    anhui: {
                        total: 60000000
                    },
                    hubei: {
                        total: 57000000
                    },
                    zhejiang: {
                        total: 54000000
                    },
                    guangxiZhuang: {
                        total: 46000000
                    },
                    yunnan: {
                        total: 46000000
                    },
                    jiangxi: {
                        total: 45000000
                    },
                    liaoning: {
                        total: 44000000
                    },
                    heilongjiang: {
                        total: 38000000
                    },
                    shaanxi: {
                        total: 37000000
                    },
                    fujian: {
                        total: 37000000
                    },
                    shanxi: {
                        total: 36000000
                    },
                    guizhou: {
                        total: 35000000
                    },
                    chongqing: {
                        total: 29000000
                    },
                    jilin: {
                        total: 27000000
                    },
                    gansu: {
                        total: 26000000
                    },
                    innerMongoliaAutonomousRegion: {
                        total: 25000000
                    },
                    shanghai: {
                        total: 23000000
                    },
                    xinjiangUyghurAutonomousRegion: {
                        total: 22000000
                    },
                    beijing: {
                        total: 20000000
                    },
                    tianjin: {
                        total: 13000000
                    },
                    hainan: {
                        total: 9000000
                    },
                    hongKong: {
                        total: 7000000
                    },
                    ningxiaHuiAutonomousRegion: {
                        total: 6000000
                    },
                    qinghai: {
                        total: 6000000
                    },
                    tibet: {
                        total: 3000000
                    },
                    macau: {
                        total: 552000
                    }
                    // https://en.wikipedia.org/wiki/Provinces_of_China...
                },
                india: {
                    total: 1_354_000_000,
                    uttarPradesh: {
                        total: 199800000,
                        lucknow: 3500000
                    },
                    maharashtra: {
                        total: 112000000
                    },
                    bihar: {
                        total: 104000000
                    },
                    westBengal: {
                        total: 91000000
                    },
                    madhyaPradesh: {
                        total: 73000000
                    },
                    tamilNadu: {
                        total: 72000000
                    },
                    rajasthan: {
                        total: 69000000
                    },
                    karnataka: {
                        total: 61000000
                    },
                    gujarat: {
                        total: 60000000
                    },
                    andhraPradesh: {
                        total: 50000000
                    },
                    odisha: {
                        total: 42000000
                    },
                    telangala: {
                        total: 35000000
                    },
                    kerala: {
                        total: 33000000
                    },
                    jharkhand: {
                        total: 33000000
                    },
                    assam: {
                        total: 31000000
                    },
                    punjab: {
                        total: 28000000
                    },
                    chhattisgarh: {
                        total: 26000000
                    },
                    haryana: {
                        total: 25000000
                    },
                    uttarakhand: {
                        total: 10000000
                    },
                    himachal: {
                        total: 7000000
                    },
                    tripura: {
                        total: 4000000
                    },
                    meghalaya: {
                        total: 3000000
                    },
                    manipur: {
                        total: 3000000
                    },
                    nagaland: {
                        total: 2000000
                    },
                    goa: {
                        total: 1500000
                    },
                    arunachalPradesh: {
                        total: 1400000
                    },
                    mizoram: {
                        total: 1100000
                    },
                    sikkim: {
                        total: 610000
                    },
                    // https://en.wikipedia.org/wiki/States_and_union_territories_of_India#States...
                },
                pakistan: {
                    total: 220100000,
                    balochistan: 12300000,
                    punjab: 110100000,
                    sindh: 47900000,
                    khyberPakhtunkhwa: 40500000,
                    gilgitBaltistan: 1800000,
                    azadKashmir: 4600000,
                    islamabad: 2900000
                },
                bangladesh: 166000000,
                vietnam: 97000000,
                japan: {
                    total: 127000000,
                    tokyo: {
                        total: 38140000
                    }
                },
                southKorea: {
                    total: 51000000
                },
                philippines: {
                    total: 107000000
                },
                indonesia: {
                    total: 267000000,
                    jakarta: 10150000,
                    westJava: 46700000,
                    eastJava: 38800000,
                    centralJava: 33750000
                },
                iran: {
                    total: 82000000
                },
                turkey: {
                    total: 82000000
                },
                russia: {
                    total: 144000000
                },
                germany: {
                    total: 82000000
                },
                france: {
                    total: 67000000
                },
                uk: {
                    total: 66800000,
                    england: {
                        total: 55619400
                    },
                    scotland: {
                        total: 5424800
                    },
                    wales: {
                        total: 3139000
                    },
                    northernIreland: {
                        total: 1885400
                    },
                },
                thailand: {
                    total: 67000000
                },
                italy: {
                    total: 60000000
                },
                myanmar: {
                    total: 55000000
                },
                spain: {
                    total: 47000000
                },
                afghanistan: {
                    total: 37172386
                },
                albania: {
                    total: 2866376
                },
                andorra: {
                    total: 77006
                },
                armenia: {
                    total: 2951776
                },
                austria: {
                    total: 8840521
                },
                azerbaijan: {
                    total: 9939800
                },
                belarus: {
                    total: 9483499
                },
                belgium: {
                    total: 11433256
                },
                bosniaAndHerzegovina: {
                    total: 3323929
                },
                brunei: {
                    total: 428962
                },
                bulgaria: {
                    total: 7025037
                },
                cambodia: {
                    total: 16249798
                },
                cyprus: {
                    total: 1189265
                },
                czechRepublic: {
                    total: 10629928
                },
                denmark: {
                    total: 5793636
                },
                estonia: {
                    total: 1321977
                },
                finland: {
                    total: 5515525
                },
                hungary: {
                    total: 9775564
                },
                iceland: {
                    total: 352721
                },
                iraq: {
                    total: 38433600
                },
                ireland: {
                    total: 4867309
                },
                israel: {
                    total: 8882800
                },
                malaysia: {
                    total: 31528585
                },
                turkmenistan: {
                    total: 5850908
                },
                uae: {
                    total: 9630959
                },
                uzbekistan: {
                    total: 32955400
                },
                ukraine: {
                    total: 44622516
                },
                poland: {
                    total: 37974750
                },
                portugal: {
                    total: 10283822
                },
                saudiArabia: {
                    total: 33699947
                },
                qatar: {
                    total: 2781677
                },
                vaticanCity: {
                    total: 825
                },
                jordan: {
                    total: 9956011
                },
                croatia: {
                    total: 4087843
                },
                kazakhstan: {
                    total: 18272430
                },
                kuwait: {
                    total: 4137309
                },
                kyrgyzstan: {
                    total: 6322800
                },
                laos: {
                    total: 7061507
                },
                latvia: {
                    total: 1927174
                },
                lebanon: {
                    total: 6848925
                },
                northKorea: {
                    total: 25549819
                },
                norway: {
                    total: 5311916
                },
                oman: {
                    total: 4829483
                },
                palestine: {
                    total: 4569087
                },
                svalbardAndJanMayen: {
                    total: 2572
                },
                sweden: {
                    total: 10175214
                },
                switzerland: {
                    total: 8513227
                },
                syria: {
                    total: 16906283
                },
                tajikistan: {
                    total: 9100837
                },
                yemen: {
                    total: 28498687
                },
                eastTimor: {
                    total: 1267972
                },
                georgia: {
                    total: 3726549
                },
                gibraltar: {
                    total: 33718
                },
                greece: {
                    total: 10731726
                },
                greenland: {
                    total: 56025
                },
                moldova: {
                    total: 2706049
                },
                monaco: {
                    total: 38682
                },
                mongolia: {
                    total: 3170208
                },
                montenegro: {
                    total: 631219
                },
                liechtenstein: {
                    total: 37910
                },
                lithuania: {
                    total: 2801543
                },
                luxembourg: {
                    total: 607950
                },
                northMacedonia: {
                    total: 2084367
                },
                malta: {
                    total: 484630
                },
                srilanka: {
                    total: 21670000
                },
                romania: {
                    total: 19466145
                },
                singapore: {
                    total: 5638676
                },
                slovakia: {
                    total: 5446771
                },
                slovenia: {
                    total: 2073894
                },
                nepal: {
                    total: 28087871
                },
                netherlands: {
                    total: 17231624
                },
                serbia: {
                    total: 6963764
                },
                bahrain: {
                    total: 1569439
                },
            },
            africa: {
                total: 1_294_211_893,
                nigeria: {
                    total: 196000000
                },
                ethiopia: {
                    total: 108000000
                },
                kenya: {
                    total: 51000000
                },
                egypt: {
                    total: 99000000
                },
                tanzania: 59000000,
                drc: 101900000,
                algeria: {
                    total: 42228429
                },
                angola: {
                    total: 30809762
                },
                benin: {
                    total: 11485048
                },
                centralAfricanRepublic: {
                    total: 4666377
                },
                chad: {
                    total: 15477751
                },
                botswana: {
                    total: 2254126
                },
                burkinaFaso: {
                    total: 19751535
                },
                burundi: {
                    total: 11175378
                },
                cameroon: {
                    total: 25216237
                },
                capeVerde: {
                    total: 543767
                },
                comoros: {
                    total: 832322
                },
                congo: {
                    total: 5244363
                },
                gabon: {
                    total: 2119275
                },
                gambia: {
                    total: 2280102
                },
                ghana: {
                    total: 29767108
                },
                somalia: {
                    total: 15008154
                },
                southAfrica: {
                    total: 57779622
                },
                southSudan: {
                    total: 10975920
                },
                sudan: {
                    total: 41801533
                },
                swaziland: {
                    total: 1136191
                },
                ivoryCoast: {
                    total: 25069229
                },
                lesotho: {
                    total: 2108132
                },
                mali: {
                    total: 19077690
                },
                liberia: {
                    total: 4818977
                },
                morocco: {
                    total: 36029138
                },
                mozambique: {
                    total: 29495962
                },
                namibia: {
                    total: 2448255
                },
                niger: {
                    total: 22442948
                },
                rwanda: {
                    total: 12301939
                },
                seychelles: {
                    total: 96762
                },
                sierraLeone: {
                    total: 7650154
                },
                senegal: {
                    total: 15854360
                },
                togo: {
                    total: 7889094
                },
                uganda: {
                    total: 42723139
                },
                westernSahara: {
                    total: 652271
                },
                zambia: {
                    total: 17351822
                },
                zimbabwe: {
                    total: 14439018
                },
                guinea: {
                    total: 12414318
                },
                guineaBissau: {
                    total: 1874309
                },
                madagascar: {
                    total: 26262368
                },
                malawi: {
                    total: 18143315
                },
                tunisia: {
                    total: 11565204
                },
                djibouti: {
                    total: 958920
                },
                equatorialGuinea: {
                    total: 1308974
                },
                eritrea: {
                    total: 3213972
                },
                mauritania: {
                    total: 4403319
                },
                mauritius: {
                    total: 1265303
                },
                libya: {
                    total: 6900000
                },
            },
            northAmerica: {
                total: 587_000_000,
                canada: {
                    total: 37_000_000
                },
                usa: {
                    total: 331_679_950,
                    alabama: {
                        total: 4900000,
                        montgomery: {
                            total: 201332,
                            latitude: 32.3668052,
                            longitude: -86.2999689
                        },
                        birmingham: {
                            total: 212113,
                            latitude: 33.5206608,
                            longitude: -86.80248999999999
                        },
                        mobile: {
                            total: 194899,
                            latitude: 30.6953657,
                            longitude: -88.0398912
                        },
                        huntsville: {
                            total: 186254,
                            latitude: 34.7303688,
                            longitude: -86.5861037
                        },
                        tuscaloosa: {
                            total: 95334,
                            latitude: 33.2098407,
                            longitude: -87.56917349999999
                        },
                        hoover: {
                            total: 84126,
                            latitude: 33.4053867,
                            longitude: -86.8113781
                        },
                        dothan: {
                            total: 68001,
                            latitude: 31.2232313,
                            longitude: -85.3904888
                        },
                        auburn: {
                            total: 58582,
                            latitude: 32.6098566,
                            longitude: -85.48078249999999
                        },
                        decatur: {
                            total: 55816,
                            latitude: 34.6059253,
                            longitude: -86.9833417
                        },
                        madison: {
                            total: 45799,
                            latitude: 34.6992579,
                            longitude: -86.74833180000002
                        },
                        florence: {
                            total: 40059,
                            latitude: 34.79981,
                            longitude: -87.677251
                        },
                        phenixCity: {
                            total: 37498,
                            latitude: 32.4709761,
                            longitude: -85.0007653
                        }
                    },
                    newHampshire: {
                        total: 1360000,
                        concord: {
                            total: 42419,
                            latitude: 43.2081366,
                            longitude: -71.5375718
                        },
                        manchester: {
                            total: 110378,
                            latitude: 42.9956397,
                            longitude: -71.4547891
                        },
                        nashua: {
                            total: 87137,
                            latitude: 42.7653662,
                            longitude: -71.46756599999999
                        },
                        somersworth: {
                            total: 11970
                        },
                        chicester: {
                            total: 2523
                        }
                    },
                    newYork: {
                        total: 19450000,
                        newYork: {
                            total: 8619000,
                            latitude: 40.7127837,
                            longitude: -74.0059413,
                            manhattan: {
                                total: 1660000,
                                fidi: 60900,
                                midtown: 391000,
                                harlem: 335000,
                                upperEastSide: 229000,
                                upperWestSide: 209000,
                                chinatown: 95000,
                                chelsea: 38000,
                                greenwichVillage: 22800,
                                washingtonHeights: 201590
                            },
                            brooklyn: {
                                total: 2650000,
                                bayRidge: 80000,
                                coneyIsland: 24700,
                                williamsburg: 78700,
                                bedStuy: 157530,
                                bushwick: 129239,
                                sunsetPark: 126000,
                                parkSlope: 67600,
                                downtownBrooklyn: 7053,
                                dumbo: 1139
                            },
                            queens: {
                                total: 2360000,
                                rockaway: 130000,
                                flushing: 176000,
                                astoria: 78800,
                                longIslandCity: 20030,
                                jamaica: 217000
                            },
                            statenIsland: {
                                total: 479000
                            },
                            bronx: {
                                total: 1470000
                            }
                        },
                        buffalo: {
                            total: 258959,
                            latitude: 42.88644679999999,
                            longitude: -78.8783689
                        },
                        rochester: {
                            total: 210358,
                            latitude: 43.16103,
                            longitude: -77.6109219
                        },
                        yonkers: {
                            total: 199766,
                            latitude: 40.9312099,
                            longitude: -73.89874689999999
                        },
                        syracuse: {
                            total: 144669,
                            latitude: 43.0481221,
                            longitude: -76.14742439999999
                        },
                        albany: {
                            total: 98424,
                            latitude: 42.6525793,
                            longitude: -73.7562317
                        },
                        newRochelle: {
                            total: 79446,
                            latitude: 40.9114882,
                            longitude: -73.7823549
                        },
                        mountVernon: {
                            total: 68224,
                            latitude: 40.9125992,
                            longitude: -73.8370786
                        },
                        schenectady: {
                            total: 65902,
                            latitude: 42.8142432,
                            longitude: -73.9395687
                        },
                        utica: {
                            total: 61808,
                            latitude: 43.100903,
                            longitude: -75.232664
                        },
                        whitePlains: {
                            total: 57866,
                            latitude: 41.03398620000001,
                            longitude: -73.7629097
                        },
                        hempstead: {
                            total: 55361,
                            latitude: 40.7062128,
                            longitude: -73.6187397
                        },
                        troy: {
                            total: 49974,
                            latitude: 42.7284117,
                            longitude: -73.69178509999999
                        },
                        niagaraFalls: {
                            total: 49468,
                            latitude: 43.0962143,
                            longitude: -79.0377388
                        },
                        binghamton: {
                            total: 46444,
                            latitude: 42.09868669999999,
                            longitude: -75.91797380000001
                        },
                        freeport: {
                            total: 43167,
                            latitude: 40.6576022,
                            longitude: -73.58318349999999
                        },
                        valleyStream: {
                            total: 37659,
                            latitude: 40.6642699,
                            longitude: -73.70846449999999
                        }
                    },
                    california: {
                        total: 39500000,
                        losAngeles: {
                            total: 3884307,
                            latitude: 34.0522342,
                            longitude: -118.2436849
                        },
                        sanDiego: {
                            total: 1355896,
                            latitude: 32.715738,
                            longitude: -117.1610838
                        },
                        sanJose: {
                            total: 998537,
                            latitude: 37.3382082,
                            longitude: -121.8863286
                        },
                        sanFrancisco: {
                            total: 837442,
                            latitude: 37.7749295,
                            longitude: -122.4194155
                        },
                        fresno: {
                            total: 509924,
                            latitude: 36.7468422,
                            longitude: -119.7725868
                        },
                        sacramento: {
                            total: 479686,
                            latitude: 38.5815719,
                            longitude: -121.4943996
                        },
                        longBeach: {
                            total: 469428,
                            latitude: 33.7700504,
                            longitude: -118.1937395
                        },
                        oakland: {
                            total: 406253,
                            latitude: 37.8043637,
                            longitude: -122.2711137
                        },
                        bakersfield: {
                            total: 363630,
                            latitude: 35.3732921,
                            longitude: -119.0187125
                        },
                        anaheim: {
                            total: 345012,
                            latitude: 33.8352932,
                            longitude: -117.9145036
                        },
                        santaAna: {
                            total: 334227,
                            latitude: 33.7455731,
                            longitude: -117.8678338
                        },
                        riverside: {
                            total: 316619,
                            latitude: 33.9533487,
                            longitude: -117.3961564
                        },
                        stockton: {
                            total: 298118,
                            latitude: 37.9577016,
                            longitude: -121.2907796
                        },
                        chulaVista: {
                            total: 256780,
                            latitude: 32.6400541,
                            longitude: -117.0841955
                        },
                        irvine: {
                            total: 236716,
                            latitude: 33.6839473,
                            longitude: -117.7946942
                        },
                        fremont: {
                            total: 224922,
                            latitude: 37.5482697,
                            longitude: -121.9885719
                        },
                        sanBernardino: {
                            total: 213708,
                            latitude: 34.1083449,
                            longitude: -117.2897652
                        },
                        modesto: {
                            total: 204933,
                            latitude: 37.63909719999999,
                            longitude: -120.9968782
                        },
                        oxnard: {
                            total: 203007,
                            latitude: 34.1975048,
                            longitude: -119.1770516
                        },
                        fontana: {
                            total: 203003,
                            latitude: 34.0922335,
                            longitude: -117.435048
                        },
                        morenoValley: {
                            total: 201175,
                            latitude: 33.9424658,
                            longitude: -117.2296717
                        },
                        huntingtonBeach: {
                            total: 197575,
                            latitude: 33.660297,
                            longitude: -117.9992265
                        },
                        glendale: {
                            total: 196021,
                            latitude: 34.1425078,
                            longitude: -118.255075
                        },
                        santaClarita: {
                            total: 179590,
                            latitude: 34.3916641,
                            longitude: -118.542586
                        },
                        gardenGrove: {
                            total: 175140,
                            latitude: 33.7739053,
                            longitude: -117.9414477
                        },
                        oceanside: {
                            total: 172794,
                            latitude: 33.1958696,
                            longitude: -117.3794834
                        },
                        santaRosa: {
                            total: 171990,
                            latitude: 38.440429,
                            longitude: -122.7140548
                        },
                        ranchoCucamonga: {
                            total: 171386,
                            latitude: 34.10639889999999,
                            longitude: -117.5931084
                        },
                        ontario: {
                            total: 167500,
                            latitude: 34.0633443,
                            longitude: -117.6508876
                        },
                        elkGrove: {
                            total: 161007,
                            latitude: 38.4087993,
                            longitude: -121.3716178
                        },
                        lancaster: {
                            total: 159523,
                            latitude: 34.6867846,
                            longitude: -118.1541632
                        },
                        corona: {
                            total: 159503,
                            latitude: 33.8752935,
                            longitude: -117.5664384
                        },
                        palmdale: {
                            total: 157161,
                            latitude: 34.5794343,
                            longitude: -118.1164613
                        },
                        salinas: {
                            total: 155662,
                            latitude: 36.6777372,
                            longitude: -121.6555013
                        },
                        hayward: {
                            total: 151574,
                            latitude: 37.6688205,
                            longitude: -122.0807964
                        },
                        pomona: {
                            total: 151348,
                            latitude: 34.055103,
                            longitude: -117.7499909
                        },
                        escondido: {
                            total: 148738,
                            latitude: 33.1192068,
                            longitude: -117.086421
                        },
                        sunnyvale: {
                            total: 147559,
                            latitude: 37.36883,
                            longitude: -122.0363496
                        },
                        torrance: {
                            total: 147478,
                            latitude: 33.8358492,
                            longitude: -118.3406288
                        },
                        orange: {
                            total: 139969,
                            latitude: 33.7877944,
                            longitude: -117.8531119
                        },
                        pasadena: {
                            total: 139731,
                            latitude: 34.1477849,
                            longitude: -118.1445155
                        },
                        fullerton: {
                            total: 138981,
                            latitude: 33.8703596,
                            longitude: -117.9242966
                        },
                        thousandOaks: {
                            total: 128731,
                            latitude: 34.1705609,
                            longitude: -118.8375937
                        },
                        visalia: {
                            total: 127763,
                            latitude: 36.3302284,
                            longitude: -119.2920585
                        },
                        roseville: {
                            total: 127035,
                            latitude: 38.7521235,
                            longitude: -121.2880059
                        },
                        simiValley: {
                            total: 126181,
                            latitude: 34.2694474,
                            longitude: -118.781482
                        },
                        concord: {
                            total: 125880,
                            latitude: 37.9779776,
                            longitude: -122.0310733
                        },
                        victorville: {
                            total: 121096,
                            latitude: 34.5362184,
                            longitude: -117.2927641
                        },
                        santaClara: {
                            total: 120245,
                            latitude: 37.3541079,
                            longitude: -121.9552356
                        },
                        vallejo: {
                            total: 118837,
                            latitude: 38.1040864,
                            longitude: -122.2566367
                        },
                        berkeley: {
                            total: 116768,
                            latitude: 37.8715926,
                            longitude: -122.272747
                        },
                        elMonte: {
                            total: 115708,
                            latitude: 34.0686206,
                            longitude: -118.0275667
                        },
                        downey: {
                            total: 113242,
                            latitude: 33.9401088,
                            longitude: -118.1331593
                        },
                        costaMesa: {
                            total: 112174,
                            latitude: 33.6411316,
                            longitude: -117.9186689
                        },
                        inglewood: {
                            total: 111542,
                            latitude: 33.9616801,
                            longitude: -118.3531311
                        },
                        carlsbad: {
                            total: 110972,
                            latitude: 33.1580933,
                            longitude: -117.3505939
                        },
                        fairfield: {
                            total: 109320,
                            latitude: 38.24935809999999,
                            longitude: -122.0399663
                        },
                        ventura: {
                            total: 108817,
                            latitude: 34.274646,
                            longitude: -119.2290316
                        },
                        westCovina: {
                            total: 107740,
                            latitude: 34.0686208,
                            longitude: -117.9389526
                        },
                        richmond: {
                            total: 107571,
                            latitude: 37.9357576,
                            longitude: -122.3477486
                        },
                        murrieta: {
                            total: 107479,
                            latitude: 33.5539143,
                            longitude: -117.2139232
                        },
                        antioch: {
                            total: 107100,
                            latitude: 38.0049214,
                            longitude: -121.805789
                        },
                        temecula: {
                            total: 106780,
                            latitude: 33.4936391,
                            longitude: -117.1483648
                        },
                        norwalk: {
                            total: 106589,
                            latitude: 33.9022367,
                            longitude: -118.081733
                        },
                        dalyCity: {
                            total: 104739,
                            latitude: 37.6879241,
                            longitude: -122.4702079
                        },
                        burbank: {
                            total: 104709,
                            latitude: 34.1808392,
                            longitude: -118.3089661
                        },
                        elCajon: {
                            total: 102211,
                            latitude: 32.7947731,
                            longitude: -116.9625269
                        },
                        rialto: {
                            total: 101910,
                            latitude: 34.1064001,
                            longitude: -117.3703235
                        },
                        sanMateo: {
                            total: 101128,
                            latitude: 37.5629917,
                            longitude: -122.3255254
                        },
                        clovis: {
                            total: 99769,
                            latitude: 36.8252277,
                            longitude: -119.7029194
                        },
                        jurupaValley: {
                            total: 98030,
                            latitude: 33.9971974,
                            longitude: -117.4854802
                        },
                        compton: {
                            total: 97877,
                            latitude: 33.8958492,
                            longitude: -118.2200712
                        },
                        vista: {
                            total: 96929,
                            latitude: 33.2000368,
                            longitude: -117.2425355
                        },
                        missionViejo: {
                            total: 96346,
                            latitude: 33.6000232,
                            longitude: -117.6719953
                        },
                        southGate: {
                            total: 95677,
                            latitude: 33.954737,
                            longitude: -118.2120161
                        },
                        vacaville: {
                            total: 94275,
                            latitude: 38.3565773,
                            longitude: -121.9877444
                        },
                        carson: {
                            total: 92599,
                            latitude: 33.8316745,
                            longitude: -118.281693
                        },
                        santaMonica: {
                            total: 92472,
                            latitude: 34.0194543,
                            longitude: -118.4911912
                        },
                        hesperia: {
                            total: 92147,
                            latitude: 34.4263886,
                            longitude: -117.3008784
                        },
                        westminster: {
                            total: 91739,
                            latitude: 33.7513419,
                            longitude: -117.9939921
                        },
                        redding: {
                            total: 91119,
                            latitude: 40.5865396,
                            longitude: -122.3916754
                        },
                        // We can add counties at this level, so long as there is no overlapping.
                        santaBarbaraCounty: {
                            total: 446500,
                            santaBarbara: {
                                total: 91300,
                                latitude: 34.4208305,
                                longitude: -119.6981901
                            },
                            goleta: {
                                total: 30911
                            },
                            islaVista: {
                                total: 23100
                            },
                            carpinteria: {
                                total: 13385
                            },
                            montecito: {
                                total: 8970
                            },
                            santaMaria: {
                                total: 102216,
                                latitude: 34.9530337,
                                longitude: -120.4357191
                            },
                            lompoc: {
                                total: 43509,
                                latitude: 34.6391501,
                                longitude: -120.4579409
                            }
                        },
                        sanMarcos: {
                            total: 89387,
                            latitude: 33.1433723,
                            longitude: -117.1661449
                        },
                        chico: {
                            total: 88077,
                            latitude: 39.7284944,
                            longitude: -121.8374777
                        },
                        sanLeandro: {
                            total: 87965,
                            latitude: 37.7249296,
                            longitude: -122.1560768
                        },
                        newportBeach: {
                            total: 87273,
                            latitude: 33.6189101,
                            longitude: -117.9289469
                        },
                        whittier: {
                            total: 86635,
                            latitude: 33.9791793,
                            longitude: -118.032844
                        },
                        hawthorne: {
                            total: 86199,
                            latitude: 33.9164032,
                            longitude: -118.3525748
                        },
                        citrusHeights: {
                            total: 85285,
                            latitude: 38.7071247,
                            longitude: -121.2810611
                        },
                        livermore: {
                            total: 85156,
                            latitude: 37.6818745,
                            longitude: -121.7680088
                        },
                        tracy: {
                            total: 84691,
                            latitude: 37.7396513,
                            longitude: -121.4252227
                        },
                        alhambra: {
                            total: 84577,
                            latitude: 34.095287,
                            longitude: -118.1270146
                        },
                        indio: {
                            total: 83539,
                            latitude: 33.7205771,
                            longitude: -116.2155619
                        },
                        menifee: {
                            total: 83447,
                            latitude: 33.6971468,
                            longitude: -117.185294
                        },
                        buenaPark: {
                            total: 82882,
                            latitude: 33.8675143,
                            longitude: -117.9981181
                        },
                        hemet: {
                            total: 81750,
                            latitude: 33.7475203,
                            longitude: -116.9719684
                        },
                        lakewood: {
                            total: 81121,
                            latitude: 33.8536269,
                            longitude: -118.1339563
                        },
                        merced: {
                            total: 81102,
                            latitude: 37.3021632,
                            longitude: -120.4829677
                        },
                        chino: {
                            total: 80988,
                            latitude: 34.0122346,
                            longitude: -117.688944
                        },
                        redwoodCity: {
                            total: 80872,
                            latitude: 37.48521520000001,
                            longitude: -122.2363548
                        },
                        lakeForest: {
                            total: 79312,
                            latitude: 33.6469661,
                            longitude: -117.689218
                        },
                        napa: {
                            total: 79068,
                            latitude: 38.2975381,
                            longitude: -122.286865
                        },
                        tustin: {
                            total: 78327,
                            latitude: 33.7458511,
                            longitude: -117.826166
                        },
                        mountainView: {
                            total: 77846,
                            latitude: 37.3860517,
                            longitude: -122.0838511
                        },
                        bellflower: {
                            total: 77593,
                            latitude: 33.8816818,
                            longitude: -118.1170117
                        },
                        baldwinPark: {
                            total: 76635,
                            latitude: 34.0852868,
                            longitude: -117.9608978
                        },
                        chinoHills: {
                            total: 76572,
                            latitude: 33.9898188,
                            longitude: -117.7325848
                        },
                        alameda: {
                            total: 76419,
                            latitude: 37.7652065,
                            longitude: -122.2416355
                        },
                        upland: {
                            total: 75413,
                            latitude: 34.09751,
                            longitude: -117.6483876
                        },
                        sanRamon: {
                            total: 74513,
                            latitude: 37.7799273,
                            longitude: -121.9780153
                        },
                        pleasanton: {
                            total: 74110,
                            latitude: 37.6624312,
                            longitude: -121.8746789
                        },
                        folsom: {
                            total: 73098,
                            latitude: 38.6779591,
                            longitude: -121.1760583
                        },
                        unionCity: {
                            total: 72528,
                            latitude: 37.5933918,
                            longitude: -122.0438298
                        },
                        perris: {
                            total: 72326,
                            latitude: 33.7825194,
                            longitude: -117.2286478
                        },
                        manteca: {
                            total: 71948,
                            latitude: 37.7974273,
                            longitude: -121.2160526
                        },
                        lynwood: {
                            total: 71371,
                            latitude: 33.930293,
                            longitude: -118.2114603
                        },
                        appleValley: {
                            total: 70924,
                            latitude: 34.5008311,
                            longitude: -117.1858759
                        },
                        turlock: {
                            total: 70365,
                            latitude: 37.4946568,
                            longitude: -120.8465941
                        },
                        redlands: {
                            total: 69999,
                            latitude: 34.0555693,
                            longitude: -117.1825381
                        },
                        milpitas: {
                            total: 69783,
                            latitude: 37.4323341,
                            longitude: -121.8995741
                        },
                        ranchoCordova: {
                            total: 67911,
                            latitude: 38.5890723,
                            longitude: -121.302728
                        },
                        redondoBeach: {
                            total: 67815,
                            latitude: 33.8491816,
                            longitude: -118.3884078
                        },
                        yorbaLinda: {
                            total: 67032,
                            latitude: 33.8886259,
                            longitude: -117.8131125
                        },
                        walnutCreek: {
                            total: 66900,
                            latitude: 37.9100783,
                            longitude: -122.0651819
                        },
                        pittsburg: {
                            total: 66695,
                            latitude: 38.0279762,
                            longitude: -121.8846806
                        },
                        paloAlto: {
                            total: 66642,
                            latitude: 37.4418834,
                            longitude: -122.1430195
                        },
                        davis: {
                            total: 66205,
                            latitude: 38.5449065,
                            longitude: -121.7405167
                        },
                        southSanFrancisco: {
                            total: 66174,
                            latitude: 37.654656,
                            longitude: -122.4077498
                        },
                        camarillo: {
                            total: 66086,
                            latitude: 34.2163937,
                            longitude: -119.0376023
                        },
                        yubaCity: {
                            total: 65416,
                            latitude: 39.1404477,
                            longitude: -121.6169108
                        },
                        sanClemente: {
                            total: 65040,
                            latitude: 33.4269728,
                            longitude: -117.6119925
                        },
                        lagunaNiguel: {
                            total: 64652,
                            latitude: 33.5225261,
                            longitude: -117.7075526
                        },
                        picoRivera: {
                            total: 63771,
                            latitude: 33.9830688,
                            longitude: -118.096735
                        },
                        montebello: {
                            total: 63495,
                            latitude: 34.0165053,
                            longitude: -118.1137535
                        },
                        lodi: {
                            total: 63338,
                            latitude: 38.1341477,
                            longitude: -121.2722194
                        },
                        madera: {
                            total: 63105,
                            latitude: 36.9613356,
                            longitude: -120.0607176
                        },
                        santaCruzCounty: {
                            total: 273213,
                            santaCruz: {
                                total: 62864,
                                latitude: 36.9741171,
                                longitude: -122.0307963
                            },
                            watsonville: {
                                total: 52477,
                                latitude: 36.910231,
                                longitude: -121.7568946
                            }
                        },
                        castroville: {
                            total: 6481
                        },
                        kingCity: {
                            total: 14077
                        },
                        laHabra: {
                            total: 61653,
                            latitude: 33.9319578,
                            longitude: -117.9461734
                        },
                        encinitas: {
                            total: 61588,
                            latitude: 33.0369867,
                            longitude: -117.2919818
                        },
                        tulare: {
                            total: 61170,
                            latitude: 36.2077288,
                            longitude: -119.3473379
                        },
                        montereyPark: {
                            total: 61085,
                            latitude: 34.0625106,
                            longitude: -118.1228476
                        },
                        cupertino: {
                            total: 60189,
                            latitude: 37.3229978,
                            longitude: -122.0321823
                        },
                        gardena: {
                            total: 59957,
                            latitude: 33.8883487,
                            longitude: -118.3089624
                        },
                        nationalCity: {
                            total: 59834,
                            latitude: 32.6781085,
                            longitude: -117.0991967
                        },
                        rocklin: {
                            total: 59738,
                            latitude: 38.7907339,
                            longitude: -121.2357828
                        },
                        petaluma: {
                            total: 59440,
                            latitude: 38.232417,
                            longitude: -122.6366524
                        },
                        sanRafael: {
                            total: 58994,
                            latitude: 37.9735346,
                            longitude: -122.5310874
                        },
                        huntingtonPark: {
                            total: 58879,
                            latitude: 33.9816812,
                            longitude: -118.2250725
                        },
                        laMesa: {
                            total: 58642,
                            latitude: 32.7678287,
                            longitude: -117.0230839
                        },
                        arcadia: {
                            total: 57639,
                            latitude: 34.1397292,
                            longitude: -118.0353449
                        },
                        lakeElsinore: {
                            total: 57525,
                            latitude: 33.6680772,
                            longitude: -117.3272615
                        },
                        fountainValley: {
                            total: 56707,
                            latitude: 33.7091847,
                            longitude: -117.9536697
                        },
                        woodland: {
                            total: 56590,
                            latitude: 38.67851570000001,
                            longitude: -121.7732971
                        },
                        diamondBar: {
                            total: 56449,
                            latitude: 34.0286226,
                            longitude: -117.8103367
                        },
                        santee: {
                            total: 56105,
                            latitude: 32.8383828,
                            longitude: -116.9739167
                        },
                        eastvale: {
                            total: 55191,
                            latitude: 33.952463,
                            longitude: -117.5848025
                        },
                        porterville: {
                            total: 55174,
                            latitude: 36.06523,
                            longitude: -119.0167679
                        },
                        brentwood: {
                            total: 55000,
                            latitude: 37.931868,
                            longitude: -121.6957863
                        },
                        paramount: {
                            total: 54980,
                            latitude: 33.8894598,
                            longitude: -118.1597911
                        },
                        hanford: {
                            total: 54686,
                            latitude: 36.3274502,
                            longitude: -119.6456844
                        },
                        rosemead: {
                            total: 54561,
                            latitude: 34.0805651,
                            longitude: -118.072846
                        },
                        highland: {
                            total: 54291,
                            latitude: 34.1283442,
                            longitude: -117.2086513
                        },
                        novato: {
                            total: 54194,
                            latitude: 38.1074198,
                            longitude: -122.5697032
                        },
                        colton: {
                            total: 53243,
                            latitude: 34.0739016,
                            longitude: -117.3136547
                        },
                        cathedralCity: {
                            total: 52977,
                            latitude: 33.7805388,
                            longitude: -116.4668036
                        },
                        yucaipa: {
                            total: 52536,
                            latitude: 34.033625,
                            longitude: -117.0430865
                        },
                        delano: {
                            total: 52403,
                            latitude: 35.7688425,
                            longitude: -119.2470536
                        },
                        placentia: {
                            total: 52206,
                            latitude: 33.8722371,
                            longitude: -117.8703363
                        },
                        dublin: {
                            total: 52105,
                            latitude: 37.7021521,
                            longitude: -121.9357918
                        },
                        gilroy: {
                            total: 51701,
                            latitude: 37.0057816,
                            longitude: -121.5682751
                        },
                        glendora: {
                            total: 51074,
                            latitude: 34.1361187,
                            longitude: -117.865339
                        },
                        palmDesert: {
                            total: 50508,
                            latitude: 33.7222445,
                            longitude: -116.3744556
                        },
                        alisoViejo: {
                            total: 50175,
                            latitude: 33.5676842,
                            longitude: -117.7256083
                        },
                        westSacramento: {
                            total: 49891,
                            latitude: 38.5804609,
                            longitude: -121.530234
                        },
                        cerritos: {
                            total: 49707,
                            latitude: 33.8583483,
                            longitude: -118.0647871
                        },
                        poway: {
                            total: 49417,
                            latitude: 32.9628232,
                            longitude: -117.0358646
                        },
                        ranchoSantaMargarita: {
                            total: 49228,
                            latitude: 33.640855,
                            longitude: -117.603104
                        },
                        laMirada: {
                            total: 49133,
                            latitude: 33.9172357,
                            longitude: -118.0120086
                        },
                        cypress: {
                            total: 49087,
                            latitude: 33.8169599,
                            longitude: -118.0372852
                        },
                        covina: {
                            total: 48508,
                            latitude: 34.0900091,
                            longitude: -117.8903397
                        },
                        azusa: {
                            total: 47842,
                            latitude: 34.1336186,
                            longitude: -117.9075627
                        },
                        ceres: {
                            total: 46714,
                            latitude: 37.5949316,
                            longitude: -120.9577098
                        },
                        sanLuisObispo: {
                            total: 46377,
                            latitude: 35.2827524,
                            longitude: -120.6596156
                        },
                        palmSprings: {
                            total: 46281,
                            latitude: 33.8302961,
                            longitude: -116.5452921
                        },
                        sanJacinto: {
                            total: 45851,
                            latitude: 33.7839084,
                            longitude: -116.958635
                        },
                        lincoln: {
                            total: 45237,
                            latitude: 38.891565,
                            longitude: -121.2930079
                        },
                        newark: {
                            total: 44096,
                            latitude: 37.5296593,
                            longitude: -122.0402399
                        },
                        elCentro: {
                            total: 43363,
                            latitude: 32.792,
                            longitude: -115.5630514
                        },
                        danville: {
                            total: 43341,
                            latitude: 37.8215929,
                            longitude: -121.9999606
                        },
                        coachella: {
                            total: 43092,
                            latitude: 33.6803003,
                            longitude: -116.173894
                        },
                        bellGardens: {
                            total: 42889,
                            latitude: 33.9652918,
                            longitude: -118.1514588
                        },
                        ranchoPalosVerdes: {
                            total: 42448,
                            latitude: 33.7444613,
                            longitude: -118.3870173
                        },
                        sanBruno: {
                            total: 42443,
                            latitude: 37.6304904,
                            longitude: -122.4110835
                        },
                        rohnertPark: {
                            total: 41398,
                            latitude: 38.3396367,
                            longitude: -122.7010984
                        },
                        brea: {
                            total: 40963,
                            latitude: 33.9166805,
                            longitude: -117.9000604
                        },
                        morganHill: {
                            total: 40836,
                            latitude: 37.1305012,
                            longitude: -121.6543901
                        },
                        campbell: {
                            total: 40584,
                            latitude: 37.2871651,
                            longitude: -121.9499568
                        },
                        beaumont: {
                            total: 40481,
                            latitude: 33.9294606,
                            longitude: -116.977248
                        },
                        laPuente: {
                            total: 40435,
                            latitude: 34.0200114,
                            longitude: -117.9495083
                        },
                        sanGabriel: {
                            total: 40275,
                            latitude: 34.09611110000001,
                            longitude: -118.1058333
                        },
                        culverCity: {
                            total: 39428,
                            latitude: 34.0211224,
                            longitude: -118.3964665
                        },
                        calexico: {
                            total: 39389,
                            latitude: 32.6789476,
                            longitude: -115.4988834
                        },
                        laQuinta: {
                            total: 39331,
                            latitude: 33.6633573,
                            longitude: -116.3100095
                        },
                        stanton: {
                            total: 38623,
                            latitude: 33.8025155,
                            longitude: -117.9931165
                        },
                        pacifica: {
                            total: 38606,
                            latitude: 37.6138253,
                            longitude: -122.4869194
                        },
                        oakley: {
                            total: 38194,
                            latitude: 37.9974219,
                            longitude: -121.7124536
                        },
                        montclair: {
                            total: 38027,
                            latitude: 34.0775104,
                            longitude: -117.6897776
                        },
                        martinez: {
                            total: 37165,
                            latitude: 38.0193657,
                            longitude: -122.1341321
                        },
                        monrovia: {
                            total: 37101,
                            latitude: 34.1442616,
                            longitude: -118.0019482
                        }
                    },
                    illinois: {
                        total: 12700000,
                        chicago: {
                            total: 2718782,
                            latitude: 41.8781136,
                            longitude: -87.6297982
                        },
                        aurora: {
                            total: 199963,
                            latitude: 41.7605849,
                            longitude: -88.32007150000001
                        },
                        rockford: {
                            total: 150251,
                            latitude: 42.2711311,
                            longitude: -89.0939952
                        },
                        joliet: {
                            total: 147806,
                            latitude: 41.525031,
                            longitude: -88.0817251
                        },
                        naperville: {
                            total: 144864,
                            latitude: 41.7508391,
                            longitude: -88.1535352
                        },
                        springfield: {
                            total: 117006,
                            latitude: 39.78172130000001,
                            longitude: -89.6501481
                        },
                        peoria: {
                            total: 116513,
                            latitude: 40.6936488,
                            longitude: -89.5889864
                        },
                        elgin: {
                            total: 110145,
                            latitude: 42.0354084,
                            longitude: -88.2825668
                        },
                        waukegan: {
                            total: 88826,
                            latitude: 42.3636331,
                            longitude: -87.84479379999999
                        },
                        cicero: {
                            total: 84103,
                            latitude: 41.8455877,
                            longitude: -87.7539448
                        },
                        champaign: {
                            total: 83424,
                            latitude: 40.1164204,
                            longitude: -88.2433829
                        },
                        bloomington: {
                            total: 78902,
                            latitude: 40.4842027,
                            longitude: -88.99368729999999
                        },
                        arlingtonHeights: {
                            total: 75994,
                            latitude: 42.0883603,
                            longitude: -87.98062650000001
                        },
                        evanston: {
                            total: 75570,
                            latitude: 42.0450722,
                            longitude: -87.68769689999999
                        },
                        schaumburg: {
                            total: 74907,
                            latitude: 42.0333607,
                            longitude: -88.0834059
                        },
                        decatur: {
                            total: 74710,
                            latitude: 39.8403147,
                            longitude: -88.9548001
                        },
                        bolingbrook: {
                            total: 73936,
                            latitude: 41.69864159999999,
                            longitude: -88.0683955
                        },
                        palatine: {
                            total: 69350,
                            latitude: 42.1103041,
                            longitude: -88.03424000000001
                        },
                        skokie: {
                            total: 65176,
                            latitude: 42.0324025,
                            longitude: -87.7416246
                        },
                        desPlaines: {
                            total: 58918,
                            latitude: 42.0333623,
                            longitude: -87.88339909999999
                        },
                        orlandPark: {
                            total: 58590,
                            latitude: 41.6303103,
                            longitude: -87.85394250000002
                        },
                        tinleyPark: {
                            total: 57282,
                            latitude: 41.5731442,
                            longitude: -87.7932939
                        },
                        oakLawn: {
                            total: 57073,
                            latitude: 41.719978,
                            longitude: -87.7479528
                        },
                        berwyn: {
                            total: 56758,
                            latitude: 41.85058739999999,
                            longitude: -87.7936685
                        },
                        mountProspect: {
                            total: 54771,
                            latitude: 42.0664167,
                            longitude: -87.9372908
                        },
                        normal: {
                            total: 54664,
                            latitude: 40.5142026,
                            longitude: -88.9906312
                        },
                        wheaton: {
                            total: 53648,
                            latitude: 41.8661403,
                            longitude: -88.1070127
                        },
                        hoffmanEstates: {
                            total: 52398,
                            latitude: 42.0629915,
                            longitude: -88.12271989999999
                        },
                        oakPark: {
                            total: 52066,
                            latitude: 41.8850317,
                            longitude: -87.7845025
                        },
                        downersGrove: {
                            total: 49670,
                            latitude: 41.8089191,
                            longitude: -88.01117459999999
                        },
                        elmhurst: {
                            total: 45556,
                            latitude: 41.8994744,
                            longitude: -87.9403418
                        },
                        glenview: {
                            total: 45417,
                            latitude: 42.0697509,
                            longitude: -87.7878408
                        },
                        lombard: {
                            total: 43907,
                            latitude: 41.8800296,
                            longitude: -88.00784349999999
                        },
                        dekalb: {
                            total: 43849,
                            latitude: 41.9294736,
                            longitude: -88.75036469999999
                        },
                        moline: {
                            total: 43116,
                            latitude: 41.5067003,
                            longitude: -90.51513419999999
                        },
                        belleville: {
                            total: 42895,
                            latitude: 38.5200504,
                            longitude: -89.9839935
                        },
                        buffaloGrove: {
                            total: 41778,
                            latitude: 42.1662831,
                            longitude: -87.9631308
                        },
                        urbana: {
                            total: 41752,
                            latitude: 40.1105875,
                            longitude: -88.2072697
                        },
                        plainfield: {
                            total: 41734,
                            latitude: 41.632223,
                            longitude: -88.2120315
                        },
                        bartlett: {
                            total: 41679,
                            latitude: 41.9950276,
                            longitude: -88.1856301
                        },
                        quincy: {
                            total: 40915,
                            latitude: 39.9356016,
                            longitude: -91.4098726
                        },
                        crystalLake: {
                            total: 40388,
                            latitude: 42.2411344,
                            longitude: -88.31619649999999
                        },
                        carolStream: {
                            total: 40379,
                            latitude: 41.91252859999999,
                            longitude: -88.13479269999999
                        },
                        streamwood: {
                            total: 40351,
                            latitude: 42.0255827,
                            longitude: -88.17840849999999
                        },
                        romeoville: {
                            total: 39650,
                            latitude: 41.6475306,
                            longitude: -88.0895061
                        },
                        rockIsland: {
                            total: 38877,
                            latitude: 41.5094771,
                            longitude: -90.5787476
                        },
                        hanoverPark: {
                            total: 38510,
                            latitude: 41.9994722,
                            longitude: -88.1450735
                        },
                        carpentersville: {
                            total: 38241,
                            latitude: 42.1211364,
                            longitude: -88.2578582
                        },
                        wheeling: {
                            total: 38015,
                            latitude: 42.1391927,
                            longitude: -87.9289591
                        },
                        parkRidge: {
                            total: 37839,
                            latitude: 42.0111412,
                            longitude: -87.84061919999999
                        },
                        addison: {
                            total: 37385,
                            latitude: 41.931696,
                            longitude: -87.9889556
                        },
                        calumetCity: {
                            total: 37240,
                            latitude: 41.6155909,
                            longitude: -87.5294871
                        }
                    },
                    texas: {
                        total: 29000000,
                        houston: {
                            total: 2195914,
                            latitude: 29.7604267,
                            longitude: -95.3698028
                        },
                        sanAntonio: {
                            total: 1409019,
                            latitude: 29.4241219,
                            longitude: -98.49362819999999
                        },
                        dallas: {
                            total: 1257676,
                            latitude: 32.7766642,
                            longitude: -96.79698789999999
                        },
                        austin: {
                            total: 885400,
                            latitude: 30.267153,
                            longitude: -97.7430608
                        },
                        fortWorth: {
                            total: 792727,
                            latitude: 32.7554883,
                            longitude: -97.3307658
                        },
                        elPaso: {
                            total: 674433,
                            latitude: 31.7775757,
                            longitude: -106.4424559
                        },
                        arlington: {
                            total: 379577,
                            latitude: 32.735687,
                            longitude: -97.10806559999999
                        },
                        corpusChristi: {
                            total: 316381,
                            latitude: 27.8005828,
                            longitude: -97.39638099999999
                        },
                        plano: {
                            total: 274409,
                            latitude: 33.0198431,
                            longitude: -96.6988856
                        },
                        laredo: {
                            total: 248142,
                            latitude: 27.5305671,
                            longitude: -99.48032409999999
                        },
                        lubbock: {
                            total: 239538,
                            latitude: 33.5778631,
                            longitude: -101.8551665
                        },
                        garland: {
                            total: 234566,
                            latitude: 32.912624,
                            longitude: -96.63888329999999
                        },
                        irving: {
                            total: 228653,
                            latitude: 32.8140177,
                            longitude: -96.9488945
                        },
                        amarillo: {
                            total: 196429,
                            latitude: 35.2219971,
                            longitude: -101.8312969
                        },
                        grandPrairie: {
                            total: 183372,
                            latitude: 32.7459645,
                            longitude: -96.99778459999999
                        },
                        brownsville: {
                            total: 181860,
                            latitude: 25.9017472,
                            longitude: -97.4974838
                        },
                        pasadena: {
                            total: 152735,
                            latitude: 29.6910625,
                            longitude: -95.2091006
                        },
                        mckinney: {
                            total: 148559,
                            latitude: 33.1972465,
                            longitude: -96.6397822
                        },
                        mesquite: {
                            total: 143484,
                            latitude: 32.76679550000001,
                            longitude: -96.5991593
                        },
                        killeen: {
                            total: 137147,
                            latitude: 31.1171194,
                            longitude: -97.72779589999999
                        },
                        frisco: {
                            total: 136791,
                            latitude: 33.1506744,
                            longitude: -96.82361159999999
                        },
                        mcallen: {
                            total: 136639,
                            latitude: 26.2034071,
                            longitude: -98.23001239999999
                        },
                        waco: {
                            total: 129030,
                            latitude: 31.549333,
                            longitude: -97.1466695
                        },
                        carrollton: {
                            total: 126700,
                            latitude: 32.9756415,
                            longitude: -96.8899636
                        },
                        midland: {
                            total: 123933,
                            latitude: 31.9973456,
                            longitude: -102.0779146
                        },
                        denton: {
                            total: 123099,
                            latitude: 33.2148412,
                            longitude: -97.13306829999999
                        },
                        abilene: {
                            total: 120099,
                            latitude: 32.4487364,
                            longitude: -99.73314390000002
                        },
                        beaumont: {
                            total: 117796,
                            latitude: 30.080174,
                            longitude: -94.1265562
                        },
                        odessa: {
                            total: 110720,
                            latitude: 31.8456816,
                            longitude: -102.3676431
                        },
                        roundRock: {
                            total: 109821,
                            latitude: 30.5082551,
                            longitude: -97.678896
                        },
                        wichitaFalls: {
                            total: 104898,
                            latitude: 33.9137085,
                            longitude: -98.4933873
                        },
                        richardson: {
                            total: 104475,
                            latitude: 32.9483335,
                            longitude: -96.7298519
                        },
                        lewisville: {
                            total: 101074,
                            latitude: 33.046233,
                            longitude: -96.994174
                        },
                        tyler: {
                            total: 100223,
                            latitude: 32.3512601,
                            longitude: -95.30106239999999
                        },
                        pearland: {
                            total: 100065,
                            latitude: 29.5635666,
                            longitude: -95.2860474
                        },
                        collegeStation: {
                            total: 100050,
                            latitude: 30.627977,
                            longitude: -96.3344068
                        },
                        sanAngelo: {
                            total: 97492,
                            latitude: 31.4637723,
                            longitude: -100.4370375
                        },
                        allen: {
                            total: 92020,
                            latitude: 33.1031744,
                            longitude: -96.67055030000002
                        },
                        leagueCity: {
                            total: 90983,
                            latitude: 29.5074538,
                            longitude: -95.0949303
                        },
                        sugarLand: {
                            total: 83860,
                            latitude: 29.6196787,
                            longitude: -95.6349463
                        },
                        longview: {
                            total: 81443,
                            latitude: 32.5007037,
                            longitude: -94.74048909999999
                        },
                        mission: {
                            total: 81050,
                            latitude: 26.2159066,
                            longitude: -98.32529319999999
                        },
                        edinburg: {
                            total: 80836,
                            latitude: 26.3017374,
                            longitude: -98.1633432
                        },
                        bryan: {
                            total: 78709,
                            latitude: 30.6743643,
                            longitude: -96.3699632
                        },
                        baytown: {
                            total: 75418,
                            latitude: 29.7355047,
                            longitude: -94.97742740000001
                        },
                        pharr: {
                            total: 73790,
                            latitude: 26.1947962,
                            longitude: -98.1836216
                        },
                        temple: {
                            total: 70190,
                            latitude: 31.0982344,
                            longitude: -97.342782
                        },
                        missouriCity: {
                            total: 70185,
                            latitude: 29.6185669,
                            longitude: -95.5377215
                        },
                        flowerMound: {
                            total: 68609,
                            latitude: 33.0145673,
                            longitude: -97.0969552
                        },
                        northRichlandHills: {
                            total: 67317,
                            latitude: 32.8342952,
                            longitude: -97.2289029
                        },
                        harlingen: {
                            total: 65665,
                            latitude: 26.1906306,
                            longitude: -97.69610259999999
                        },
                        victoria: {
                            total: 65098,
                            latitude: 28.8052674,
                            longitude: -97.0035982
                        },
                        newBraunfels: {
                            total: 63279,
                            latitude: 29.7030024,
                            longitude: -98.1244531
                        },
                        conroe: {
                            total: 63032,
                            latitude: 30.3118769,
                            longitude: -95.45605119999999
                        },
                        cedarPark: {
                            total: 61238,
                            latitude: 30.505198,
                            longitude: -97.8202888
                        },
                        mansfield: {
                            total: 60872,
                            latitude: 32.5631924,
                            longitude: -97.1416768
                        },
                        rowlett: {
                            total: 58043,
                            latitude: 32.9029017,
                            longitude: -96.56388
                        },
                        georgetown: {
                            total: 54898,
                            latitude: 30.6332618,
                            longitude: -97.6779842
                        },
                        portArthur: {
                            total: 54135,
                            latitude: 29.8849504,
                            longitude: -93.93994699999999
                        },
                        sanMarcos: {
                            total: 54076,
                            latitude: 29.8832749,
                            longitude: -97.9413941
                        },
                        pflugerville: {
                            total: 53752,
                            latitude: 30.4393696,
                            longitude: -97.62000429999999
                        },
                        euless: {
                            total: 53224,
                            latitude: 32.8370727,
                            longitude: -97.08195409999999
                        },
                        desoto: {
                            total: 51483,
                            latitude: 32.5896998,
                            longitude: -96.8570738
                        },
                        grapevine: {
                            total: 50195,
                            latitude: 32.9342919,
                            longitude: -97.0780654
                        },
                        galveston: {
                            total: 48733,
                            latitude: 29.3013479,
                            longitude: -94.7976958
                        },
                        bedford: {
                            total: 48592,
                            latitude: 32.844017,
                            longitude: -97.1430671
                        },
                        cedarHill: {
                            total: 46663,
                            latitude: 32.5884689,
                            longitude: -96.9561152
                        },
                        texasCity: {
                            total: 46081,
                            latitude: 29.383845,
                            longitude: -94.9027002
                        },
                        wylie: {
                            total: 44575,
                            latitude: 33.0151201,
                            longitude: -96.5388789
                        },
                        haltomCity: {
                            total: 43580,
                            latitude: 32.7995738,
                            longitude: -97.26918169999999
                        },
                        keller: {
                            total: 42907,
                            latitude: 32.9341893,
                            longitude: -97.229298
                        },
                        rockwall: {
                            total: 40922,
                            latitude: 32.93123360000001,
                            longitude: -96.4597089
                        },
                        burleson: {
                            total: 40714,
                            latitude: 32.5420821,
                            longitude: -97.3208492
                        },
                        coppell: {
                            total: 40342,
                            latitude: 32.9545687,
                            longitude: -97.01500779999999
                        },
                        huntsville: {
                            total: 39795,
                            latitude: 30.7235263,
                            longitude: -95.55077709999999
                        },
                        duncanville: {
                            total: 39605,
                            latitude: 32.6518004,
                            longitude: -96.9083366
                        },
                        theColony: {
                            total: 39458,
                            latitude: 33.0806083,
                            longitude: -96.89283089999999
                        },
                        sherman: {
                            total: 39296,
                            latitude: 33.6356618,
                            longitude: -96.6088805
                        },
                        hurst: {
                            total: 38448,
                            latitude: 32.8234621,
                            longitude: -97.1705678
                        },
                        lancaster: {
                            total: 38071,
                            latitude: 32.5920798,
                            longitude: -96.7561082
                        },
                        friendswood: {
                            total: 37587,
                            latitude: 29.5293998,
                            longitude: -95.2010447
                        },
                        texarkana: {
                            total: 37442,
                            latitude: 33.425125,
                            longitude: -94.04768820000001
                        },
                        weslaco: {
                            total: 37093,
                            latitude: 26.1595194,
                            longitude: -97.9908366
                        }
                    },
                    pennsylvania: {
                        total: 12800000,
                        philadelphia: {
                            total: 1553165,
                            latitude: 39.9525839,
                            longitude: -75.1652215
                        },
                        pittsburgh: {
                            total: 305841,
                            latitude: 40.44062479999999,
                            longitude: -79.9958864
                        },
                        allentown: {
                            total: 118577,
                            latitude: 40.6084305,
                            longitude: -75.4901833
                        },
                        erie: {
                            total: 100671,
                            latitude: 42.12922409999999,
                            longitude: -80.085059
                        },
                        reading: {
                            total: 87893,
                            latitude: 40.3356483,
                            longitude: -75.9268747
                        },
                        scranton: {
                            total: 75806,
                            latitude: 41.408969,
                            longitude: -75.66241219999999
                        },
                        bethlehem: {
                            total: 75018,
                            latitude: 40.6259316,
                            longitude: -75.37045789999999
                        },
                        lancaster: {
                            total: 59325,
                            latitude: 40.0378755,
                            longitude: -76.3055144
                        },
                        harrisburg: {
                            total: 49188,
                            latitude: 40.2731911,
                            longitude: -76.8867008
                        },
                        altoona: {
                            total: 45796,
                            latitude: 40.5186809,
                            longitude: -78.3947359
                        },
                        york: {
                            total: 43935,
                            latitude: 39.9625984,
                            longitude: -76.727745
                        },
                        stateCollege: {
                            total: 41757,
                            latitude: 40.7933949,
                            longitude: -77.8600012
                        },
                        wilkesBarre: {
                            total: 41108,
                            latitude: 41.2459149,
                            longitude: -75.88130749999999
                        }
                    },
                    arizona: {
                        total: 7280000,
                        phoenix: {
                            total: 1513367,
                            latitude: 33.4483771,
                            longitude: -112.0740373
                        },
                        tucson: {
                            total: 526116,
                            latitude: 32.2217429,
                            longitude: -110.926479
                        },
                        mesa: {
                            total: 457587,
                            latitude: 33.4151843,
                            longitude: -111.8314724
                        },
                        chandler: {
                            total: 249146,
                            latitude: 33.3061605,
                            longitude: -111.8412502
                        },
                        glendale: {
                            total: 234632,
                            latitude: 33.5386523,
                            longitude: -112.1859866
                        },
                        gilbert: {
                            total: 229972,
                            latitude: 33.3528264,
                            longitude: -111.789027
                        },
                        scottsdale: {
                            total: 226918,
                            latitude: 33.4941704,
                            longitude: -111.9260519
                        },
                        tempe: {
                            total: 168228,
                            latitude: 33.4255104,
                            longitude: -111.9400054
                        },
                        peoria: {
                            total: 162592,
                            latitude: 33.5805955,
                            longitude: -112.2373779
                        },
                        surprise: {
                            total: 123546,
                            latitude: 33.6292337,
                            longitude: -112.3679279
                        },
                        yuma: {
                            total: 91923,
                            latitude: 32.6926512,
                            longitude: -114.6276916
                        },
                        avondale: {
                            total: 78822,
                            latitude: 33.4355977,
                            longitude: -112.3496021
                        },
                        goodyear: {
                            total: 72864,
                            latitude: 33.4353394,
                            longitude: -112.3576567
                        },
                        flagstaff: {
                            total: 68667,
                            latitude: 35.1982836,
                            longitude: -111.651302
                        },
                        buckeye: {
                            total: 56683,
                            latitude: 33.3703197,
                            longitude: -112.5837766
                        },
                        lakeHavasuCity: {
                            total: 52844,
                            latitude: 34.483901,
                            longitude: -114.3224548
                        },
                        casaGrande: {
                            total: 50111,
                            latitude: 32.8795022,
                            longitude: -111.7573521
                        },
                        maricopa: {
                            total: 45508,
                            latitude: 33.0581063,
                            longitude: -112.0476423
                        },
                        sierraVista: {
                            total: 45129,
                            latitude: 31.5455001,
                            longitude: -110.2772856
                        },
                        oroValley: {
                            total: 41627,
                            latitude: 32.3909071,
                            longitude: -110.966488
                        },
                        prescott: {
                            total: 40590,
                            latitude: 34.5400242,
                            longitude: -112.4685025
                        },
                        prescottValley: {
                            total: 39791,
                            latitude: 34.6100243,
                            longitude: -112.315721
                        },
                        bullheadCity: {
                            total: 39383,
                            latitude: 35.1359386,
                            longitude: -114.5285981
                        },
                        marana: {
                            total: 38290,
                            latitude: 32.436381,
                            longitude: -111.2224422
                        },
                        apacheJunction: {
                            total: 37130,
                            latitude: 33.4150485,
                            longitude: -111.5495777
                        }
                    },
                    indiana: {
                        total: 6700000,
                        indianapolis: {
                            total: 843393,
                            latitude: 39.768403,
                            longitude: -86.158068
                        },
                        fortWayne: {
                            total: 256496,
                            latitude: 41.079273,
                            longitude: -85.1393513
                        },
                        evansville: {
                            total: 120310,
                            latitude: 37.9715592,
                            longitude: -87.5710898
                        },
                        southBend: {
                            total: 100886,
                            latitude: 41.6763545,
                            longitude: -86.25198979999999
                        },
                        carmel: {
                            total: 85927,
                            latitude: 39.978371,
                            longitude: -86.1180435
                        },
                        fishers: {
                            total: 83891,
                            latitude: 39.9567548,
                            longitude: -86.01335
                        },
                        bloomington: {
                            total: 82575,
                            latitude: 39.165325,
                            longitude: -86.52638569999999
                        },
                        hammond: {
                            total: 78967,
                            latitude: 41.5833688,
                            longitude: -87.5000412
                        },
                        gary: {
                            total: 78450,
                            latitude: 41.5933696,
                            longitude: -87.3464271
                        },
                        lafayette: {
                            total: 70373,
                            latitude: 40.4167022,
                            longitude: -86.87528689999999
                        },
                        muncie: {
                            total: 70316,
                            latitude: 40.1933767,
                            longitude: -85.3863599
                        },
                        terreHaute: {
                            total: 61025,
                            latitude: 39.4667034,
                            longitude: -87.41390919999999
                        },
                        kokomo: {
                            total: 56895,
                            latitude: 40.486427,
                            longitude: -86.13360329999999
                        },
                        noblesville: {
                            total: 56540,
                            latitude: 40.0455917,
                            longitude: -86.0085955
                        },
                        anderson: {
                            total: 55670,
                            latitude: 40.1053196,
                            longitude: -85.6802541
                        },
                        greenwood: {
                            total: 53665,
                            latitude: 39.6136578,
                            longitude: -86.10665259999999
                        },
                        elkhart: {
                            total: 51265,
                            latitude: 41.6819935,
                            longitude: -85.9766671
                        },
                        mishawaka: {
                            total: 47989,
                            latitude: 41.6619927,
                            longitude: -86.15861559999999
                        },
                        lawrence: {
                            total: 47135,
                            latitude: 39.8386516,
                            longitude: -86.0252612
                        },
                        jeffersonville: {
                            total: 45929,
                            latitude: 38.2775702,
                            longitude: -85.7371847
                        },
                        columbus: {
                            total: 45775,
                            latitude: 39.2014404,
                            longitude: -85.9213796
                        }
                    },
                    florida: {
                        total: 21480000,
                        jacksonville: {
                            total: 842583,
                            latitude: 30.3321838,
                            longitude: -81.65565099999999
                        },
                        miami: {
                            total: 417650,
                            latitude: 25.7616798,
                            longitude: -80.1917902
                        },
                        tampa: {
                            total: 352957,
                            latitude: 27.950575,
                            longitude: -82.4571776
                        },
                        orlando: {
                            total: 255483,
                            latitude: 28.5383355,
                            longitude: -81.3792365
                        },
                        stPetersburg: {
                            total: 249688,
                            latitude: 27.773056,
                            longitude: -82.64
                        },
                        hialeah: {
                            total: 233394,
                            latitude: 25.8575963,
                            longitude: -80.2781057
                        },
                        tallahassee: {
                            total: 186411,
                            latitude: 30.4382559,
                            longitude: -84.28073289999999
                        },
                        fortLauderdale: {
                            total: 172389,
                            latitude: 26.1224386,
                            longitude: -80.13731740000001
                        },
                        portStLucie: {
                            total: 171016,
                            latitude: 27.2730492,
                            longitude: -80.3582261
                        },
                        capeCoral: {
                            total: 165831,
                            latitude: 26.5628537,
                            longitude: -81.9495331
                        },
                        pembrokePines: {
                            total: 162329,
                            latitude: 26.007765,
                            longitude: -80.2962555
                        },
                        hollywood: {
                            total: 146526,
                            latitude: 26.0112014,
                            longitude: -80.1494901
                        },
                        miramar: {
                            total: 130288,
                            latitude: 25.9860762,
                            longitude: -80.30356019999999
                        },
                        gainesville: {
                            total: 127488,
                            latitude: 29.6516344,
                            longitude: -82.32482619999999
                        },
                        coralSprings: {
                            total: 126604,
                            latitude: 26.271192,
                            longitude: -80.2706044
                        },
                        miamiGardens: {
                            total: 111378,
                            latitude: 25.9420377,
                            longitude: -80.2456045
                        },
                        clearwater: {
                            total: 109703,
                            latitude: 27.9658533,
                            longitude: -82.8001026
                        },
                        palmBay: {
                            total: 104898,
                            latitude: 28.0344621,
                            longitude: -80.5886646
                        },
                        pompanoBeach: {
                            total: 104410,
                            latitude: 26.2378597,
                            longitude: -80.1247667
                        },
                        westPalmBeach: {
                            total: 102436,
                            latitude: 26.7153424,
                            longitude: -80.0533746
                        },
                        lakeland: {
                            total: 100710,
                            latitude: 28.0394654,
                            longitude: -81.9498042
                        },
                        davie: {
                            total: 96830,
                            latitude: 26.0764783,
                            longitude: -80.25211569999999
                        },
                        miamiBeach: {
                            total: 91026,
                            latitude: 25.790654,
                            longitude: -80.1300455
                        },
                        plantation: {
                            total: 90268,
                            latitude: 26.1275862,
                            longitude: -80.23310359999999
                        },
                        sunrise: {
                            total: 90116,
                            latitude: 26.1669711,
                            longitude: -80.25659499999999
                        },
                        bocaRaton: {
                            total: 89407,
                            latitude: 26.3683064,
                            longitude: -80.1289321
                        },
                        deltona: {
                            total: 86290,
                            latitude: 28.9005446,
                            longitude: -81.26367379999999
                        },
                        palmCoast: {
                            total: 78740,
                            latitude: 29.5844524,
                            longitude: -81.20786989999999
                        },
                        largo: {
                            total: 78409,
                            latitude: 27.9094665,
                            longitude: -82.7873244
                        },
                        deerfieldBeach: {
                            total: 78041,
                            latitude: 26.3184123,
                            longitude: -80.09976569999999
                        },
                        melbourne: {
                            total: 77508,
                            latitude: 28.0836269,
                            longitude: -80.60810889999999
                        },
                        boyntonBeach: {
                            total: 71097,
                            latitude: 26.5317866,
                            longitude: -80.0905465
                        },
                        lauderhill: {
                            total: 69813,
                            latitude: 26.1403635,
                            longitude: -80.2133808
                        },
                        weston: {
                            total: 68388,
                            latitude: 26.1003654,
                            longitude: -80.3997748
                        },
                        fortMyers: {
                            total: 68190,
                            latitude: 26.640628,
                            longitude: -81.8723084
                        },
                        kissimmee: {
                            total: 65173,
                            latitude: 28.2919557,
                            longitude: -81.40757099999999
                        },
                        homestead: {
                            total: 64079,
                            latitude: 25.4687224,
                            longitude: -80.4775569
                        },
                        delrayBeach: {
                            total: 64072,
                            latitude: 26.4614625,
                            longitude: -80.0728201
                        },
                        tamarac: {
                            total: 63155,
                            latitude: 26.2128609,
                            longitude: -80.2497707
                        },
                        daytonaBeach: {
                            total: 62316,
                            latitude: 29.2108147,
                            longitude: -81.0228331
                        },
                        northMiami: {
                            total: 61007,
                            latitude: 25.8900949,
                            longitude: -80.1867138
                        },
                        wellington: {
                            total: 60202,
                            latitude: 26.6617635,
                            longitude: -80.2683571
                        },
                        northPort: {
                            total: 59212,
                            latitude: 27.044224,
                            longitude: -82.2359254
                        },
                        jupiter: {
                            total: 58298,
                            latitude: 26.9342246,
                            longitude: -80.0942087
                        },
                        ocala: {
                            total: 57468,
                            latitude: 29.1871986,
                            longitude: -82.14009229999999
                        },
                        portOrange: {
                            total: 57203,
                            latitude: 29.1383165,
                            longitude: -80.9956105
                        },
                        coconutCreek: {
                            total: 56792,
                            latitude: 26.2517482,
                            longitude: -80.17893509999999
                        },
                        sanford: {
                            total: 56002,
                            latitude: 28.8028612,
                            longitude: -81.269453
                        },
                        margate: {
                            total: 55456,
                            latitude: 26.2445263,
                            longitude: -80.206436
                        },
                        sarasota: {
                            total: 53326,
                            latitude: 27.3364347,
                            longitude: -82.53065269999999
                        },
                        pensacola: {
                            total: 52703,
                            latitude: 30.42130899999999,
                            longitude: -87.2169149
                        },
                        bradenton: {
                            total: 51763,
                            latitude: 27.4989278,
                            longitude: -82.5748194
                        },
                        palmBeachGardens: {
                            total: 50699,
                            latitude: 26.8233946,
                            longitude: -80.13865469999999
                        },
                        doral: {
                            total: 50213,
                            latitude: 25.8195424,
                            longitude: -80.3553302
                        },
                        pinellasPark: {
                            total: 49998,
                            latitude: 27.8428025,
                            longitude: -82.6995443
                        },
                        coralGables: {
                            total: 49631,
                            latitude: 25.72149,
                            longitude: -80.2683838
                        },
                        bonitaSprings: {
                            total: 47547,
                            latitude: 26.339806,
                            longitude: -81.7786972
                        },
                        apopka: {
                            total: 45587,
                            latitude: 28.6934076,
                            longitude: -81.5322149
                        },
                        titusville: {
                            total: 44206,
                            latitude: 28.6122187,
                            longitude: -80.8075537
                        },
                        cutlerBay: {
                            total: 43328,
                            latitude: 25.5808323,
                            longitude: -80.34685929999999
                        },
                        oaklandPark: {
                            total: 43286,
                            latitude: 26.1723065,
                            longitude: -80.1319893
                        },
                        northMiamiBeach: {
                            total: 43250,
                            latitude: 25.9331488,
                            longitude: -80.1625463
                        },
                        fortPierce: {
                            total: 43074,
                            latitude: 27.4467056,
                            longitude: -80.3256056
                        },
                        northLauderdale: {
                            total: 42757,
                            latitude: 26.217305,
                            longitude: -80.2258811
                        },
                        altamonteSprings: {
                            total: 42150,
                            latitude: 28.6611089,
                            longitude: -81.3656242
                        },
                        stCloud: {
                            total: 40918,
                            latitude: 28.2489016,
                            longitude: -81.2811801
                        },
                        ocoee: {
                            total: 39172,
                            latitude: 28.5691677,
                            longitude: -81.5439619
                        },
                        greenacres: {
                            total: 38696,
                            latitude: 26.6276276,
                            longitude: -80.1353896
                        },
                        ormondBeach: {
                            total: 38661,
                            latitude: 29.2858129,
                            longitude: -81.0558894
                        },
                        hallandaleBeach: {
                            total: 38632,
                            latitude: 25.9812024,
                            longitude: -80.14837899999999
                        },
                        winterGarden: {
                            total: 37711,
                            latitude: 28.5652787,
                            longitude: -81.58618469999999
                        },
                        aventura: {
                            total: 37199,
                            latitude: 25.9564812,
                            longitude: -80.1392121
                        },
                        panamaCity: {
                            total: 36877,
                            latitude: 30.1588129,
                            longitude: -85.6602058
                        }
                    },
                    ohio: {
                        total: 11700000,
                        columbus: {
                            total: 822553,
                            latitude: 39.9611755,
                            longitude: -82.99879419999999
                        },
                        cleveland: {
                            total: 390113,
                            latitude: 41.49932,
                            longitude: -81.6943605
                        },
                        cincinnati: {
                            total: 297517,
                            latitude: 39.1031182,
                            longitude: -84.5120196
                        },
                        toledo: {
                            total: 282313,
                            latitude: 41.6639383,
                            longitude: -83.55521200000001
                        },
                        akron: {
                            total: 198100,
                            latitude: 41.0814447,
                            longitude: -81.51900529999999
                        },
                        dayton: {
                            total: 143355,
                            latitude: 39.7589478,
                            longitude: -84.1916069
                        },
                        parma: {
                            total: 80429,
                            latitude: 41.4047742,
                            longitude: -81.7229086
                        },
                        canton: {
                            total: 72535,
                            latitude: 40.79894729999999,
                            longitude: -81.378447
                        },
                        youngstown: {
                            total: 65184,
                            latitude: 41.0997803,
                            longitude: -80.6495194
                        },
                        lorain: {
                            total: 63710,
                            latitude: 41.452819,
                            longitude: -82.1823746
                        },
                        hamilton: {
                            total: 62258,
                            latitude: 39.3995008,
                            longitude: -84.5613355
                        },
                        springfield: {
                            total: 59357,
                            latitude: 39.9242266,
                            longitude: -83.8088171
                        },
                        kettering: {
                            total: 55870,
                            latitude: 39.68950359999999,
                            longitude: -84.1688274
                        },
                        elyria: {
                            total: 53956,
                            latitude: 41.3683798,
                            longitude: -82.10764859999999
                        },
                        lakewood: {
                            total: 51143,
                            latitude: 41.4819932,
                            longitude: -81.7981908
                        },
                        cuyahogaFalls: {
                            total: 49267,
                            latitude: 41.1339449,
                            longitude: -81.48455849999999
                        },
                        middletown: {
                            total: 48630,
                            latitude: 39.5150576,
                            longitude: -84.39827629999999
                        },
                        euclid: {
                            total: 48139,
                            latitude: 41.5931049,
                            longitude: -81.5267873
                        },
                        newark: {
                            total: 47777,
                            latitude: 40.0581205,
                            longitude: -82.4012642
                        },
                        mentor: {
                            total: 46979,
                            latitude: 41.6661573,
                            longitude: -81.339552
                        },
                        mansfield: {
                            total: 46454,
                            latitude: 40.75839,
                            longitude: -82.5154471
                        },
                        beavercreek: {
                            total: 45712,
                            latitude: 39.7092262,
                            longitude: -84.06326849999999
                        },
                        clevelandHeights: {
                            total: 45394,
                            latitude: 41.5200518,
                            longitude: -81.556235
                        },
                        strongsville: {
                            total: 44730,
                            latitude: 41.3144966,
                            longitude: -81.83569
                        },
                        dublin: {
                            total: 43607,
                            latitude: 40.0992294,
                            longitude: -83.1140771
                        },
                        fairfield: {
                            total: 42635,
                            latitude: 39.3454673,
                            longitude: -84.5603187
                        },
                        findlay: {
                            total: 41512,
                            latitude: 41.04422,
                            longitude: -83.6499321
                        },
                        warren: {
                            total: 40768,
                            latitude: 41.2375569,
                            longitude: -80.81841659999999
                        },
                        lancaster: {
                            total: 39325,
                            latitude: 39.7136754,
                            longitude: -82.5993294
                        },
                        lima: {
                            total: 38355,
                            latitude: 40.742551,
                            longitude: -84.1052256
                        },
                        huberHeights: {
                            total: 38142,
                            latitude: 39.843947,
                            longitude: -84.12466080000002
                        },
                        westerville: {
                            total: 37530,
                            latitude: 40.1261743,
                            longitude: -82.92906959999999
                        },
                        groveCity: {
                            total: 37490,
                            latitude: 39.88145189999999,
                            longitude: -83.0929644
                        }
                    },
                    northCarolina: {
                        total: 10500000,
                        charlotte: {
                            total: 792862,
                            latitude: 35.2270869,
                            longitude: -80.8431267
                        },
                        raleigh: {
                            total: 431746,
                            latitude: 35.7795897,
                            longitude: -78.6381787
                        },
                        greensboro: {
                            total: 279639,
                            latitude: 36.0726354,
                            longitude: -79.7919754
                        },
                        durham: {
                            total: 245475,
                            latitude: 35.9940329,
                            longitude: -78.898619
                        },
                        winstonSalem: {
                            total: 236441,
                            latitude: 36.09985959999999,
                            longitude: -80.244216
                        },
                        fayetteville: {
                            total: 204408,
                            latitude: 35.0526641,
                            longitude: -78.87835849999999
                        },
                        cary: {
                            total: 151088,
                            latitude: 35.79154,
                            longitude: -78.7811169
                        },
                        wilmington: {
                            total: 112067,
                            latitude: 34.2257255,
                            longitude: -77.9447102
                        },
                        highPoint: {
                            total: 107741,
                            latitude: 35.9556923,
                            longitude: -80.0053176
                        },
                        greenville: {
                            total: 89130,
                            latitude: 35.612661,
                            longitude: -77.3663538
                        },
                        asheville: {
                            total: 87236,
                            latitude: 35.5950581,
                            longitude: -82.5514869
                        },
                        concord: {
                            total: 83506,
                            latitude: 35.4087517,
                            longitude: -80.579511
                        },
                        gastonia: {
                            total: 73209,
                            latitude: 35.262082,
                            longitude: -81.18730049999999
                        },
                        jacksonville: {
                            total: 69079,
                            latitude: 34.7540524,
                            longitude: -77.4302414
                        },
                        chapelHill: {
                            total: 59635,
                            latitude: 35.9131996,
                            longitude: -79.0558445
                        },
                        rockyMount: {
                            total: 56954,
                            latitude: 35.9382103,
                            longitude: -77.7905339
                        },
                        burlington: {
                            total: 51510,
                            latitude: 36.0956918,
                            longitude: -79.43779909999999
                        },
                        huntersville: {
                            total: 50458,
                            latitude: 35.410694,
                            longitude: -80.84285040000002
                        },
                        wilson: {
                            total: 49628,
                            latitude: 35.7212689,
                            longitude: -77.9155395
                        },
                        kannapolis: {
                            total: 44359,
                            latitude: 35.4873613,
                            longitude: -80.6217341
                        },
                        apex: {
                            total: 42214,
                            latitude: 35.732652,
                            longitude: -78.85028559999999
                        },
                        hickory: {
                            total: 40361,
                            latitude: 35.7344538,
                            longitude: -81.3444573
                        }
                    },
                    michigan: {
                        total: 9990000,
                        detroit: {
                            total: 688701,
                            latitude: 42.331427,
                            longitude: -83.0457538
                        },
                        grandRapids: {
                            total: 192294,
                            latitude: 42.9633599,
                            longitude: -85.6680863
                        },
                        warren: {
                            total: 134873,
                            latitude: 42.5144566,
                            longitude: -83.01465259999999
                        },
                        sterlingHeights: {
                            total: 131224,
                            latitude: 42.5803122,
                            longitude: -83.0302033
                        },
                        annArbor: {
                            total: 117025,
                            latitude: 42.2808256,
                            longitude: -83.7430378
                        },
                        lansing: {
                            total: 113972,
                            latitude: 42.732535,
                            longitude: -84.5555347
                        },
                        flint: {
                            total: 99763,
                            latitude: 43.0125274,
                            longitude: -83.6874562
                        },
                        dearborn: {
                            total: 95884,
                            latitude: 42.3222599,
                            longitude: -83.17631449999999
                        },
                        livonia: {
                            total: 95208,
                            latitude: 42.36837,
                            longitude: -83.35270969999999
                        },
                        troy: {
                            total: 82821,
                            latitude: 42.6064095,
                            longitude: -83.1497751
                        },
                        westland: {
                            total: 82578,
                            latitude: 42.32420399999999,
                            longitude: -83.400211
                        },
                        farmingtonHills: {
                            total: 81295,
                            latitude: 42.4989936,
                            longitude: -83.3677168
                        },
                        kalamazoo: {
                            total: 75548,
                            latitude: 42.2917069,
                            longitude: -85.5872286
                        },
                        wyoming: {
                            total: 74100,
                            latitude: 42.9133602,
                            longitude: -85.7053085
                        },
                        southfield: {
                            total: 73006,
                            latitude: 42.4733688,
                            longitude: -83.2218731
                        },
                        rochesterHills: {
                            total: 72952,
                            latitude: 42.65836609999999,
                            longitude: -83.1499322
                        },
                        taylor: {
                            total: 61817,
                            latitude: 42.240872,
                            longitude: -83.2696509
                        },
                        stClairShores: {
                            total: 60070,
                            latitude: 42.4974085,
                            longitude: -82.89636039999999
                        },
                        pontiac: {
                            total: 59887,
                            latitude: 42.6389216,
                            longitude: -83.29104679999999
                        },
                        royalOak: {
                            total: 58946,
                            latitude: 42.4894801,
                            longitude: -83.1446485
                        },
                        novi: {
                            total: 57960,
                            latitude: 42.48059,
                            longitude: -83.4754913
                        },
                        dearbornHeights: {
                            total: 56620,
                            latitude: 42.3369816,
                            longitude: -83.27326269999999
                        },
                        battleCreek: {
                            total: 51848,
                            latitude: 42.3211522,
                            longitude: -85.17971419999999
                        },
                        saginaw: {
                            total: 50303,
                            latitude: 43.4194699,
                            longitude: -83.9508068
                        },
                        kentwood: {
                            total: 50233,
                            latitude: 42.8694731,
                            longitude: -85.64474919999999
                        },
                        eastLansing: {
                            total: 48554,
                            latitude: 42.7369792,
                            longitude: -84.48386540000001
                        },
                        roseville: {
                            total: 47555,
                            latitude: 42.4972583,
                            longitude: -82.9371409
                        },
                        portage: {
                            total: 47523,
                            latitude: 42.2011538,
                            longitude: -85.5800022
                        },
                        midland: {
                            total: 42181,
                            latitude: 43.6155825,
                            longitude: -84.2472116
                        },
                        lincolnPark: {
                            total: 37313,
                            latitude: 42.2505943,
                            longitude: -83.1785361
                        },
                        muskegon: {
                            total: 37213,
                            latitude: 43.2341813,
                            longitude: -86.24839209999999
                        }
                    },
                    tennessee: {
                        total: 6800000,
                        memphis: {
                            total: 653450,
                            latitude: 35.1495343,
                            longitude: -90.0489801
                        },
                        nashvilleDavidson: {
                            total: 634464,
                            latitude: 36.1626638,
                            longitude: -86.7816016
                        },
                        knoxville: {
                            total: 183270,
                            latitude: 35.9606384,
                            longitude: -83.9207392
                        },
                        chattanooga: {
                            total: 173366,
                            latitude: 35.0456297,
                            longitude: -85.3096801
                        },
                        clarksville: {
                            total: 142357,
                            latitude: 36.5297706,
                            longitude: -87.3594528
                        },
                        murfreesboro: {
                            total: 117044,
                            latitude: 35.8456213,
                            longitude: -86.39027
                        },
                        franklin: {
                            total: 68886,
                            latitude: 35.9250637,
                            longitude: -86.8688899
                        },
                        jackson: {
                            total: 67685,
                            latitude: 35.6145169,
                            longitude: -88.81394689999999
                        },
                        johnsonCity: {
                            total: 65123,
                            latitude: 36.3134397,
                            longitude: -82.3534727
                        },
                        bartlett: {
                            total: 58226,
                            latitude: 35.2045328,
                            longitude: -89.8739753
                        },
                        hendersonville: {
                            total: 54068,
                            latitude: 36.3047735,
                            longitude: -86.6199957
                        },
                        kingsport: {
                            total: 52962,
                            latitude: 36.548434,
                            longitude: -82.5618186
                        },
                        collierville: {
                            total: 47333,
                            latitude: 35.042036,
                            longitude: -89.6645266
                        },
                        smyrna: {
                            total: 43060,
                            latitude: 35.9828412,
                            longitude: -86.5186045
                        },
                        cleveland: {
                            total: 42774,
                            latitude: 35.1595182,
                            longitude: -84.8766115
                        },
                        brentwood: {
                            total: 40021,
                            latitude: 36.0331164,
                            longitude: -86.78277720000001
                        },
                        germantown: {
                            total: 39375,
                            latitude: 35.0867577,
                            longitude: -89.8100858
                        }
                    },
                    washington: {
                        total: 7600000,
                        seattle: {
                            total: 652405,
                            latitude: 47.6062095,
                            longitude: -122.3320708
                        },
                        spokane: {
                            total: 210721,
                            latitude: 47.6587802,
                            longitude: -117.4260466
                        },
                        tacoma: {
                            total: 203446,
                            latitude: 47.2528768,
                            longitude: -122.4442906
                        },
                        vancouver: {
                            total: 167405,
                            latitude: 45.6387281,
                            longitude: -122.6614861
                        },
                        bellevue: {
                            total: 133992,
                            latitude: 47.610377,
                            longitude: -122.2006786
                        },
                        kent: {
                            total: 124435,
                            latitude: 47.3809335,
                            longitude: -122.2348431
                        },
                        everett: {
                            total: 105370,
                            latitude: 47.9789848,
                            longitude: -122.2020794
                        },
                        renton: {
                            total: 97003,
                            latitude: 47.48287759999999,
                            longitude: -122.2170661
                        },
                        yakima: {
                            total: 93257,
                            latitude: 46.6020711,
                            longitude: -120.5058987
                        },
                        federalWay: {
                            total: 92734,
                            latitude: 47.3223221,
                            longitude: -122.3126222
                        },
                        spokaneValley: {
                            total: 91113,
                            latitude: 47.6732281,
                            longitude: -117.2393748
                        },
                        kirkland: {
                            total: 84430,
                            latitude: 47.6814875,
                            longitude: -122.2087353
                        },
                        bellingham: {
                            total: 82631,
                            latitude: 48.74908,
                            longitude: -122.4781473
                        },
                        kennewick: {
                            total: 76762,
                            latitude: 46.2112458,
                            longitude: -119.1372338
                        },
                        auburn: {
                            total: 74860,
                            latitude: 47.30732279999999,
                            longitude: -122.2284532
                        },
                        pasco: {
                            total: 67599,
                            latitude: 46.2395793,
                            longitude: -119.1005657
                        },
                        marysville: {
                            total: 63269,
                            latitude: 48.0517637,
                            longitude: -122.1770818
                        },
                        lakewood: {
                            total: 59097,
                            latitude: 47.1717649,
                            longitude: -122.518458
                        },
                        redmond: {
                            total: 57530,
                            latitude: 47.6739881,
                            longitude: -122.121512
                        },
                        shoreline: {
                            total: 54790,
                            latitude: 47.7556531,
                            longitude: -122.3415178
                        },
                        richland: {
                            total: 52413,
                            latitude: 46.2856907,
                            longitude: -119.2844621
                        },
                        sammamish: {
                            total: 50169,
                            latitude: 47.61626829999999,
                            longitude: -122.0355736
                        },
                        burien: {
                            total: 49858,
                            latitude: 47.4703767,
                            longitude: -122.3467918
                        },
                        olympia: {
                            total: 48338,
                            latitude: 47.0378741,
                            longitude: -122.9006951
                        },
                        lacey: {
                            total: 44919,
                            latitude: 47.03426289999999,
                            longitude: -122.8231915
                        },
                        edmonds: {
                            total: 40727,
                            latitude: 47.8106521,
                            longitude: -122.3773552
                        },
                        bremerton: {
                            total: 39056,
                            latitude: 47.5673202,
                            longitude: -122.6329356
                        },
                        puyallup: {
                            total: 38609,
                            latitude: 47.1853785,
                            longitude: -122.2928974
                        }
                    },
                    colorado: {
                        total: 5800000,
                        denver: {
                            total: 649495,
                            latitude: 39.7392358,
                            longitude: -104.990251
                        },
                        coloradoSprings: {
                            total: 439886,
                            latitude: 38.8338816,
                            longitude: -104.8213634
                        },
                        aurora: {
                            total: 345803,
                            latitude: 39.7294319,
                            longitude: -104.8319195
                        },
                        fortCollins: {
                            total: 152061,
                            latitude: 40.5852602,
                            longitude: -105.084423
                        },
                        lakewood: {
                            total: 147214,
                            latitude: 39.7047095,
                            longitude: -105.0813734
                        },
                        thornton: {
                            total: 127359,
                            latitude: 39.8680412,
                            longitude: -104.9719243
                        },
                        arvada: {
                            total: 111707,
                            latitude: 39.8027644,
                            longitude: -105.0874842
                        },
                        westminster: {
                            total: 110945,
                            latitude: 39.8366528,
                            longitude: -105.0372046
                        },
                        pueblo: {
                            total: 108249,
                            latitude: 38.2544472,
                            longitude: -104.6091409
                        },
                        centennial: {
                            total: 106114,
                            latitude: 39.5807452,
                            longitude: -104.8771726
                        },
                        boulder: {
                            total: 103166,
                            latitude: 40.0149856,
                            longitude: -105.2705456
                        },
                        greeley: {
                            total: 96539,
                            latitude: 40.4233142,
                            longitude: -104.7091322
                        },
                        longmont: {
                            total: 89919,
                            latitude: 40.1672068,
                            longitude: -105.1019275
                        },
                        loveland: {
                            total: 71334,
                            latitude: 40.3977612,
                            longitude: -105.0749801
                        },
                        grandJunction: {
                            total: 59778,
                            latitude: 39.0638705,
                            longitude: -108.5506486
                        },
                        broomfield: {
                            total: 59471,
                            latitude: 39.9205411,
                            longitude: -105.0866504
                        },
                        castleRock: {
                            total: 53063,
                            latitude: 39.3722121,
                            longitude: -104.8560902
                        },
                        commerceCity: {
                            total: 49799,
                            latitude: 39.8083196,
                            longitude: -104.9338675
                        },
                        parker: {
                            total: 48608,
                            latitude: 39.5186002,
                            longitude: -104.7613633
                        },
                        littleton: {
                            total: 44275,
                            latitude: 39.613321,
                            longitude: -105.0166498
                        },
                        northglenn: {
                            total: 37499,
                            latitude: 39.8961821,
                            longitude: -104.9811468
                        }
                    },
                    districtOfColumbia: {
                        total: 646449,
                        washington: {
                            total: 646449,
                            latitude: 38.9071923,
                            longitude: -77.0368707
                        }
                    },
                    massachusetts: {
                        total: 6900000,
                        boston: {
                            total: 645966,
                            latitude: 42.3600825,
                            longitude: -71.0588801
                        },
                        worcester: {
                            total: 182544,
                            latitude: 42.2625932,
                            longitude: -71.8022934
                        },
                        springfield: {
                            total: 153703,
                            latitude: 42.1014831,
                            longitude: -72.589811
                        },
                        lowell: {
                            total: 108861,
                            latitude: 42.6334247,
                            longitude: -71.31617179999999
                        },
                        cambridge: {
                            total: 107289,
                            latitude: 42.3736158,
                            longitude: -71.10973349999999
                        },
                        newBedford: {
                            total: 95078,
                            latitude: 41.6362152,
                            longitude: -70.93420499999999
                        },
                        brockton: {
                            total: 94089,
                            latitude: 42.0834335,
                            longitude: -71.0183787
                        },
                        quincy: {
                            total: 93494,
                            latitude: 42.2528772,
                            longitude: -71.0022705
                        },
                        lynn: {
                            total: 91589,
                            latitude: 42.46676300000001,
                            longitude: -70.9494938
                        },
                        fallRiver: {
                            total: 88697,
                            latitude: 41.7014912,
                            longitude: -71.1550451
                        },
                        newton: {
                            total: 87971,
                            latitude: 42.3370413,
                            longitude: -71.20922139999999
                        },
                        somerville: {
                            total: 78804,
                            latitude: 42.3875968,
                            longitude: -71.0994968
                        },
                        lawrence: {
                            total: 77657,
                            latitude: 42.7070354,
                            longitude: -71.1631137
                        },
                        waltham: {
                            total: 62227,
                            latitude: 42.3764852,
                            longitude: -71.2356113
                        },
                        haverhill: {
                            total: 62088,
                            latitude: 42.7762015,
                            longitude: -71.0772796
                        },
                        malden: {
                            total: 60509,
                            latitude: 42.4250964,
                            longitude: -71.066163
                        },
                        medford: {
                            total: 57170,
                            latitude: 42.4184296,
                            longitude: -71.1061639
                        },
                        taunton: {
                            total: 56069,
                            latitude: 41.900101,
                            longitude: -71.0897674
                        },
                        chicopee: {
                            total: 55717,
                            latitude: 42.1487043,
                            longitude: -72.6078672
                        },
                        weymouthTown: {
                            total: 55419,
                            latitude: 42.2180724,
                            longitude: -70.94103559999999
                        },
                        revere: {
                            total: 53756,
                            latitude: 42.4084302,
                            longitude: -71.0119948
                        },
                        peabody: {
                            total: 52044,
                            latitude: 42.5278731,
                            longitude: -70.9286609
                        },
                        methuen: {
                            total: 48514,
                            latitude: 42.7262016,
                            longitude: -71.1908924
                        },
                        barnstableTown: {
                            total: 44641,
                            latitude: 41.7003208,
                            longitude: -70.3002024
                        },
                        pittsfield: {
                            total: 44057,
                            latitude: 42.4500845,
                            longitude: -73.2453824
                        },
                        attleboro: {
                            total: 43886,
                            latitude: 41.94454409999999,
                            longitude: -71.2856082
                        },
                        everett: {
                            total: 42935,
                            latitude: 42.40843,
                            longitude: -71.0536625
                        },
                        salem: {
                            total: 42544,
                            latitude: 42.51954,
                            longitude: -70.8967155
                        },
                        westfield: {
                            total: 41301,
                            latitude: 42.1250929,
                            longitude: -72.749538
                        },
                        leominster: {
                            total: 41002,
                            latitude: 42.5250906,
                            longitude: -71.759794
                        },
                        beverly: {
                            total: 40664,
                            latitude: 42.5584283,
                            longitude: -70.880049
                        },
                        fitchburg: {
                            total: 40383,
                            latitude: 42.5834228,
                            longitude: -71.8022955
                        },
                        holyoke: {
                            total: 40249,
                            latitude: 42.2042586,
                            longitude: -72.6162009
                        },
                        marlborough: {
                            total: 39414,
                            latitude: 42.3459271,
                            longitude: -71.5522874
                        },
                        woburn: {
                            total: 39083,
                            latitude: 42.4792618,
                            longitude: -71.1522765
                        },
                        chelsea: {
                            total: 37670,
                            latitude: 42.3917638,
                            longitude: -71.0328284
                        }
                    },
                    maryland: {
                        total: 6000000,
                        baltimore: {
                            total: 622104,
                            latitude: 39.2903848,
                            longitude: -76.6121893
                        },
                        frederick: {
                            total: 66893,
                            latitude: 39.41426879999999,
                            longitude: -77.4105409
                        },
                        gaithersburg: {
                            total: 65690,
                            latitude: 39.1434406,
                            longitude: -77.2013705
                        },
                        rockville: {
                            total: 64072,
                            latitude: 39.0839973,
                            longitude: -77.1527578
                        },
                        bowie: {
                            total: 56759,
                            latitude: 39.0067768,
                            longitude: -76.77913649999999
                        },
                        hagerstown: {
                            total: 40612,
                            latitude: 39.6417629,
                            longitude: -77.71999319999999
                        },
                        annapolis: {
                            total: 38722,
                            latitude: 38.9784453,
                            longitude: -76.4921829
                        }
                    },
                    oklahoma: {
                        total: 4000000,
                        oklahomaCity: {
                            total: 610613,
                            latitude: 35.4675602,
                            longitude: -97.5164276
                        },
                        tulsa: {
                            total: 398121,
                            latitude: 36.1539816,
                            longitude: -95.99277500000001
                        },
                        norman: {
                            total: 118197,
                            latitude: 35.2225668,
                            longitude: -97.4394777
                        },
                        brokenArrow: {
                            total: 103500,
                            latitude: 36.060949,
                            longitude: -95.7974526
                        },
                        lawton: {
                            total: 97151,
                            latitude: 34.6035669,
                            longitude: -98.39592909999999
                        },
                        edmond: {
                            total: 87004,
                            latitude: 35.6528323,
                            longitude: -97.47809540000002
                        },
                        moore: {
                            total: 58414,
                            latitude: 35.3395079,
                            longitude: -97.48670279999999
                        },
                        midwestCity: {
                            total: 56756,
                            latitude: 35.4495065,
                            longitude: -97.3967019
                        },
                        enid: {
                            total: 50725,
                            latitude: 36.3955891,
                            longitude: -97.8783911
                        },
                        stillwater: {
                            total: 47186,
                            latitude: 36.1156071,
                            longitude: -97.0583681
                        },
                        muskogee: {
                            total: 38863,
                            latitude: 35.7478769,
                            longitude: -95.3696909
                        }
                    },
                    kentucky: {
                        total: 4500000,
                        louisvilleJeffersonCounty: {
                            total: 609893,
                            latitude: 38.2526647,
                            longitude: -85.7584557
                        },
                        lexingtonFayette: {
                            total: 308428,
                            latitude: 38.0405837,
                            longitude: -84.5037164
                        },
                        bowlingGreen: {
                            total: 61488,
                            latitude: 36.9685219,
                            longitude: -86.4808043
                        },
                        owensboro: {
                            total: 58416,
                            latitude: 37.7719074,
                            longitude: -87.1111676
                        },
                        covington: {
                            total: 40956,
                            latitude: 39.0836712,
                            longitude: -84.5085536
                        }
                    },
                    oregon: {
                        total: 4200000,
                        portland: {
                            total: 609456,
                            latitude: 45.5230622,
                            longitude: -122.6764816
                        },
                        salem: {
                            total: 160614,
                            latitude: 44.9428975,
                            longitude: -123.0350963
                        },
                        eugene: {
                            total: 159190,
                            latitude: 44.0520691,
                            longitude: -123.0867536
                        },
                        gresham: {
                            total: 109397,
                            latitude: 45.5001357,
                            longitude: -122.4302013
                        },
                        hillsboro: {
                            total: 97368,
                            latitude: 45.5228939,
                            longitude: -122.989827
                        },
                        beaverton: {
                            total: 93542,
                            latitude: 45.48706199999999,
                            longitude: -122.8037102
                        },
                        bend: {
                            total: 81236,
                            latitude: 44.0581728,
                            longitude: -121.3153096
                        },
                        medford: {
                            total: 77677,
                            latitude: 42.3265152,
                            longitude: -122.8755949
                        },
                        springfield: {
                            total: 60177,
                            latitude: 44.0462362,
                            longitude: -123.0220289
                        },
                        corvallis: {
                            total: 55298,
                            latitude: 44.5645659,
                            longitude: -123.2620435
                        },
                        albany: {
                            total: 51583,
                            latitude: 44.6365107,
                            longitude: -123.1059282
                        },
                        tigard: {
                            total: 50444,
                            latitude: 45.4312294,
                            longitude: -122.7714861
                        },
                        lakeOswego: {
                            total: 37610,
                            latitude: 45.42067489999999,
                            longitude: -122.6706498
                        },
                        keizer: {
                            total: 37064,
                            latitude: 44.9901194,
                            longitude: -123.0262077
                        }
                    },
                    nevada: {
                        total: 3100000,
                        lasVegas: {
                            total: 603488,
                            latitude: 36.1699412,
                            longitude: -115.1398296
                        },
                        henderson: {
                            total: 270811,
                            latitude: 36.0395247,
                            longitude: -114.9817213
                        },
                        reno: {
                            total: 233294,
                            latitude: 39.5296329,
                            longitude: -119.8138027
                        },
                        northLasVegas: {
                            total: 226877,
                            latitude: 36.1988592,
                            longitude: -115.1175013
                        },
                        sparks: {
                            total: 93282,
                            latitude: 39.5349112,
                            longitude: -119.7526886
                        },
                        carsonCity: {
                            total: 54080,
                            latitude: 39.1637984,
                            longitude: -119.7674034
                        }
                    },
                    wisconsin: {
                        total: 5800000,
                        milwaukee: {
                            total: 599164,
                            latitude: 43.0389025,
                            longitude: -87.9064736
                        },
                        madison: {
                            total: 243344,
                            latitude: 43.0730517,
                            longitude: -89.4012302
                        },
                        greenBay: {
                            total: 104779,
                            latitude: 44.51915899999999,
                            longitude: -88.019826
                        },
                        kenosha: {
                            total: 99889,
                            latitude: 42.5847425,
                            longitude: -87.82118539999999
                        },
                        racine: {
                            total: 78199,
                            latitude: 42.7261309,
                            longitude: -87.78285230000002
                        },
                        appleton: {
                            total: 73596,
                            latitude: 44.2619309,
                            longitude: -88.41538469999999
                        },
                        waukesha: {
                            total: 71016,
                            latitude: 43.0116784,
                            longitude: -88.2314813
                        },
                        eauClaire: {
                            total: 67545,
                            latitude: 44.811349,
                            longitude: -91.4984941
                        },
                        oshkosh: {
                            total: 66778,
                            latitude: 44.0247062,
                            longitude: -88.5426136
                        },
                        janesville: {
                            total: 63820,
                            latitude: 42.6827885,
                            longitude: -89.0187222
                        },
                        westAllis: {
                            total: 60697,
                            latitude: 43.0166806,
                            longitude: -88.0070315
                        },
                        laCrosse: {
                            total: 51522,
                            latitude: 43.8013556,
                            longitude: -91.23958069999999
                        },
                        sheboygan: {
                            total: 48725,
                            latitude: 43.7508284,
                            longitude: -87.71453
                        },
                        wauwatosa: {
                            total: 47134,
                            latitude: 43.0494572,
                            longitude: -88.0075875
                        },
                        fondDuLac: {
                            total: 42970,
                            latitude: 43.7730448,
                            longitude: -88.4470508
                        },
                        newBerlin: {
                            total: 39834,
                            latitude: 42.9764027,
                            longitude: -88.1084224
                        },
                        wausau: {
                            total: 39309,
                            latitude: 44.9591352,
                            longitude: -89.6301221
                        },
                        brookfield: {
                            total: 37999,
                            latitude: 43.0605671,
                            longitude: -88.1064787
                        },
                        greenfield: {
                            total: 37159,
                            latitude: 42.9614039,
                            longitude: -88.0125865
                        },
                        beloit: {
                            total: 36888,
                            latitude: 42.5083482,
                            longitude: -89.03177649999999
                        }
                    },
                    newMexico: {
                        total: 2100000,
                        albuquerque: {
                            total: 556495,
                            latitude: 35.0853336,
                            longitude: -106.6055534
                        },
                        lasCruces: {
                            total: 101324,
                            latitude: 32.3199396,
                            longitude: -106.7636538
                        },
                        rioRancho: {
                            total: 91956,
                            latitude: 35.2327544,
                            longitude: -106.6630437
                        },
                        santaFe: {
                            total: 69976,
                            latitude: 35.6869752,
                            longitude: -105.937799
                        },
                        roswell: {
                            total: 48611,
                            latitude: 33.3942655,
                            longitude: -104.5230242
                        },
                        farmington: {
                            total: 45426,
                            latitude: 36.72805830000001,
                            longitude: -108.2186856
                        },
                        clovis: {
                            total: 39508,
                            latitude: 34.4047987,
                            longitude: -103.2052272
                        }
                    },
                    missouri: {
                        total: 6100000,
                        kansasCity: {
                            total: 467007,
                            latitude: 39.0997265,
                            longitude: -94.5785667
                        },
                        stLouis: {
                            total: 318416,
                            latitude: 38.6270025,
                            longitude: -90.19940419999999
                        },
                        springfield: {
                            total: 164122,
                            latitude: 37.2089572,
                            longitude: -93.29229889999999
                        },
                        independence: {
                            total: 117240,
                            latitude: 39.0911161,
                            longitude: -94.41550679999999
                        },
                        columbia: {
                            total: 115276,
                            latitude: 38.9517053,
                            longitude: -92.3340724
                        },
                        leesSummit: {
                            total: 93184,
                            latitude: 38.9108408,
                            longitude: -94.3821724
                        },
                        oFallon: {
                            total: 82809,
                            latitude: 38.8106075,
                            longitude: -90.69984769999999
                        },
                        stJoseph: {
                            total: 77147,
                            latitude: 39.7674578,
                            longitude: -94.84668099999999
                        },
                        stCharles: {
                            total: 67569,
                            latitude: 38.7881062,
                            longitude: -90.4974359
                        },
                        stPeters: {
                            total: 54842,
                            latitude: 38.7874699,
                            longitude: -90.6298922
                        },
                        blueSprings: {
                            total: 53294,
                            latitude: 39.0169509,
                            longitude: -94.2816148
                        },
                        florissant: {
                            total: 52363,
                            latitude: 38.789217,
                            longitude: -90.322614
                        },
                        joplin: {
                            total: 50789,
                            latitude: 37.08422710000001,
                            longitude: -94.51328099999999
                        },
                        chesterfield: {
                            total: 47749,
                            latitude: 38.6631083,
                            longitude: -90.5770675
                        },
                        jeffersonCity: {
                            total: 43330,
                            latitude: 38.57670170000001,
                            longitude: -92.1735164
                        },
                        capeGirardeau: {
                            total: 38816,
                            latitude: 37.3058839,
                            longitude: -89.51814759999999
                        }
                    },
                    virginia: {
                        total: 8500000,
                        virginiaBeach: {
                            total: 448479,
                            latitude: 36.8529263,
                            longitude: -75.97798499999999
                        },
                        norfolk: {
                            total: 246139,
                            latitude: 36.8507689,
                            longitude: -76.28587259999999
                        },
                        chesapeake: {
                            total: 230571,
                            latitude: 36.7682088,
                            longitude: -76.2874927
                        },
                        richmond: {
                            total: 214114,
                            latitude: 37.5407246,
                            longitude: -77.4360481
                        },
                        newportNews: {
                            total: 182020,
                            latitude: 37.0870821,
                            longitude: -76.4730122
                        },
                        alexandria: {
                            total: 148892,
                            latitude: 38.8048355,
                            longitude: -77.0469214
                        },
                        hampton: {
                            total: 136699,
                            latitude: 37.0298687,
                            longitude: -76.34522179999999
                        },
                        roanoke: {
                            total: 98465,
                            latitude: 37.2709704,
                            longitude: -79.9414266
                        },
                        portsmouth: {
                            total: 96205,
                            latitude: 36.8354258,
                            longitude: -76.2982742
                        },
                        suffolk: {
                            total: 85728,
                            latitude: 36.7282054,
                            longitude: -76.5835621
                        },
                        lynchburg: {
                            total: 78014,
                            latitude: 37.4137536,
                            longitude: -79.14224639999999
                        },
                        harrisonburg: {
                            total: 51395,
                            latitude: 38.4495688,
                            longitude: -78.8689155
                        },
                        leesburg: {
                            total: 47673,
                            latitude: 39.1156615,
                            longitude: -77.56360149999999
                        },
                        charlottesville: {
                            total: 44349,
                            latitude: 38.0293059,
                            longitude: -78.47667810000002
                        },
                        blacksburg: {
                            total: 43609,
                            latitude: 37.2295733,
                            longitude: -80.4139393
                        },
                        danville: {
                            total: 42907,
                            latitude: 36.5859718,
                            longitude: -79.39502279999999
                        },
                        manassas: {
                            total: 41705,
                            latitude: 38.7509488,
                            longitude: -77.47526669999999
                        }
                    },
                    georgia: {
                        total: 10600000,
                        atlanta: {
                            total: 447841,
                            latitude: 33.7489954,
                            longitude: -84.3879824
                        },
                        columbus: {
                            total: 202824,
                            latitude: 32.4609764,
                            longitude: -84.9877094
                        },
                        augustaRichmondCounty: {
                            total: 197350,
                            latitude: 33.4734978,
                            longitude: -82.0105148
                        },
                        savannah: {
                            total: 142772,
                            latitude: 32.0835407,
                            longitude: -81.09983419999999
                        },
                        athensClarkeCounty: {
                            total: 119980,
                            latitude: 33.9519347,
                            longitude: -83.357567
                        },
                        sandySprings: {
                            total: 99770,
                            latitude: 33.9304352,
                            longitude: -84.3733147
                        },
                        roswell: {
                            total: 94034,
                            latitude: 34.0232431,
                            longitude: -84.3615555
                        },
                        macon: {
                            total: 89981,
                            latitude: 32.8406946,
                            longitude: -83.6324022
                        },
                        johnsCreek: {
                            total: 82788,
                            latitude: 34.0289259,
                            longitude: -84.198579
                        },
                        albany: {
                            total: 76185,
                            latitude: 31.5785074,
                            longitude: -84.15574099999999
                        },
                        warnerRobins: {
                            total: 72531,
                            latitude: 32.6130007,
                            longitude: -83.624201
                        },
                        alpharetta: {
                            total: 62298,
                            latitude: 34.0753762,
                            longitude: -84.2940899
                        },
                        marietta: {
                            total: 59089,
                            latitude: 33.95260200000001,
                            longitude: -84.5499327
                        },
                        valdosta: {
                            total: 56481,
                            latitude: 30.8327022,
                            longitude: -83.2784851
                        },
                        smyrna: {
                            total: 53438,
                            latitude: 33.8839926,
                            longitude: -84.51437609999999
                        },
                        brookhaven: {
                            total: 50603,
                            latitude: 33.8651033,
                            longitude: -84.3365917
                        },
                        dunwoody: {
                            total: 47591,
                            latitude: 33.9462125,
                            longitude: -84.3346473
                        },
                        peachtreeCorners: {
                            total: 40059,
                            latitude: 33.9698929,
                            longitude: -84.2214551
                        }
                    },
                    nebraska: {
                        total: 1900000,
                        omaha: {
                            total: 434353,
                            latitude: 41.2523634,
                            longitude: -95.99798829999999
                        },
                        lincoln: {
                            total: 268738,
                            latitude: 40.8257625,
                            longitude: -96.6851982
                        },
                        bellevue: {
                            total: 53663,
                            latitude: 41.1543623,
                            longitude: -95.9145568
                        },
                        grandIsland: {
                            total: 50550,
                            latitude: 40.9263957,
                            longitude: -98.3420118
                        }
                    },
                    minnesota: {
                        total: 5700000,
                        minneapolis: {
                            total: 400070,
                            latitude: 44.977753,
                            longitude: -93.2650108
                        },
                        stPaul: {
                            total: 294873,
                            latitude: 44.9537029,
                            longitude: -93.0899578
                        },
                        rochester: {
                            total: 110742,
                            latitude: 44.0121221,
                            longitude: -92.4801989
                        },
                        bloomington: {
                            total: 86319,
                            latitude: 44.840798,
                            longitude: -93.2982799
                        },
                        duluth: {
                            total: 86128,
                            latitude: 46.78667189999999,
                            longitude: -92.1004852
                        },
                        brooklynPark: {
                            total: 78373,
                            latitude: 45.0941315,
                            longitude: -93.3563405
                        },
                        plymouth: {
                            total: 73987,
                            latitude: 45.0105194,
                            longitude: -93.4555093
                        },
                        stCloud: {
                            total: 66297,
                            latitude: 45.5579451,
                            longitude: -94.16324039999999
                        },
                        woodbury: {
                            total: 65656,
                            latitude: 44.9238552,
                            longitude: -92.9593797
                        },
                        eagan: {
                            total: 65453,
                            latitude: 44.8041322,
                            longitude: -93.1668858
                        },
                        mapleGrove: {
                            total: 65415,
                            latitude: 45.0724642,
                            longitude: -93.4557877
                        },
                        edenPrairie: {
                            total: 62603,
                            latitude: 44.8546856,
                            longitude: -93.47078599999999
                        },
                        coonRapids: {
                            total: 62103,
                            latitude: 45.1732394,
                            longitude: -93.30300629999999
                        },
                        burnsville: {
                            total: 61434,
                            latitude: 44.7677424,
                            longitude: -93.27772259999999
                        },
                        blaine: {
                            total: 60407,
                            latitude: 45.1607987,
                            longitude: -93.23494889999999
                        },
                        lakeville: {
                            total: 58562,
                            latitude: 44.6496868,
                            longitude: -93.24271999999999
                        },
                        minnetonka: {
                            total: 51368,
                            latitude: 44.9211836,
                            longitude: -93.4687489
                        },
                        appleValley: {
                            total: 50201,
                            latitude: 44.7319094,
                            longitude: -93.21772000000001
                        },
                        edina: {
                            total: 49376,
                            latitude: 44.8896866,
                            longitude: -93.3499489
                        },
                        stLouisPark: {
                            total: 47411,
                            latitude: 44.9597376,
                            longitude: -93.3702186
                        },
                        mankato: {
                            total: 40641,
                            latitude: 44.1635775,
                            longitude: -93.99939959999999
                        },
                        maplewood: {
                            total: 39765,
                            latitude: 44.9530215,
                            longitude: -92.9952153
                        },
                        moorhead: {
                            total: 39398,
                            latitude: 46.8737648,
                            longitude: -96.76780389999999
                        },
                        shakopee: {
                            total: 39167,
                            latitude: 44.7973962,
                            longitude: -93.5272861
                        }
                    },
                    kansas: {
                        total: 2900000,
                        wichita: {
                            total: 386552,
                            latitude: 37.688889,
                            longitude: -97.336111
                        },
                        overlandPark: {
                            total: 181260,
                            latitude: 38.9822282,
                            longitude: -94.6707917
                        },
                        kansasCity: {
                            total: 148483,
                            latitude: 39.114053,
                            longitude: -94.6274636
                        },
                        olathe: {
                            total: 131885,
                            latitude: 38.8813958,
                            longitude: -94.81912849999999
                        },
                        topeka: {
                            total: 127679,
                            latitude: 39.0558235,
                            longitude: -95.68901849999999
                        },
                        lawrence: {
                            total: 90811,
                            latitude: 38.9716689,
                            longitude: -95.2352501
                        },
                        shawnee: {
                            total: 64323,
                            latitude: 39.02284849999999,
                            longitude: -94.7151865
                        },
                        manhattan: {
                            total: 56143,
                            latitude: 39.18360819999999,
                            longitude: -96.57166939999999
                        },
                        lenexa: {
                            total: 50344,
                            latitude: 38.9536174,
                            longitude: -94.73357089999999
                        },
                        salina: {
                            total: 47846,
                            latitude: 38.8402805,
                            longitude: -97.61142369999999
                        },
                        hutchinson: {
                            total: 41889,
                            latitude: 38.0608445,
                            longitude: -97.92977429999999
                        }
                    },
                    louisiana: {
                        total: 4600000,
                        newOrleans: {
                            total: 378715,
                            latitude: 29.95106579999999,
                            longitude: -90.0715323
                        },
                        batonRouge: {
                            total: 229426,
                            latitude: 30.4582829,
                            longitude: -91.1403196
                        },
                        shreveport: {
                            total: 200327,
                            latitude: 32.5251516,
                            longitude: -93.7501789
                        },
                        lafayette: {
                            total: 124276,
                            latitude: 30.2240897,
                            longitude: -92.0198427
                        },
                        lakeCharles: {
                            total: 74024,
                            latitude: 30.2265949,
                            longitude: -93.2173758
                        },
                        kenner: {
                            total: 66975,
                            latitude: 29.9940924,
                            longitude: -90.2417434
                        },
                        bossierCity: {
                            total: 66333,
                            latitude: 32.5159852,
                            longitude: -93.7321228
                        },
                        monroe: {
                            total: 49761,
                            latitude: 32.5093109,
                            longitude: -92.1193012
                        },
                        alexandria: {
                            total: 48426,
                            latitude: 31.3112936,
                            longitude: -92.4451371
                        }
                    },
                    hawaii: {
                        total: 1400000,
                        honolulu: {
                            total: 347884,
                            latitude: 21.3069444,
                            longitude: -157.8583333
                        }
                    },
                    alaska: {
                        total: 730000,
                        anchorage: {
                            total: 300950,
                            latitude: 61.2180556,
                            longitude: -149.9002778
                        }
                    },
                    newJersey: {
                        total: 8880000,
                        newark: {
                            total: 278427,
                            latitude: 40.735657,
                            longitude: -74.1723667
                        },
                        jerseyCity: {
                            total: 257342,
                            latitude: 40.72815749999999,
                            longitude: -74.0776417
                        },
                        paterson: {
                            total: 145948,
                            latitude: 40.9167654,
                            longitude: -74.17181099999999
                        },
                        elizabeth: {
                            total: 127558,
                            latitude: 40.6639916,
                            longitude: -74.2107006
                        },
                        clifton: {
                            total: 85390,
                            latitude: 40.8584328,
                            longitude: -74.16375529999999
                        },
                        trenton: {
                            total: 84349,
                            latitude: 40.2170534,
                            longitude: -74.7429384
                        },
                        camden: {
                            total: 76903,
                            latitude: 39.9259463,
                            longitude: -75.1196199
                        },
                        passaic: {
                            total: 70868,
                            latitude: 40.8567662,
                            longitude: -74.1284764
                        },
                        unionCity: {
                            total: 68247,
                            latitude: 40.6975898,
                            longitude: -74.26316349999999
                        },
                        bayonne: {
                            total: 65028,
                            latitude: 40.6687141,
                            longitude: -74.1143091
                        },
                        eastOrange: {
                            total: 64544,
                            latitude: 40.767323,
                            longitude: -74.2048677
                        },
                        vineland: {
                            total: 61050,
                            latitude: 39.4863773,
                            longitude: -75.02596369999999
                        },
                        newBrunswick: {
                            total: 55831,
                            latitude: 40.4862157,
                            longitude: -74.4518188
                        },
                        hoboken: {
                            total: 52575,
                            latitude: 40.7439905,
                            longitude: -74.0323626
                        },
                        westNewYork: {
                            total: 52122,
                            latitude: 40.7878788,
                            longitude: -74.0143064
                        },
                        perthAmboy: {
                            total: 51982,
                            latitude: 40.5067723,
                            longitude: -74.2654234
                        },
                        plainfield: {
                            total: 50588,
                            latitude: 40.6337136,
                            longitude: -74.4073736
                        },
                        sayreville: {
                            total: 44412,
                            latitude: 40.45940210000001,
                            longitude: -74.360846
                        },
                        hackensack: {
                            total: 44113,
                            latitude: 40.8859325,
                            longitude: -74.0434736
                        },
                        kearny: {
                            total: 41664,
                            latitude: 40.7684342,
                            longitude: -74.1454214
                        },
                        linden: {
                            total: 41301,
                            latitude: 40.6220478,
                            longitude: -74.24459019999999
                        },
                        atlanticCity: {
                            total: 39551,
                            latitude: 39.3642834,
                            longitude: -74.4229266
                        }
                    },
                    idaho: {
                        total: 1800000,
                        boiseCity: {
                            total: 214237,
                            latitude: 43.6187102,
                            longitude: -116.2146068
                        },
                        nampa: {
                            total: 86518,
                            latitude: 43.5407172,
                            longitude: -116.5634624
                        },
                        meridian: {
                            total: 83596,
                            latitude: 43.6121087,
                            longitude: -116.3915131
                        },
                        idahoFalls: {
                            total: 58292,
                            latitude: 43.49165139999999,
                            longitude: -112.0339645
                        },
                        pocatello: {
                            total: 54350,
                            latitude: 42.8713032,
                            longitude: -112.4455344
                        },
                        caldwell: {
                            total: 48957,
                            latitude: 43.66293839999999,
                            longitude: -116.6873596
                        },
                        coeurDalene: {
                            total: 46402,
                            latitude: 47.6776832,
                            longitude: -116.7804664
                        },
                        twinFalls: {
                            total: 45981,
                            latitude: 42.5629668,
                            longitude: -114.4608711
                        }
                    },
                    iowa: {
                        total: 3200000,
                        desMoines: {
                            total: 207510,
                            latitude: 41.6005448,
                            longitude: -93.6091064
                        },
                        cedarRapids: {
                            total: 128429,
                            latitude: 41.9778795,
                            longitude: -91.6656232
                        },
                        davenport: {
                            total: 102157,
                            latitude: 41.5236437,
                            longitude: -90.5776367
                        },
                        siouxCity: {
                            total: 82459,
                            latitude: 42.4999942,
                            longitude: -96.40030689999999
                        },
                        iowaCity: {
                            total: 71591,
                            latitude: 41.6611277,
                            longitude: -91.5301683
                        },
                        waterloo: {
                            total: 68366,
                            latitude: 42.492786,
                            longitude: -92.34257749999999
                        },
                        councilBluffs: {
                            total: 61969,
                            latitude: 41.2619444,
                            longitude: -95.8608333
                        },
                        ames: {
                            total: 61792,
                            latitude: 42.034722,
                            longitude: -93.61999999999999
                        },
                        westDesMoines: {
                            total: 61255,
                            latitude: 41.5772115,
                            longitude: -93.711332
                        },
                        dubuque: {
                            total: 58253,
                            latitude: 42.5005583,
                            longitude: -90.66457179999999
                        },
                        ankeny: {
                            total: 51567,
                            latitude: 41.7317884,
                            longitude: -93.6001278
                        },
                        urbandale: {
                            total: 41776,
                            latitude: 41.6266555,
                            longitude: -93.71216559999999
                        },
                        cedarFalls: {
                            total: 40566,
                            latitude: 42.5348993,
                            longitude: -92.4453161
                        }
                    },
                    arkansas: {
                        total: 3000000,
                        littleRock: {
                            total: 197357,
                            latitude: 34.7464809,
                            longitude: -92.28959479999999
                        },
                        fortSmith: {
                            total: 87650,
                            latitude: 35.3859242,
                            longitude: -94.39854749999999
                        },
                        fayetteville: {
                            total: 78960,
                            latitude: 36.0625795,
                            longitude: -94.1574263
                        },
                        springdale: {
                            total: 75229,
                            latitude: 36.18674420000001,
                            longitude: -94.1288141
                        },
                        jonesboro: {
                            total: 71551,
                            latitude: 35.84229670000001,
                            longitude: -90.704279
                        },
                        northLittleRock: {
                            total: 66075,
                            latitude: 34.769536,
                            longitude: -92.2670941
                        },
                        conway: {
                            total: 63816,
                            latitude: 35.0886963,
                            longitude: -92.4421011
                        },
                        rogers: {
                            total: 60112,
                            latitude: 36.3320196,
                            longitude: -94.1185366
                        },
                        pineBluff: {
                            total: 46094,
                            latitude: 34.2284312,
                            longitude: -92.00319549999999
                        },
                        bentonville: {
                            total: 40167,
                            latitude: 36.3728538,
                            longitude: -94.2088172
                        }
                    },
                    utah: {
                        total: 3200000,
                        saltLakeCity: {
                            total: 191180,
                            latitude: 40.7607793,
                            longitude: -111.8910474
                        },
                        westValleyCity: {
                            total: 133579,
                            latitude: 40.6916132,
                            longitude: -112.0010501
                        },
                        provo: {
                            total: 116288,
                            latitude: 40.2338438,
                            longitude: -111.6585337
                        },
                        westJordan: {
                            total: 110077,
                            latitude: 40.6096698,
                            longitude: -111.9391031
                        },
                        orem: {
                            total: 91648,
                            latitude: 40.2968979,
                            longitude: -111.6946475
                        },
                        sandy: {
                            total: 90231,
                            latitude: 40.5649781,
                            longitude: -111.8389726
                        },
                        ogden: {
                            total: 84249,
                            latitude: 41.223,
                            longitude: -111.9738304
                        },
                        stGeorge: {
                            total: 76817,
                            latitude: 37.0965278,
                            longitude: -113.5684164
                        },
                        layton: {
                            total: 70790,
                            latitude: 41.0602216,
                            longitude: -111.9710529
                        },
                        taylorsville: {
                            total: 60519,
                            latitude: 40.66772479999999,
                            longitude: -111.9388258
                        },
                        southJordan: {
                            total: 59366,
                            latitude: 40.5621704,
                            longitude: -111.929658
                        },
                        lehi: {
                            total: 54382,
                            latitude: 40.3916172,
                            longitude: -111.8507662
                        },
                        logan: {
                            total: 48913,
                            latitude: 41.7369803,
                            longitude: -111.8338359
                        },
                        murray: {
                            total: 48612,
                            latitude: 40.6668916,
                            longitude: -111.8879909
                        },
                        draper: {
                            total: 45285,
                            latitude: 40.5246711,
                            longitude: -111.8638226
                        },
                        bountiful: {
                            total: 43023,
                            latitude: 40.8893895,
                            longitude: -111.880771
                        },
                        riverton: {
                            total: 40921,
                            latitude: 40.521893,
                            longitude: -111.9391023
                        },
                        roy: {
                            total: 37733,
                            latitude: 41.1616108,
                            longitude: -112.0263313
                        },
                        spanishFork: {
                            total: 36956,
                            latitude: 40.114955,
                            longitude: -111.654923
                        }
                    },
                    rhodeIsland: {
                        total: 1100000,
                        providence: {
                            total: 177994,
                            latitude: 41.8239891,
                            longitude: -71.4128343
                        },
                        warwick: {
                            total: 81971,
                            latitude: 41.7001009,
                            longitude: -71.4161671
                        },
                        cranston: {
                            total: 80566,
                            latitude: 41.7798226,
                            longitude: -71.4372796
                        },
                        pawtucket: {
                            total: 71172,
                            latitude: 41.878711,
                            longitude: -71.38255579999999
                        },
                        eastProvidence: {
                            total: 47149,
                            latitude: 41.8137116,
                            longitude: -71.3700545
                        },
                        woonsocket: {
                            total: 41026,
                            latitude: 42.00287609999999,
                            longitude: -71.51478390000001
                        }
                    },
                    mississippi: {
                        total: 2980000,
                        jackson: {
                            total: 172638,
                            latitude: 32.2987573,
                            longitude: -90.1848103
                        },
                        gulfport: {
                            total: 71012,
                            latitude: 30.3674198,
                            longitude: -89.0928155
                        },
                        southaven: {
                            total: 50997,
                            latitude: 34.9889818,
                            longitude: -90.0125913
                        },
                        hattiesburg: {
                            total: 47556,
                            latitude: 31.3271189,
                            longitude: -89.29033919999999
                        },
                        biloxi: {
                            total: 44820,
                            latitude: 30.3960318,
                            longitude: -88.88530779999999
                        },
                        meridian: {
                            total: 40921,
                            latitude: 32.3643098,
                            longitude: -88.703656
                        }
                    },
                    southDakota: {
                        total: 880000,
                        siouxFalls: {
                            total: 164676,
                            latitude: 43.5445959,
                            longitude: -96.73110340000001
                        },
                        rapidCity: {
                            total: 70812,
                            latitude: 44.0805434,
                            longitude: -103.2310149
                        }
                    },
                    connecticut: {
                        total: 3600000,
                        bridgeport: {
                            total: 147216,
                            latitude: 41.1865478,
                            longitude: -73.19517669999999
                        },
                        newHaven: {
                            total: 130660,
                            latitude: 41.308274,
                            longitude: -72.9278835
                        },
                        stamford: {
                            total: 126456,
                            latitude: 41.0534302,
                            longitude: -73.5387341
                        },
                        hartfordCounty: {
                            total: 891720,
                            hartford: {
                                total: 125017,
                                latitude: 41.76371109999999,
                                longitude: -72.6850932
                            },
                            westHartford: {
                                total: 63300
                            },
                            eastHartford: {
                                total: 51300
                            },
                            enfield: {
                                total: 44700
                            },
                            southington: {
                                total: 43000
                            },
                            glastonbury: {
                                total: 34000
                            },
                            newington: {
                                total: 30600
                            },
                            windsor: {
                                total: 29000
                            },
                            wethersfield: {
                                total: 26700
                            },
                            farmington: {
                                total: 25000
                            },
                            bloomington: {
                                total: 20500
                            },
                            granby: {
                                total: 11000
                            },
                            burlington: {
                                total: 9000
                            },
                            eastGranby: {
                                total: 5000
                            },
                            newBritain: {
                                total: 72939,
                                latitude: 41.6612104,
                                longitude: -72.7795419
                            },
                            bristol: {
                                total: 60568,
                                latitude: 41.67176480000001,
                                longitude: -72.9492703
                            },
                            simsbury: {
                                total: 23511
                            },
                            avon: {
                                total: 18302
                            }
                        },
                        waterbury: {
                            total: 109676,
                            latitude: 41.5581525,
                            longitude: -73.0514965
                        },
                        norwalk: {
                            total: 87776,
                            latitude: 41.11774399999999,
                            longitude: -73.4081575
                        },
                        danbury: {
                            total: 83684,
                            latitude: 41.394817,
                            longitude: -73.4540111
                        },
                        meriden: {
                            total: 60456,
                            latitude: 41.5381535,
                            longitude: -72.80704349999999
                        },
                        westHaven: {
                            total: 55046,
                            latitude: 41.2705484,
                            longitude: -72.9469711
                        },
                        milford: {
                            total: 51644,
                            latitude: 41.2306979,
                            longitude: -73.064036
                        },
                        middletown: {
                            total: 47333,
                            latitude: 41.5623209,
                            longitude: -72.6506488
                        },
                        shelton: {
                            total: 40999,
                            latitude: 41.3164856,
                            longitude: -73.0931641
                        },
                        norwich: {
                            total: 40347,
                            latitude: 41.5242649,
                            longitude: -72.07591049999999
                        }
                    },
                    southCarolina: {
                        total: 5100000,
                        columbia: {
                            total: 133358,
                            latitude: 34.0007104,
                            longitude: -81.0348144
                        },
                        charleston: {
                            total: 127999,
                            latitude: 32.7764749,
                            longitude: -79.93105120000001
                        },
                        northCharleston: {
                            total: 104054,
                            latitude: 32.8546197,
                            longitude: -79.9748103
                        },
                        mountPleasant: {
                            total: 74885,
                            latitude: 32.8323225,
                            longitude: -79.82842579999999
                        },
                        rockHill: {
                            total: 69103,
                            latitude: 34.9248667,
                            longitude: -81.02507840000001
                        },
                        greenville: {
                            total: 61397,
                            latitude: 34.85261759999999,
                            longitude: -82.3940104
                        },
                        summerville: {
                            total: 46074,
                            latitude: 33.0185039,
                            longitude: -80.17564809999999
                        },
                        sumter: {
                            total: 41190,
                            latitude: 33.9204354,
                            longitude: -80.3414693
                        },
                        gooseCreek: {
                            total: 39823,
                            latitude: 32.9810059,
                            longitude: -80.03258670000001
                        },
                        hiltonHeadIsland: {
                            total: 39412,
                            latitude: 32.216316,
                            longitude: -80.752608
                        },
                        florence: {
                            total: 37792,
                            latitude: 34.1954331,
                            longitude: -79.7625625
                        },
                        spartanburg: {
                            total: 37647,
                            latitude: 34.9495672,
                            longitude: -81.9320482
                        }
                    },
                    northDakota: {
                        total: 760000,
                        fargo: {
                            total: 113658,
                            latitude: 46.8771863,
                            longitude: -96.7898034
                        },
                        bismarck: {
                            total: 67034,
                            latitude: 46.8083268,
                            longitude: -100.7837392
                        },
                        grandForks: {
                            total: 54932,
                            latitude: 47.9252568,
                            longitude: -97.0328547
                        },
                        minot: {
                            total: 46321,
                            latitude: 48.2329668,
                            longitude: -101.2922906
                        }
                    },
                    montana: {
                        total: 1100000,
                        billings: {
                            total: 109059,
                            latitude: 45.7832856,
                            longitude: -108.5006904
                        },
                        missoula: {
                            total: 69122,
                            latitude: 46.87871759999999,
                            longitude: -113.996586
                        },
                        greatFalls: {
                            total: 59351,
                            latitude: 47.4941836,
                            longitude: -111.2833449
                        },
                        bozeman: {
                            total: 39860,
                            latitude: 45.6769979,
                            longitude: -111.0429339
                        }
                    },
                    delaware: {
                        total: 970000,
                        wilmington: {
                            total: 71525,
                            latitude: 39.7390721,
                            longitude: -75.5397878
                        },
                        dover: {
                            total: 37366,
                            latitude: 39.158168,
                            longitude: -75.5243682
                        }
                    },
                    maine: {
                        total: 1300000,
                        portland: {
                            total: 66318,
                            latitude: 43.66147100000001,
                            longitude: -70.2553259
                        }
                    },
                    wyoming: {
                        total: 579000,
                        cheyenne: {
                            total: 62448,
                            latitude: 41.1399814,
                            longitude: -104.8202462
                        },
                        casper: {
                            total: 59628,
                            latitude: 42.866632,
                            longitude: -106.313081
                        }
                    },
                    westVirginia: {
                        total: 1800000,
                        charleston: {
                            total: 50821,
                            latitude: 38.3498195,
                            longitude: -81.6326234
                        },
                        huntington: {
                            total: 49177,
                            latitude: 38.4192496,
                            longitude: -82.44515400000002
                        }
                    },
                    vermont: {
                        total: 620000,
                        burlington: {
                            total: 42284,
                            latitude: 44.4758825,
                            longitude: -73.21207199999999
                        }
                    },
                    puertoRico: {
                        total: 3200000
                    },
                    guam: 168500,
                    usVirginIslands: 106000,
                    northernMarianaIslands: 51000,
                    americanSamoa: 49000
                },
                mexico: {
                    total: 131000000
                },
                cuba: {
                    total: 11338138
                },
                jamaica: {
                    total: 2934855
                },
                dominica: {
                    total: 71625
                },
                dominicanRepublic: {
                    total: 10627165
                },
                elSalvador: {
                    total: 6420744
                },
                haiti: {
                    total: 11123176
                },
                honduras: {
                    total: 9587522
                },
                grenada: {
                    total: 111454
                },
                guatemala: {
                    total: 17247807
                },
                trinidadAndTobago: {
                    total: 1389858
                },
                nicaragua: {
                    total: 6465513
                },
                guadeloupe: {
                    total: 395700
                }
            },
            southAmerica: {
                total: 433_000_000,
                brazil: {
                    total: 211000000,
                    north: {
                        total: 17700000
                    },
                    northeast: {
                        total: 56900000
                    },
                    centralWest: {
                        total: 15600000
                    },
                    southeast: {
                        total: 86300000
                    },
                    south: {
                        total: 29400000
                    }
                },
                argentina: {
                    total: 44494502
                },
                panama: {
                    total: 4176873
                },
                paraguay: {
                    total: 6956071
                },
                peru: {
                    total: 31989256
                },
                uruguay: {
                    total: 3449299
                },
                venezuela: {
                    total: 28870195
                },
                bolivia: {
                    total: 11353142
                },
                chile: {
                    total: 18729160
                },
                colombia: {
                    total: 49648685
                },
                costaRica: {
                    total: 4999441
                },
                ecuador: {
                    total: 17084357
                },
                // ...
            },
            oceania: {
                total: 41_000_000,
                australia: {
                    total: 24_982_688
                },
                newZealand: {
                    total: 4841000
                },
                papuaNewGuinea: {
                    total: 8606316
                },
            },
            antarctica: {
                total: 1106
            }
        };
    }

    static unassignedNations () {
        return {
            americanSamoa: {
                total: 55465
            },
            anguilla: {
                total: 15094
            },
            antiguaAndBarbuda: {
                total: 96286
            },
            aruba: {
                total: 105845
            },
            bahamas: {
                total: 385640
            },
            barbados: {
                total: 286641
            },
            belize: {
                total: 383071
            },
            bermuda: {
                total: 63973
            },
            bhutan: {
                total: 754394
            },


            caymanIslands: {
                total: 64174
            },
            christmasIsland: {
                total: 1402
            },
            cocosKeelingIslands: {
                total: 596
            },
            cookIslands: {
                total: 17379
            },
            
            falklandIslands: {
                total: 2840
            },
            faroeIslands: {
                total: 48497
            },
            fijiIslands: {
                total: 883483
            },
            frenchGuiana: {
                total: 290691
            },
            frenchPolynesia: {
                total: 277679
            },

            guam: {
                total: 165768
            },

            guyana: {
                total: 779004
            },


            kiribati: {
                total: 115847
            },


            maldives: {
                total: 515696
            },



            macao: {
                total: 631636
            },

            marshallIslands: {
                total: 58413
            },
            martinique: {
                total: 376480
            },



            mayotte: {
                total: 270372
            },
            micronesia,FederatedStatesOf: {
                total: 112640
            },

            

            montserrat: {
                total: 5900
            },


            nauru: {
                total: 12704
            },
            
            

            netherlandsAntilles: {
                total: 227049
            },
            newCaledonia: {
                total: 284060
            },
            niue: {
                total: 1624
            },
            norfolkIsland: {
                total: 2169
            },
            northernMarianaIslands: {
                total: 56882
            },
            palau: {
                total: 17907
            },

            pitcairn: {
                total: 67
            },

            reunion: {
                total: 859959
            },

            saintHelena: {
                total: 6600
            },
            saintKittsAndNevis: {
                total: 52441
            },
            saintLucia: {
                total: 181889
            },
            saintPierreAndMiquelon: {
                total: 5888
            },
            saintVincentAndTheGrenadines: {
                total: 110210
            },
            samoa: {
                total: 196130
            },
            sanMarino: {
                total: 33785
            },
            saoTomeAndPrincipe: {
                total: 211028
            },
 

            solomonIslands: {
                total: 652858
            },
            southGeorgiaAndTheSouthSandwichIslands: {
                total: 30
            },



            suriname: {
                total: 575991
            },



            tokelau: {
                total: 1411
            },
            tonga: {
                total: 103197
            },

            


            turksAndCaicosIslands: {
                total: 37665
            },
            tuvalu: {
                total: 11508
            },
            unitedStatesMinorOutlyingIslands: {
                total: 300
            },
            vanuatu: {
                total: 292680
            },
            virginIslandsUK: {
                total: 29802
            },

            wallisAndFutuna: {
                total: 15289
            } 
        };
    }

    // returns array like ['westHollywood', 'losAngeles', 'california', 'usa', 'northAmerica']
    static randomLocation () {
        const tree = RegionTree.fullTree();
        let curNode = tree;
        const path = [];

        while (! RegionTree.isLeaf(curNode)) {
            const keysToPopulation = RegionTree.getKeysToPopulationObj(curNode);

            let roll = Math.random() * curNode.total;

            for (const key in keysToPopulation) {
                // Util.logDebug(`About to decrement roll ${roll} by ${keysToPopulation[key]} thanks to ${key}`);

                roll -= keysToPopulation[key];

                if (roll <= 0) {
                    path.unshift(key);

                    // Note that when key is 'other', curNode will become undefined. isLeaf() will handle this.
                    curNode = curNode[key];
                    break;

                    // Bug to fix later: Saw one more 'other' than expected: other, collierville, tennessee, usa, northAmerica

                    // Later, when final node in path is 'other', i could add a note like 'But they live closest to <location>', where location was uniformly randomly selected from the non-other options.
                }
            }

            if (roll > 0) {
                throw new Error(`Didnt expect to match nothing with random roll ${roll} and path ${path}.`);
            }
        }

        return path;
    }

    // returns a flat obj describing the pop of each child (inc other)
    static getKeysToPopulationObj (node) {
        if (RegionTree.isLeaf(node)) {
            return;
        }

        const keysToPopulation = {};

        for (const key in node) {
            if (RegionTree.isLeafyKey(key)) {
                continue;
            }

            keysToPopulation[key] = RegionTree.getTotal(node[key]);
        }

        const missingCount = node.total - Util.sum(Object.values(keysToPopulation));

        if (missingCount > 0) {

            if (missingCount === undefined) {
                throw new Error(`weird bug again. node's keys are ${Object.keys(node)}`)
            }

            keysToPopulation.other = missingCount;
        }

        return keysToPopulation;
    }

    static printMissingCounts () {
        const tree = RegionTree.fullTree();

        addMissingCounts(tree);

        Util.log(tree);

        function addMissingCounts (node) {
            if (RegionTree.isLeaf(node)) {
                return;
            }

            const k2p = RegionTree.getKeysToPopulationObj(node);

            if (k2p.other) {
                node.other = k2p.other;
            }

            for (const key in node) {
                addMissingCounts(node[key]);
            }
        }
    }

    static selectN (n) {
        const locations = [];

        for (let i = 0; i < n; i++) {
            locations.push(RegionTree.randomLocation());
        }

        return locations;
    }

    // Input number of people per path
    // Output array of paths, evenly distributed
    // Eg, input 71,000,000 to see where all the wizard schools are.
    static pathsAtRate (everyNPeople) {
        const tree = RegionTree.fullTree();
        const count = Math.round(tree.total / everyNPeople);

        return selectPaths(tree, [], count);

        // Then recurse down tree, splitting up count proportionally between branches
        // Remainders should be assigned randomly between branches
        // Similarly, when count is 1, assign randomly between branches
        // Return array of paths

        function selectPaths (curNode, pathSoFar, count) {
            let output = [];

            console.log(`selectPaths({${curNode._name || '?'}}, ${pathSoFar.join(' ')}, ${count})`);

            if (RegionTree.isLeaf(curNode)) {

                for (let i = 0; i < count; i++) {
                    // Return <count> copies of path.
                    output.push([...pathSoFar]);
                }

                if (output.length !== count) {
                    throw new Error(`Leaf case. pathSoFar is ${pathSoFar.join(' ')}. Expected ${count} paths, got ${output.length} paths:\n${pathsStr}`);
                }

                console.log(`  Returning ${output.length} copies of this leaf: ${output[0].join(' ')}`);

                return output;
            }

            const children = [];

            if (output.length > 0) {
                throw new Error(`Top of nonleaf case. pathSoFar is ${pathSoFar.join(' ')}. Expected ${count} paths, got ${output.length} paths:\n${pathsStr}`);
            }

            let countLeft = count;

            for (const key in curNode) {
                if (RegionTree.isLeafyKey(key)) {
                    continue;
                }

                const value = curNode[key];
                let child;

                if (Util.isNumber(value)) {
                    child = {
                        total: value,
                        _name: key
                    };
                }
                else {
                    child = value;
                    child._name = key;
                }

                children.push(child);

                // Distribute those that clearly fit into large regions, nonrandomly.
                const fitCount = Math.floor(child.total / everyNPeople);

                if (fitCount === 0) {
                    continue;
                }

                countLeft -= fitCount;

                const childPath = pathSoFar.concat(key);

                console.log(`  Nonrandom distribution, childPath is ${childPath.join(' ')}, fitCount is ${fitCount}:`);

                const newPaths = selectPaths(
                    child,
                    childPath,
                    fitCount
                );

                // if (newPaths.length !== fitCount)

                output = output.concat(newPaths);

                // TODO should probably decrement local child totals when they get nonrandom assignments, for the purpose of later weighted lottery.
                // IE if Turkey can fit 2.1 things, we should give it 2 nonrandomly, and then have its lottery weight for a 3rd be proportional to 0.1
                // Note: Be careful editing child.total fields, since those are not always deep copied.
            }

            // Now distribute the rest of the things by weighted lottery.
            for (let i = 0; i < countLeft; i++) {
                let roll = Math.random() * curNode.total;

                for (const child of children) {
                    roll -= child.total;

                    if (roll <= 0) {
                        const newPaths = selectPaths(
                            child,
                            pathSoFar.concat(child._name),
                            1
                        );

                        output = output.concat(newPaths);
                        break;
                    }
                }
            }

            if (output.length !== count) {
                const pathsStr = RegionTree.prettyPaths(output.sort());

                throw new Error(`pathSoFar is ${pathSoFar.join(' ')}. Expected ${count} paths, got ${output.length} paths:\n${pathsStr}`);
            }

            return output.sort();
        }
    }

    static prettyPaths (paths) {
        return paths.map(
            p => p.join(' ')
        )
        .join('\n');
    }

    // static missingCount () {

    // }

    static isLeafyKey (input) {
        return Util.contains(['total', 'latitude', 'longitude', '_name'], input);
    }

    static isLeaf (node) {
        if (! node || Util.isNumber(node)) {
            return true;
        }

        for (const key in node) {
            if (! RegionTree.isLeafyKey(key)) {
                return false;
            }
        }

        return true;
    }

    static getTotal (node) {
        if (Util.isNumber(node)) {
            return node;
        }
        
        if (! node) {
            return 0;
        }

        if (! node.total) {
            throw new Error(`Cant interpret tree node: ${Util.stringify(node)}`);
        }

        return node.total;
    }

    static toPrettyString (path) {
        return path.map(
            s => RegionTree.capitalized(s)
        )
        .join(' / ');
    }

    static capitalized (str) {
        const SPECIAL = {
            usa: 'USA',
            uae: 'UAE',
            uk: 'UK'
        };

        if (SPECIAL[str]) {
            return SPECIAL[str];
        }

        return Util.fromCamelCase(str);
    }

    static printInconsistencies (node) {
        node = node || RegionTree.fullTree();

        if (! node.total) {
            return;
        }

        const k2p = RegionTree.getKeysToPopulationObj(node);
        // Util.logDebug(`Inconsistency func. node is ${node} with keys ${node && Object.keys(node)}.`);

        const sum = k2p ?
            Util.sum(Object.values(k2p)) :
            0;

        if (sum > node.total) {
            Util.log(`Inconsistency: keys + other sum to ${sum} but total is listed as ${node.total}. And other is ${k2p.other} Keys are ${Object.keys(k2p)}.`);
        }

        for (const key in node) {
            if (! RegionTree.isLeafyKey(key) && node[key]) {
                RegionTree.printInconsistencies(node[key]);
            }
        }
    }

    static largestLeaf (curNode, largestSoFar, parentName) {
        curNode = curNode || RegionTree.fullTree();
        largestSoFar = largestSoFar || {
            name: undefined, // but note that we must clarify where 'other' refers to
            population: 0
        };
        parentName = parentName || 'earth';

        const k2p = RegionTree.getKeysToPopulationObj(curNode);

        for (const key in k2p) {
            if (RegionTree.isLeafyKey(key)) {
                continue;
            }

            // Later could probably consolidate the '>' logic with the similar logic below.
            if (key === 'other' && k2p.other > largestSoFar.population) {
                largestSoFar.name = `${parentName}/other`;
                largestSoFar.population = k2p.other;
                continue;
            }

            const childNode = curNode[key];
            let candidate = {};

            if (RegionTree.isLeaf(childNode)) {
                candidate = {
                    name: key,
                    population: RegionTree.getTotal(childNode),
                };
            }
            else {
                candidate = RegionTree.largestLeaf(childNode, largestSoFar, key);
            }

            if (candidate.population > largestSoFar.population) {
                largestSoFar = candidate;
            }
        }

        return largestSoFar;
    }

    // Example entry in cities array:
    // {
    //     city: New York, 
    //     growth_from_2000_to_2013: 4.8%, 
    //     latitude: 40.7127837, 
    //     longitude: -74.0059413, 
    //     population: 8405837, 
    //     rank: 1, 
    //     state: New York
    // }, 
    static parseFlatInput (filePath) {
        const usa = RegionTree.fullTree().northAmerica.usa;
        const cities = require(filePath);

        for (const entry of cities) {
            const cityKey = Util.toCamelCase(entry.city);
            const stateKey = Util.toCamelCase(entry.state);

            if (! usa[stateKey]) {
                usa[stateKey] = {
                    total: 0
                };
            }

            const state = usa[stateKey];

            if (! state[cityKey]) {
                state[cityKey] = {}
            }
            else if (Util.isNumber(state[cityKey])) {
                const pop = state[cityKey];
                state[cityKey] = {
                    total: pop
                };
            }

            const city = state[cityKey];
            city.total = Number(entry.population);
            city.latitude = entry.latitude;
            city.longitude = entry.longitude;
        }

        Util.log(usa);
    }

    // RegionTree.parseBigDataset('./worldcitiespop.json');
    static parseBigDataset (filePath) {
        // TODO try stream-json module instead
        // https://stackoverflow.com/questions/42896447/parse-large-json-file-in-nodejs-and-handle-each-object-independently
        const json = require(filePath);

        Util.log(Object.keys(json));
    }

    static parseNations (filePath) {
        filePath = filePath || './nations.json';

        const nations = require(filePath);
        const tree = RegionTree.fullTree();

        for (const entry of nations) {
            const name = Util.toCamelCase(entry.country);

            let foundKey;
            for (const continentKey in tree) {
                if (tree[continentKey][name]) {
                    foundKey = continentKey;
                    break;
                }
            }

            foundKey = foundKey || 'unassigned';

            if (foundKey === 'unassigned' || Util.isNumber(tree[foundKey][name])) {
                tree[foundKey][name] = {
                    total: entry.population
                };

                continue;
            }

            tree[foundKey][name].total = entry.population;
        }

        Util.log(tree);
    }

    static run () {
        // RegionTree.printMissingCounts();
        const paths = RegionTree.pathsAtRate(71_000_000);
        const out = RegionTree.prettyPaths(paths);
        Util.log(out);

        // Util.log(RegionTree.largestLeaf());

        RegionTree.printInconsistencies();
    }
};

module.exports = RegionTree;


RegionTree.run();

