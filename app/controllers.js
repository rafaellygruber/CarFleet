var app = angular.module('CarFleet', ['ngMask']);

(function (app) {

    app.controller('CarFleetController', ['$scope', '$filter', carFleetController]);

    function carFleetController($scope, $filter) {

        $scope.car = {};
        $scope.isAllSelected = false;

        /*$scope.fetchList = function () {
            $http.get('http://www.url.com/cars').success(function (cars) {
                $scope.cars = cars;
            });
        }*/

        $scope.fetchList = function () {
            $scope.cars = [

                { "combustivel": "Flex", "imagem": null, "marca": "Volkswagem", "modelo": "Gol", "placa": "FFF-5498", "valor": "20000" },
                { "combustivel": "Gasolina", "imagem": null, "marca": "Volkswagem", "modelo": "Fox", "placa": "FOX-4125", "valor": "20000" },
                { "combustivel": "Alcool", "imagem": "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg", "marca": "Volkswagen", "modelo": "Fusca", "placa": "PAI-4121", "valor": "20000" },
            ];
        };

        $scope.fetchList();

        $scope.addCar = function () {
            $scope.car = {};
        }

        $scope.saveCar = function () {
            var car = { placa: $scope.car.placa.toUpperCase(), combustivel: $scope.car.combustivel, imagem: $scope.car.imagem, marca: $scope.car.marca, modelo: $scope.car.modelo, valor: $scope.car.valor };
            $scope.cars.push(car);
            toastr.success("Veículo adicionado com sucesso.");

            LoadGridFunctions($scope, $filter);
        };

        //Check box all
        $scope.toggleAll = function () {
            var toggleStatus = $scope.isAllSelected;
            angular.forEach($scope.cars, function (car) { car.selected = toggleStatus; });
        }
        $scope.optionToggled = function () {
            isAllSelected = true;
            angular.forEach($scope.cars, function (car) { if (!car.selected) { isAllSelected = false; } });
            $scope.isAllSelected = isAllSelected;
        }

        LoadGridFunctions($scope, $filter);
    }

    function LoadGridFunctions($scope, $filter) {
        //Pagination
        $scope.filteredCars = [];
        $scope.carsPerPage = 5;
        $scope.pagedCars = [];
        $scope.currentPage = 0;

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return (haystack != null ? haystack : "").toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // init the filtered items
        $scope.search = function () {
            $scope.filteredCars = $filter('filter')($scope.cars, function (item) {
                for (var attr in item) {                    
                    if ((attr == "combustivel" || attr == "marca") && searchMatch(item[attr], $scope.query))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };

        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedCars = [];

            for (var i = 0; i < $scope.filteredCars.length; i++) {
                if (i % $scope.carsPerPage === 0) {
                    $scope.pagedCars[Math.floor(i / $scope.carsPerPage)] = [$scope.filteredCars[i]];
                } else {
                    $scope.pagedCars[Math.floor(i / $scope.carsPerPage)].push($scope.filteredCars[i]);
                }
            }
        };

        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedCars.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        // functions have been describe process the data for display
        $scope.search();
    }

})(app);