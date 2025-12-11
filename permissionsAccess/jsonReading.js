"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yaml = require("yaml");
var path = require("path");
var perf_hooks_1 = require("perf_hooks");
var jsonPermissions = require("./jsonPermissions.json");
var filepath = './yamlPermissions.yaml';
var yamlString = fs.readFileSync(filepath, 'utf8');
var yamlPermissions = yaml.parse(yamlString);
var Methods;
(function (Methods) {
    Methods[Methods["current_method"] = 0] = "current_method";
    Methods[Methods["json_id_route"] = 1] = "json_id_route";
    Methods[Methods["json_route_id"] = 2] = "json_route_id";
    Methods[Methods["json_role_route"] = 3] = "json_role_route";
    Methods[Methods["json_route_role"] = 4] = "json_route_role";
    Methods[Methods["yaml_id_route"] = 5] = "yaml_id_route";
    Methods[Methods["yaml_route_id"] = 6] = "yaml_route_id";
    Methods[Methods["yaml_role_route"] = 7] = "yaml_role_route";
    Methods[Methods["yaml_route_role"] = 8] = "yaml_route_role";
})(Methods || (Methods = {}));
var CustomerRoleId;
(function (CustomerRoleId) {
    CustomerRoleId[CustomerRoleId["admin"] = 1] = "admin";
    CustomerRoleId[CustomerRoleId["dataScientist"] = 2] = "dataScientist";
    CustomerRoleId[CustomerRoleId["viewer"] = 3] = "viewer";
})(CustomerRoleId || (CustomerRoleId = {}));
var Customer = /** @class */ (function () {
    function Customer(customerRoleId) {
        this.customerRoleId = customerRoleId;
    }
    return Customer;
}());
var JSONCustomer = /** @class */ (function () {
    function JSONCustomer(customerRoleId) {
        this.customerRoleId = customerRoleId;
    }
    return JSONCustomer;
}());
var customer = new Customer(CustomerRoleId.admin);
var newCustomer = new JSONCustomer(CustomerRoleId.dataScientist);
var numExecutions = 1000;
var numMethods = Object.keys(Methods).filter(function (key) { return isNaN(Number(key)); }).length;
var startTime = new Array(numMethods).fill(0);
var endTime = new Array(numMethods).fill(0);
var executionTime = new Array(numMethods).fill(0);
var mockVariable = 0;
for (var i = 0; i < numExecutions; i++) {
    // ATUAL
    startTime[0] = perf_hooks_1.performance.now();
    if (customer.customerRoleId === CustomerRoleId.admin)
        mockVariable = 1;
    endTime[0] = perf_hooks_1.performance.now();
    executionTime[0] += endTime[0] - startTime[0];
    // JSON
    startTime[1] = perf_hooks_1.performance.now();
    if (jsonPermissions.backendById[newCustomer.customerRoleId].createRoute)
        mockVariable = 1;
    endTime[1] = perf_hooks_1.performance.now();
    executionTime[1] += endTime[1] - startTime[1];
    startTime[2] = perf_hooks_1.performance.now();
    mockVariable = 1;
    endTime[2] = perf_hooks_1.performance.now();
    executionTime[2] += endTime[2] - startTime[2];
    startTime[3] = perf_hooks_1.performance.now();
    if (jsonPermissions.backendByRole[CustomerRoleId[newCustomer.customerRoleId]].createRoute)
        mockVariable = 1;
    endTime[3] = perf_hooks_1.performance.now();
    executionTime[3] += endTime[3] - startTime[3];
    startTime[4] = perf_hooks_1.performance.now();
    if (jsonPermissions.backendRouteByRole.createRoute[CustomerRoleId[newCustomer.customerRoleId]])
        mockVariable = 1;
    endTime[4] = perf_hooks_1.performance.now();
    executionTime[4] += endTime[4] - startTime[4];
    // YML
    startTime[5] = perf_hooks_1.performance.now();
    if (yamlPermissions.backendById[newCustomer.customerRoleId].createRoute)
        mockVariable = 1;
    endTime[5] = perf_hooks_1.performance.now();
    executionTime[5] += endTime[5] - startTime[5];
    startTime[6] = perf_hooks_1.performance.now();
    if (yamlPermissions.backendRouteById.createRoute[newCustomer.customerRoleId])
        mockVariable = 1;
    endTime[6] = perf_hooks_1.performance.now();
    executionTime[6] += endTime[6] - startTime[6];
    startTime[7] = perf_hooks_1.performance.now();
    if (yamlPermissions.backendByRole[CustomerRoleId[newCustomer.customerRoleId]].createRoute)
        mockVariable = 1;
    endTime[7] = perf_hooks_1.performance.now();
    executionTime[7] += endTime[7] - startTime[7];
    startTime[8] = perf_hooks_1.performance.now();
    if (yamlPermissions.backendRouteByRole.createRoute[CustomerRoleId[newCustomer.customerRoleId]])
        mockVariable = 1;
    endTime[8] = perf_hooks_1.performance.now();
    executionTime[8] += endTime[8] - startTime[8];
}
var rows = [];
for (var i = 0; i < numMethods; i++) {
    executionTime[i] = executionTime[i] / numExecutions;
    console.log("".concat(Methods[i], "\t:\t").concat(executionTime[i].toFixed(10), " ms"));
    rows[i] = [Methods[i], executionTime[i].toFixed(10)];
}
var header = ["method", "execution_time"];
var csvStr = __spreadArray([header], rows, true).join('\n');
var csvPath = path.join(__dirname, "execution_time.csv");
try {
    fs.writeFileSync(csvPath, csvStr, 'utf-8');
}
catch (err) {
    console.error("Erro ao escrever o arquivo CSV: ", err);
}
