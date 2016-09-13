angular.module('ionic-city-index-select.controllers', [])
    .controller('CityCtrl', function ($scope, $ionicHistory, $rootScope, $ionicScrollDelegate) {
        var d = static_cities;
        var cache_currentCity = "cache_currentCity";
        var newCities = []
        // 初始化城市索引
        var cities = []
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        chars.split('').forEach(function (c) {
            var c = {
                index: c,
                cities: [],
            }
            cities.push(c)
        }, this);

        cities.forEach(function (c) {
            d.forEach(function (city) {
                if (c.index == city.index) {
                    c.cities.push(city);
                }
            }, this)
        }, this);

        cities.forEach(function (c) {
            if (c.cities.length > 0) {
                newCities.push(c);
            }
        }, this);

        //添加热门城市  
        $scope.cities = newCities;
        $scope.hotCities = [
            {
                "name": "北京",
                "pinyin": "beijing",
                "index": "B"
            },
            {
                "name": "上海",
                "pinyin": "shanghai",
                "index": "S"
            },
            {
                "name": "广州",
                "pinyin": "guangzhou",
                "index": "G"
            },
            {
                "name": "深圳",
                "pinyin": "shenzhen",
                "index": "S"
            },
            {
                "name": "重庆",
                "pinyin": "chongqing",
                "index": "C"
            },
            {
                "name": "武汉",
                "pinyin": "wuhan",
                "index": "W"
            }
        ]

        // 城市搜索
        $scope.$watch('cityText', function (newVal, oldVal, e) {
            if (!newVal || newVal == "") {
                $scope.filterCities = [];
                return;
            }
            $ionicScrollDelegate.$getByHandle('cityScroll').scrollTop();
            // 将汉子转为拼音
            var pinyin = codefans_net_CC2PY(newVal).toUpperCase();//都转换为大写字母
            var filterCities = []
            newCities.forEach(function (c) {
                c.cities.forEach(function (city) {
                    var targetPy = codefans_net_CC2PY(city.name).toUpperCase();//都转换为大写字母
                    if (targetPy.match(pinyin)) {
                        filterCities.push(city);
                    }
                }, this);
            });

            $scope.filterCities = filterCities;
        })

        $scope.citySelected = function (c) {
            console.log(JSON.stringify(c));
            $rootScope.currentCity = c;

            // 缓存当前城市
            window.localStorage[cache_currentCity] = angular.toJson(c);

            $ionicHistory.goBack();
        }

        function alphabetMove(pPositionY) {
            var currentItem, targetItem;
            var d = document;
            // 根据手指触摸的位置找到当前的element
            currentItem = d.elementFromPoint(d.body.clientWidth - 1, pPositionY);
            // 判断当前的element是不是 索引
            if (!currentItem || currentItem.className.indexOf('index-bar') < 0) return;

            // 根据当前的索引找到列表的索引
            targetItem = document.getElementById(currentItem.innerText);
            document.getElementById('indexs-title').style.display = 'block'
            document.getElementById('indexs-title').innerText = currentItem.innerText;

            $ionicScrollDelegate.$getByHandle('cityScroll').scrollBy(0, targetItem.getBoundingClientRect().top - 88, false)
        }

        //绑定事件
        var indexsBar = document.getElementById('indexs-bar');
        indexsBar.addEventListener('touchstart', function (e) {
            alphabetMove(e.changedTouches[0].clientY);
        });

        indexsBar.addEventListener('touchmove', function (e) {
            e.preventDefault();
            alphabetMove(e.changedTouches[0].clientY);
        });
        indexsBar.addEventListener('touchend', function () {
            document.getElementById('indexs-title').style.display = 'none';
        });

    })