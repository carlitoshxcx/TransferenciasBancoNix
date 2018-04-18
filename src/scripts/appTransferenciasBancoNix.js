"use strict";
var app = angular
    .module('appTransferenciasBancoNix', [])
    .controller('ctrlTransferencias', ['$scope', '$filter', '$http', function($scope, $filter, $http) {
        $scope.transferencias = [];

        //Dados com filtro
        $scope.status = [];
        $scope.tipo = [];

        //Paginação
        $scope.paginaAtual = 0;
        $scope.tamanhoPagina = "5";
        $scope.filtroTransferencias = {};

        $scope.transferenciasFiltradas = function () {
            return $filter('filter')($scope.transferencias, $scope.filtroTransferencias);
        };
        
        $scope.numeroDePaginas = function(){
            return Math.ceil($scope.transferenciasFiltradas().length/$scope.tamanhoPagina);                
        };

        $http.get("https://nix-bank-qa.cloudint.nexxera.com/v1/transactions")
            .then(function(response) {
                $scope.transferencias = response.data.data;

                $scope.transferencias.map(function(item, index){
                    item.index  = index + 1;
                    item.status = (item.status).charAt(0).toUpperCase() + (item.status).slice(1);
                    item.tipo   = (item.tipo).toUpperCase();
                    item.valor  = (item.valor).toFixed(2).replace('.',',');
                });

                $scope.status = $scope.transferencias.reduce(function(all, item) {
                    if (!all.includes(item.status)){ all.push(item.status); }
                    return all;
                }, []);

                $scope.tipo = $scope.transferencias.reduce(function(all, item) {
                    if (!all.includes(item.tipo)){ all.push(item.tipo); }
                    return all;
                }, []);
            });
    }])
    .directive('transferencias', [function() {
        return {
            template:   '<table class="highlight table_transferencias">'+
                            '<thead>'+
                                '<tr class="itemtitle">'+
                                    '<td class="itemtitle_index hide-on-small-only"></td>'+
                                    '<td class="itemtitle_valor hide-on-small-only">Valor</td>'+
                                    '<td class="itemtitle_pagador_nome">Pagador</td>'+
                                    '<td class="itemtitle_beneficiario_nome">Beneficiário</td>'+
                                    '<td class="itemtitle_status">Status</td>'+
                                    '<td class="itemtitle_tipo">Tipo</td>'+
                                '</tr>'+
                                '<tr class="itemtitle_options">'+
                                    '<td class="itemtitle_index hide-on-small-only"></td>'+
                                    '<td class="itemtitle_valor hide-on-small-only"></td>'+
                                    '<td class="itemtitle_pagador_nome">'+
                                        '<input type="text" ng-model="filtroTransferencias.pagador.nome" id="pagador_nome"></td>'+
                                    '<td class="itemtitle_beneficiario_nome">'+
                                        '<input type="text" ng-model="filtroTransferencias.beneficiario.nome" id="beneficiario_nome"></td>'+
                                    '<td class="itemtitle_status">'+
                                        '<select ng-model="filtroTransferencias.status" id="selectStatus" class="browser-default">'+
                                            '<option value="">Selecione</option>'+
                                            '<option ng-repeat="item in status">{{ item }}</option></select></td>'+
                                    '<td class="itemtitle_tipo">'+
                                        '<select ng-model="filtroTransferencias.tipo" id="selectTipo" class="browser-default">'+
                                            '<option value="">Selecione</option>'+
                                            '<option ng-repeat="item in tipo">{{ item }}</option></select></td>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody ng-repeat="item in transferencias | filter:filtroTransferencias | startFrom:paginaAtual*tamanhoPagina | limitTo:tamanhoPagina">'+
                                '<tr ng-click="mostrarDetalhes = ! mostrarDetalhes">'+
                                    '<td class="item_index hide-on-small-only"><small>#{{ item.index }}</small></td>'+
                                    '<td class="item_valor hide-on-small-only">R${{ item.valor }}</td>'+
                                    '<td class="item_pagador_nome">{{ item.pagador.nome }}</td>'+
                                    '<td class="item_beneficiario_nome">{{ item.beneficiario.nome }}</td>'+
                                    '<td class="item_status"><small>{{ item.status }}</small></td>'+
                                    '<td class="item_tipo"><small>{{ item.tipo }}</small></td>'+
                                '</tr>'+
                                '<tr class="info" ng-show="mostrarDetalhes" style="background-color: #f5f5f5;">'+
                                    '<td class="item_index hide-on-small-only"></td>'+
                                    '<td class="item_valor hide-on-small-only"></td>'+
                                    '<td class="item_pagador_nome">'+
                                        '<small>Banco:</small>     {{ item.pagador.banco }}<br>'+
                                        '<small>Agência:</small>   {{ item.pagador.agencia }}<br>'+
                                        '<small>Conta:</small>     {{ item.pagador.conta }}<br>'+
                                    '</td>'+
                                    '<td class="item_beneficiario_nome">'+
                                        '<small>Banco:</small>     {{ item.beneficiario.banco }}<br>'+
                                        '<small>Agência:</small>   {{ item.beneficiario.agencia }}<br>'+
                                        '<small>Conta:</small>     {{ item.beneficiario.conta }}<br>'+
                                    '</td>'+
                                    '<td class="item_status" colspan="2"><span class="hide-on-med-and-up show-on-small">R${{ item.valor }}<br></span><small>ID: {{ item.id }}</small></td>'+
                                    // '<td class="item_tipo"></td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>',
            replace: true
        };
    }])
    .filter('startFrom', [function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };  
    }]);
