var app = angular.module('appTransferenciasBancoNix', []);

app.controller('ctrlTransferencias', ['$scope', '$http', function($scope, $http) {
    $http.get("https://nix-bank-qa.cloudint.nexxera.com/v1/transactions")
        .then(function(response) {
            $scope.transferencias = response["data"]["data"];
            $scope.transferencias.map(function(item){
                item.valor = (item.valor).toFixed(2).replace('.',',');
                item.tipo = (item.tipo).toUpperCase();
                item.status = (item.status).charAt(0).toUpperCase() + (item.status).slice(1);
                item.idMin = (item.id).slice(0,8) + "...";
            });

            $scope.filtroStatus = $scope.transferencias.reduce(function(all, item) {
                if (!all.includes(item.status)){ all.push(item.status) }
                return all;
            }, []);

            $scope.filtroTipo = $scope.transferencias.reduce(function(all, item) {
                if (!all.includes(item.tipo)){ all.push(item.tipo) }
                return all;
            }, []);
        });
}]);
